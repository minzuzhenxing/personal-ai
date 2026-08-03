/**
 * 文档解析器 - 解析 Word 文档并提取结构化记忆
 */

import { getChatModel } from '../llm';
import type { CreateMemoryInput } from '../memory/types';

/**
 * 解析 Word 文档的文本内容（使用 mammoth）
 */
export async function parseWordDocument(
  fileBuffer: ArrayBuffer
): Promise<string> {
  // 动态导入 mammoth（避免在 edge runtime 中加载失败）
  const mammoth = await import('mammoth');

  const result = await mammoth.extractRawText({
    buffer: Buffer.from(fileBuffer),
  });

  return result.value;
}

/**
 * 从文档文本中提取结构化记忆
 *
 * @param documentText - 文档的纯文本内容
 * @param fileName - 文档文件名（用于标识来源）
 * @returns 提取到的记忆输入列表
 */
export async function extractMemoriesFromDocument(
  documentText: string,
  fileName: string
): Promise<CreateMemoryInput[]> {
  // 截断过长的文档（避免超出 token 限制）
  const maxLength = 8000;
  const truncatedText =
    documentText.length > maxLength
      ? documentText.slice(0, maxLength) +
        '\n\n[... 文档过长，以下内容已截断 ...]'
      : documentText;

  const prompt = `你是一个信息提取专家。请仔细阅读以下文档（来自文件 "${fileName}"），
提取出关于文档中描述的**人物**的所有事实信息，转化为结构化的长期记忆。

文档内容：
---
${truncatedText}
---

请以 JSON 数组格式返回提取到的记忆，每条记忆包含：
- content: 用第一人称的自然语言描述事实（如："我毕业于清华大学计算机系"）
- category: 分类标签（personal_info/education/work_experience/skills/projects/interests/personality/values/goals/contact/other）
- tags: 2-4 个关键词标签（数组）
- importance: 0-1 之间（0.3=琐碎信息, 0.6=有用信息, 0.9=核心身份信息）

**重要规则：**
- 每条 memory 的 content 必须是独立的、完整的句子
- 提取所有有价值的信息，不要遗漏
- 去除重复或高度相似的内容
- 如果文档中某类信息没有提及，就不要编造

请直接返回 JSON 数组，不要包含其他文字：`;

  try {
    const response = await getChatModel({ temperature: 0.1 }).invoke(prompt);
    const text =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: Record<string, unknown>) => ({
      content: String(item.content || ''),
      category: (
        isValidMemoryCategory(item.category) ? item.category : 'other'
      ) as CreateMemoryInput['category'],
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      source: 'document' as const,
      importance: typeof item.importance === 'number'
        ? Math.max(0, Math.min(1, item.importance))
        : 0.5,
    }));
  } catch (error) {
    console.error('文档记忆提取失败:', error);
    return [];
  }
}

function isValidMemoryCategory(value: unknown): boolean {
  const validCategories = [
    'personal_info', 'education', 'work_experience', 'skills',
    'projects', 'interests', 'personality', 'values', 'goals',
    'contact', 'other',
  ];
  return typeof value === 'string' && validCategories.includes(value);
}
