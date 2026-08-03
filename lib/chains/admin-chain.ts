/**
 * 管理端对话链 - 用于构建记忆的人机对话
 *
 * 这个对话的核心目的是：通过自然的聊天，了解用户的各方面信息，
 * 并自动将这些信息提取为结构化记忆存储起来。
 */

import { getChatModel } from '../llm';
import { PERSONA_CONFIG } from '../config';
import { extractAndSaveMemories } from './memory-extraction';
import { getAllMemories } from '../memory/store';
import type { ConversationMessage, Memory } from '../memory/types';

/**
 * 管理端对话处理
 *
 * AI 会像一个采访者一样与用户交流，
 * 逐步了解用户的各个方面，同时自动提取和存储记忆。
 */
export async function handleAdminChat(
  userMessage: string,
  conversationHistory: ConversationMessage[]
): Promise<{
  reply: string;
  newMemories: string[];
}> {
  // 获取已有的所有记忆，用于了解已经掌握了哪些信息
  const existingMemories = await getAllMemories();

  // 找出记忆中的空白领域，引导对话方向
  const coveredCategories = new Set(existingMemories.map((m) => m.category));
  const allCategories = [
    'personal_info', 'education', 'work_experience', 'skills',
    'projects', 'interests', 'personality', 'values', 'goals', 'contact',
  ];
  const missingCategories = allCategories.filter((c) => !coveredCategories.has(c as Memory['category']));

  const missingCategoryLabels = missingCategories.map((c) => {
    const labels: Record<string, string> = {
      personal_info: '基本信息', education: '教育经历',
      work_experience: '工作经历', skills: '技能特长',
      projects: '项目经验', interests: '兴趣爱好',
      personality: '性格特点', values: '价值观',
      goals: '目标规划', contact: '联系方式',
    };
    return labels[c] || c;
  });

  const memorySummary = existingMemories.length > 0
    ? `目前已记录 ${existingMemories.length} 条记忆。\n已覆盖的领域：${Array.from(coveredCategories).map(c => {
        const labels: Record<string, string> = {
          personal_info: '基本信息', education: '教育经历',
          work_experience: '工作经历', skills: '技能特长',
          projects: '项目经验', interests: '兴趣爱好',
          personality: '性格特点', values: '价值观',
          goals: '目标规划', contact: '联系方式',
        };
        return labels[c] || c;
      }).join('、')}\n还缺少的领域：${missingCategoryLabels.join('、') || '无'}`
    : '目前还没有任何记忆记录。';

  const systemPrompt = `你是一个友好、专业的 AI 采访者。你的任务是帮助用户 **${PERSONA_CONFIG.name}** 建立他们的 AI 数字分身。

## 你的工作方式

1. **自然对话**：像朋友聊天一样自然地了解用户，不要像问卷调查
2. **引导话题**：重点关注尚未覆盖的领域，巧妙地引导对话
3. **深入挖掘**：当用户提到有趣的点时，追问细节
4. **记录信息**：对话中的关键信息会被自动提取为长期记忆

## 用户的基本信息
${PERSONA_CONFIG.bio}

## 当前记忆状态
${memorySummary}

## 对话策略

- 如果记忆较少，主动询问用户的基本信息（教育、工作、技能等）
- 每次对话聚焦 1-2 个主题，不要一次问太多
- 对用户分享的内容表示兴趣，追问有趣的细节
- 用轻松、鼓励的语气，让用户愿意分享
- 适时总结你了解到的信息，让用户确认

## 当前对话

请以自然、友好的方式回复用户。你的回复会被自动分析，其中的关键事实会被提取为长期记忆。`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.slice(-15).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const response = await getChatModel().invoke(messages);
    const reply =
      typeof response.content === 'string'
        ? response.content
        : Array.isArray(response.content)
        ? response.content
            .map((part) => {
              const p = part as { type?: string; text?: string };
              return p.type === 'text' ? p.text || '' : '';
            })
            .join('')
        : JSON.stringify(response.content);

    // 异步提取并保存记忆
    const allMessages: ConversationMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
      { role: 'assistant', content: reply, timestamp: new Date().toISOString() },
    ];

    const { newFacts } = await extractAndSaveMemories(allMessages);

    return { reply, newMemories: newFacts };
  } catch (error) {
    console.error('管理端对话处理出错:', error);
    return {
      reply: '抱歉，处理你的消息时出现了一些问题。请稍后再试。',
      newMemories: [],
    };
  }
}
