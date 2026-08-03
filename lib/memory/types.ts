/**
 * 记忆系统类型定义
 */

/** 单条长期记忆 */
export interface Memory {
  id: string;
  /** 记忆内容（自然语言描述的事实） */
  content: string;
  /** 分类标签 */
  category: MemoryCategory;
  /** 自定义标签 */
  tags: string[];
  /** 来源: document=文档导入, conversation=对话提取, manual=手动添加 */
  source: 'document' | 'conversation' | 'manual';
  /** 重要性权重 0-1，越高越容易被检索到 */
  importance: number;
  /** 内容向量（用于语义检索） */
  embedding?: number[];
  /** 创建时间 ISO 字符串 */
  createdAt: string;
  /** 更新时间 ISO 字符串 */
  updatedAt: string;
}

/** 记忆分类 */
export type MemoryCategory =
  | 'personal_info'      // 基本信息（姓名、年龄、所在地等）
  | 'education'          // 教育经历
  | 'work_experience'    // 工作经历
  | 'skills'             // 技能特长
  | 'projects'           // 项目经验
  | 'interests'          // 兴趣爱好
  | 'personality'        // 性格特点
  | 'values'             // 价值观、理念
  | 'goals'              // 目标、规划
  | 'contact'            // 联系方式
  | 'other';             // 其他

/** 记忆分类的中文标签 */
export const CATEGORY_LABELS: Record<MemoryCategory, string> = {
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

/** 短期记忆中的消息 */
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/** 短期记忆会话 */
export interface ConversationSession {
  id: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

/** 记忆检索结果 */
export interface MemoryRetrievalResult {
  memory: Memory;
  /** 相关性分数 0-1 */
  relevanceScore: number;
}

/** 创建记忆的输入 */
export type CreateMemoryInput = Pick<Memory, 'content' | 'category' | 'tags' | 'source' | 'importance'>;

/** 更新记忆的输入 */
export type UpdateMemoryInput = Partial<Pick<Memory, 'content' | 'category' | 'tags' | 'importance'>>;
