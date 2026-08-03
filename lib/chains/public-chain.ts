/**
 * 公开问答链 - 别人提问，AI 基于你的记忆回答
 */

import { getChatModel } from '../llm';
import { buildSystemPrompt } from '../memory/manager';
import type { ConversationMessage } from '../memory/types';

/**
 * 处理公开问答请求
 *
 * @param query - 用户的问题
 * @param shortTermMessages - 当前会话的短期记忆
 * @returns AI 的回答文本
 */
export async function handlePublicQuery(
  query: string,
  shortTermMessages: ConversationMessage[]
): Promise<string> {
  // 构建包含长期记忆和人格的 System Prompt
  const systemPrompt = await buildSystemPrompt(query, shortTermMessages);

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...shortTermMessages.slice(-10).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: query },
  ];

  try {
    const response = await getChatModel().invoke(messages);

    const answer =
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

    return answer;
  } catch (error) {
    console.error('公开问答处理出错:', error);
    return '抱歉，我现在暂时无法回答这个问题。请稍后再试。';
  }
}
