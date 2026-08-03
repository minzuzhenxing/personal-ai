/**
 * LLM 配置 - 通义千问（OpenAI 兼容模式）
 */

import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QWEN_CONFIG } from './config';

/**
 * 获取通义千问 Chat 模型实例
 */
export function getChatModel(options?: {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}) {
  return new ChatOpenAI({
    apiKey: QWEN_CONFIG.apiKey,
    configuration: {
      baseURL: QWEN_CONFIG.baseURL,
    },
    modelName: options?.model || QWEN_CONFIG.model,
    temperature: options?.temperature ?? QWEN_CONFIG.temperature,
    maxTokens: options?.maxTokens ?? QWEN_CONFIG.maxTokens,
  });
}

/**
 * 获取通义千问 Embedding 模型实例
 */
export function getEmbeddingModel() {
  return new OpenAIEmbeddings({
    apiKey: QWEN_CONFIG.apiKey,
    configuration: {
      baseURL: QWEN_CONFIG.baseURL,
    },
    modelName: QWEN_CONFIG.embeddingModel,
  });
}

/**
 * 预配置的 LLM 实例（默认参数）- 懒加载
 */
let _llm: ChatOpenAI | null = null;
export function llm(): ChatOpenAI {
  if (!_llm) _llm = getChatModel();
  return _llm;
}

/**
 * 用于 JSON 结构化输出的 LLM（低温度，更确定性）- 懒加载
 */
let _llmStructured: ChatOpenAI | null = null;
export function llmStructured(): ChatOpenAI {
  if (!_llmStructured) _llmStructured = getChatModel({ temperature: 0.1 });
  return _llmStructured;
}
