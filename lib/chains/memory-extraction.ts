/**
 * 记忆提取链 - 从对话中自动提取用户信息并存入长期记忆
 */

import {
  extractMemoriesFromConversation,
  saveExtractedMemories,
} from '../memory/manager';
import type { ConversationMessage } from '../memory/types';

/**
 * 从一轮对话中提取并保存记忆
 *
 * @param messages - 最近的对话消息（包含用户和 AI 的往返）
 * @returns 新提取并保存的记忆数量
 */
export async function extractAndSaveMemories(
  messages: ConversationMessage[]
): Promise<{
  extractedCount: number;
  savedCount: number;
  newFacts: string[];
}> {
  // 提取记忆
  const inputs = await extractMemoriesFromConversation(messages);

  if (inputs.length === 0) {
    return { extractedCount: 0, savedCount: 0, newFacts: [] };
  }

  // 保存记忆
  const savedCount = await saveExtractedMemories(inputs);

  return {
    extractedCount: inputs.length,
    savedCount,
    newFacts: inputs.map((i) => i.content),
  };
}
