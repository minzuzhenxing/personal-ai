/**
 * 记忆管理器 - 记忆的提取、检索和整合
 *
 * 核心功能:
 * 1. 从对话中自动提取关于用户的事实信息
 * 2. 根据查询检索相关记忆
 * 3. 整合短期记忆（当前对话）+ 长期记忆（持久化事实）
 */

import { getChatModel } from '../llm';
import { PERSONA_CONFIG, MEMORY_CONFIG } from '../config';
import {
  getAllMemories,
  searchMemories,
  createMemoriesBatch,
} from './store';
import type {
  Memory,
  MemoryRetrievalResult,
  ConversationMessage,
  CreateMemoryInput,
} from './types';

/**
 * 从对话消息中提取关于用户的事实记忆
 *
 * @param messages - 最近的对话消息
 * @returns 提取到的记忆输入列表
 */
export async function extractMemoriesFromConversation(
  messages: ConversationMessage[]
): Promise<CreateMemoryInput[]> {
  const conversationText = messages
    .map((m) => `${m.role === 'user' ? '👤 用户' : '🤖 AI'}: ${m.content}`)
    .join('\n');

  // 获取已有记忆，让 LLM 只提取尚未记录的新事实
  let existingSummary = '暂无已记录的记忆。';
  try {
    const existing = await getAllMemories();
    if (existing.length > 0) {
      existingSummary = existing.map((m) => `- ${m.content}`).join('\n');
    }
  } catch (e) {
    console.error('获取已有记忆失败:', e);
  }

  const prompt = `你是一个记忆提取器。请仔细分析以下对话，提取出关于"用户"（👤）的所有**新的事实信息**。

这些信息将成为 AI 的长期记忆，用于将来代替用户回答问题。请提取以下类型的信息：

- **personal_info**: 姓名、年龄、所在地、联系方式等基本信息
- **education**: 学校、专业、学位、毕业时间等教育经历
- **work_experience**: 公司、职位、工作时间、职责等工作经历
- **skills**: 编程语言、框架、工具、软技能等
- **projects**: 做过的项目、负责的内容、成果等
- **interests**: 兴趣爱好、关注领域等
- **personality**: 性格特点、工作风格、沟通方式等
- **values**: 职业价值观、人生理念等
- **goals**: 职业目标、学习计划、人生规划等
- **contact**: 邮箱、手机、LinkedIn、GitHub 等联系方式
- **other**: 其他值得记录的信息

对话内容：
${conversationText}

**用户已有的长期记忆（避免重复提取）：**
${existingSummary}

请以 JSON 数组格式返回提取到的记忆，每条记忆包含：
- content: 用第一人称的自然语言描述事实（如："我毕业于清华大学计算机系"）
- category: 上述分类之一
- tags: 2-4 个关键词标签
- importance: 0-1 之间的重要性权重（0.3=琐碎信息, 0.6=有用信息, 0.9=核心身份信息）

**重要规则：**
- 只提取关于用户（👤）的信息，不要提取关于 AI 的信息
- 只提取**新的**事实信息：凡是"已有长期记忆"中已经包含的，或与之含义相同的信息，都不要重复提取
- 如果用户明确说出了新的偏好、经历、身份信息，即使只是对话中的一句，也要提取
- 如果没有新的有价值信息，返回空数组 []
- 每条 memory 的 content 必须是独立的、完整的句子
- 具体信息要保留原文（品牌名、公司名、学校名等不要改写）

请直接返回 JSON 数组，不要包含其他文字：`;

  try {
    const response = await getChatModel({ temperature: 0.1 }).invoke(prompt);
    const text = typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

    // 尝试从回复中提取 JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: Record<string, unknown>) => ({
      content: String(item.content || ''),
      category: (
        isValidCategory(item.category) ? item.category : 'other'
      ) as CreateMemoryInput['category'],
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      source: 'conversation' as const,
      importance: typeof item.importance === 'number'
        ? Math.max(0, Math.min(1, item.importance))
        : 0.5,
    }));
  } catch (error) {
    console.error('记忆提取失败:', error);
    return [];
  }
}

/**
 * 根据查询检索最相关的记忆
 * 使用 AI 增强的两阶段检索：
 * 1. 关键词匹配初筛
 * 2. AI 对候选记忆进行相关性排序
 */
export async function retrieveRelevantMemories(
  query: string,
  limit: number = MEMORY_CONFIG.maxRetrievedMemories
): Promise<MemoryRetrievalResult[]> {
  // 第一阶段：关键词搜索
  const keywordResults = await searchMemories(query);

  // 如果没有结果，返回空
  if (keywordResults.length === 0) return [];

  // 第二阶段：如果记忆数量较少，直接返回 top-N
  if (keywordResults.length <= limit) {
    return keywordResults;
  }

  // 记忆较多时，用 AI 进行重排序
  const candidateMemories = keywordResults.slice(0, limit * 2);

  const rankingPrompt = `你是一个记忆检索助手。根据用户的问题，对以下记忆进行相关性排序。

用户问题：${query}

候选记忆：
${candidateMemories.map((r, i) => `[${i}] ${r.memory.content}`).join('\n')}

请选出最相关的 ${limit} 条记忆，以 JSON 数组返回索引号（从 0 开始），按相关性从高到低排列：
例如：[3, 0, 7, 1, 5]

请直接返回 JSON 数组，不要包含其他文字：`;

  try {
    const response = await getChatModel({ temperature: 0.1 }).invoke(rankingPrompt);
    const text = typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      return candidateMemories.slice(0, limit);
    }

    const indices: number[] = JSON.parse(jsonMatch[0]);
    return indices
      .filter((i) => i >= 0 && i < candidateMemories.length)
      .slice(0, limit)
      .map((i) => candidateMemories[i]);
  } catch {
    return candidateMemories.slice(0, limit);
  }
}

/**
 * 构建完整的 System Prompt（人格 + 长期记忆 + 对话上下文）
 */
export async function buildSystemPrompt(
  query: string,
  shortTermMessages: ConversationMessage[]
): Promise<string> {
  // 获取所有记忆
  const allMemories = await getAllMemories();

  // 检索相关记忆
  let relevantMemories = await retrieveRelevantMemories(query);

  // 安全网：如果检索结果为空但存在记忆，回退使用最近的记忆作为上下文
  if (relevantMemories.length === 0 && allMemories.length > 0) {
    const fallbackMemories = allMemories
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, MEMORY_CONFIG.maxRetrievedMemories);
    relevantMemories = fallbackMemories.map((memory) => ({ memory, relevanceScore: 0 }));
  }

  // 按分类组织记忆
  const memoriesByCategory: Record<string, Memory[]> = {};
  for (const { memory } of relevantMemories) {
    if (!memoriesByCategory[memory.category]) {
      memoriesByCategory[memory.category] = [];
    }
    memoriesByCategory[memory.category].push(memory);
  }

  // 构建记忆文本
  const memorySections: string[] = [];
  for (const [category, memories] of Object.entries(memoriesByCategory)) {
    const categoryLabel = getCategoryLabel(category);
    const facts = memories.map((m) => `- ${m.content}`).join('\n');
    memorySections.push(`### ${categoryLabel}\n${facts}`);
  }

  const memoryText = memorySections.length > 0
    ? memorySections.join('\n\n')
    : '暂无相关长期记忆。';

  // 构建短期记忆（最近的对话）
  const recentMessages = shortTermMessages.slice(-MEMORY_CONFIG.maxShortTermMessages);
  const shortTermText = recentMessages
    .map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
    .join('\n');

  return `# 身份设定

你是 **${PERSONA_CONFIG.name}** 的 AI 数字分身。你需要以第一人称（"我"）来回答问题，就像你是 ${PERSONA_CONFIG.name} 本人一样。

## 你的基本人设
${PERSONA_CONFIG.bio}

## 长期记忆（关于你的事实信息）

${memoryText}

## 近期对话
${shortTermText || '（暂无）'}

---

# 回答规则

1. **用第一人称回答**：始终以"我"的口吻回答问题，你就是 ${PERSONA_CONFIG.name}
2. **基于记忆回答**：优先使用上述长期记忆中的信息回答，如果不能确定，坦诚表示"这个问题我目前无法回答"
3. **保持一致性**：你的回答要与记忆中的信息完全一致，不要编造记忆中没有的内容
4. **展现个性**：根据记忆中的性格特点，用合适的语气和风格回答
5. **适度延伸**：可以在记忆基础上做合理的自然延伸，但要让人感觉真实
6. **保护隐私**：不要透露你不应该透露的敏感信息（如具体联系方式、身份证号等），可以模糊处理

现在，请以 ${PERSONA_CONFIG.name} 的身份回答用户的问题。`;
}

/**
 * 辅助函数
 */
function isValidCategory(value: unknown): boolean {
  const validCategories = [
    'personal_info', 'education', 'work_experience', 'skills',
    'projects', 'interests', 'personality', 'values', 'goals',
    'contact', 'other',
  ];
  return typeof value === 'string' && validCategories.includes(value);
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    personal_info: '基本信息',
    education: '教育经历',
    work_experience: '工作经历',
    skills: '技能特长',
    projects: '项目经验',
    interests: '兴趣爱好',
    personality: '性格特点',
    values: '价值观',
    goals: '目标规划',
    contact: '联系方式',
    other: '其他',
  };
  return labels[category] || category;
}

/**
 * 保存提取的记忆到长期存储
 */
export async function saveExtractedMemories(
  inputs: CreateMemoryInput[]
): Promise<number> {
  if (inputs.length === 0) return 0;

  const existingMemories = await getAllMemories();

  // 归一化：去空白和常见标点，用于判断重复
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[\s，。！？、,。!?'"“”·-]+/g, '');

  const existingNorm = existingMemories.map((m) => normalize(m.content));

  const newInputs = inputs.filter((input) => {
    const inputNorm = normalize(input.content);

    // 只跳过"几乎完全相同"的重复：
    // 1. 归一化后完全相等
    // 2. 新内容是已有记忆的子串，或已有记忆是新内容的子串（且较短方长度≥4）
    const isDuplicate = existingNorm.some((ec) => {
      if (inputNorm === ec) return true;
      const minLen = Math.min(inputNorm.length, ec.length);
      if (minLen < 4) return false;
      return inputNorm.includes(ec) || ec.includes(inputNorm);
    });

    return !isDuplicate;
  });

  if (newInputs.length === 0) return 0;

  await createMemoriesBatch(newInputs);
  return newInputs.length;
}
