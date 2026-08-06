/**
 * 全局配置 + 简历数据
 */

// ========== 通义千问 API ==========
export const QWEN_CONFIG = {
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: process.env.QWEN_MODEL || 'qwen-plus',
  embeddingModel: process.env.QWEN_EMBEDDING_MODEL || 'text-embedding-v2',
  maxTokens: 2048,
  temperature: 0.7,
};

// ========== Redis ==========
// 优先级: Vercel KV (Upstash REST) > REDIS_URL (标准 Redis) > 内存模式
// Vercel 创建 Upstash Storage 后会自动注入以下两个变量
const _kvRestUrl = process.env.KV_REST_API_URL || '';
const _kvRestToken = process.env.KV_REST_API_TOKEN || '';
const _redisUrl = process.env.REDIS_URL || '';

export const REDIS_CONFIG = {
  // Vercel KV (REST API)
  kvRestUrl: _kvRestUrl,
  kvRestToken: _kvRestToken,
  // 标准 Redis (TCP)
  url: _redisUrl,
  host: process.env.REDIS_HOST || '',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || '',
  // 自动判断用什么模式
  mode: (_kvRestUrl && _kvRestToken
    ? 'vercel-kv'
    : _redisUrl
      ? 'redis'
      : 'memory') as 'vercel-kv' | 'redis' | 'memory',
};

// ========== 管理端 ==========
export const ADMIN_CONFIG = {
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

// ========== AI 人格 ==========
export const PERSONA_CONFIG = {
  name: process.env.NEXT_PUBLIC_PERSONA_NAME || '张子平',
  bio: process.env.NEXT_PUBLIC_PERSONA_BIO || '我是一名热爱技术的开发者。',
};

// ========== Redis Keys ==========
export const REDIS_KEYS = {
  memories: 'memories',
  memoryIndex: 'memory_index',
  conversations: 'conversations',
  shortTermMemory: 'short_term_memory',
} as const;

export const MEMORY_CONFIG = {
  maxShortTermMessages: 20,
  maxRetrievedMemories: 10,
  memoryRelevanceThreshold: 0.6,
};

// ========== 简历数据 ==========
export const RESUME_DATA = {
  name: '张子平',
  age: 21,
  gender: '男',
  politicalStatus: '共青团员',
  phone: '19214137923',
  email: '1959931064@qq.com',
  tagline: '后端开发 & AI 工程师',
  heroDescriptions: [
    'Java 后端开发',
    'SpringAI 智能开发',
    '微服务架构',
    'AI Agent 优化',
  ],

  // 关于我 - 统计数字
  stats: [
    { label: '年龄', value: '21', suffix: '岁', icon: '🎂' },
    { label: '就读院校', value: '东北大学', suffix: '', icon: '🎓' },
    { label: '项目经验', value: '4', suffix: '个', icon: '💼' },
    { label: '核心技能', value: '8', suffix: '+', icon: '⚡' },
  ],

  // 教育背景
  education: [
    {
      school: '东北大学',
      major: '软件工程',
      degree: '本科',
      period: '2023.09 — 至今',
      courses: ['C 语言', 'Java 程序设计', '操作系统', '计算机网络', '计算机组成原理', '人工智能', '云计算'],
      highlights: '系统掌握计算机底层原理、后端开发、人工智能、云计算核心理论知识，具备扎实的软件工程专业功底，能够快速落地技术项目开发与 AI 功能迭代工作。',
    },
  ],

  // 实习经历
  experience: [
    {
      company: '东软医疗',
      role: '后端 & AI 开发实习生',
      period: '2026.05 — 2026.07',
      project: '云脑智能诊疗系统',
      summary: '依托企业级微服务架构，负责患者端整体功能开发与 AI 智能模块迭代优化，深度落地商业化医疗智能场景。',
      details: [
        {
          icon: '🏗️',
          title: '业务系统搭建',
          desc: '采用 SpringBoot + MyBatis 前后端分离架构搭建患者端业务系统，基于微服务体系完成功能开发、接口调试、数据交互。',
        },
        {
          icon: '🤖',
          title: 'AI Agent 优化',
          desc: '深度深耕 SpringAI 智能开发模块，通过参数调优、对话逻辑迭代、场景适配调教，大幅提升 AI 回复精准度与智能化水平。',
        },
        {
          icon: '🏥',
          title: '医疗智能化落地',
          desc: '实现智能问诊、无人挂号、自动缴费全流程 AI 无人服务，优化患者就医体验，降低医院人工服务成本。',
        },
        {
          icon: '👥',
          title: '企业级开发实践',
          desc: '熟悉企业级项目开发规范、团队协作流程与线上项目运维逻辑，具备商业化智能系统的开发与优化实战能力。',
        },
      ],
    },
  ],

  // 项目经验
  projects: [
    {
      name: '个人 AI 数字分身（已上线）',
      role: '独立开发',
      techStack: ['Next.js 14', 'TypeScript', 'LangChain', '通义千问', 'Upstash Redis', 'Framer Motion', 'Vercel'],
      description: '基于 LangChain 框架和通义千问大模型构建的个人 AI 数字分身展示网站，已部署上线并获得独立域名。实现 AI 智能问答、长期记忆系统、对话式记忆自动提取等核心功能。',
      details: [
        '独立完成全栈开发与部署，使用 Next.js 14 App Router + TypeScript，搭建公开端展示页与管理端 AI 记忆构建系统',
        '基于 LangChain 集成通义千问 qwen-plus 大模型，设计短期记忆+长期记忆（RAG 检索增强）双层记忆架构',
        '前端采用 Framer Motion 实现滚动驱动动画效果，后端通过 Upstash Redis 实现记忆云端持久化',
      ],
      color: 'bg-white/80',
    },
    {
      name: '智慧校园多端课程管理系统',
      role: 'AI 模块负责人',
      techStack: ['SpringBoot', 'MyBatis', 'SpringAI', 'Dify', '前后端分离'],
      description: '面向高校师生的多端一体化课程管理系统，创新性接入 AI 智能管理模块，提升校园教务智能化水平。',
      details: [
        '独立负责 SpringAI 智能模块的研发与设计，为系统搭建智能化核心能力',
        '基于 Dify 平台自主搭建 AI 工作流，结合校园场景对大模型进行针对性微调',
        '落地 AI 对话答疑、课程数据智能分析、课堂笔记自动整理、课程学习总结生成等功能',
      ],
      color: 'bg-white/80',
    },
    {
      name: '医疗微服务管理系统',
      role: '微服务开发组成员',
      techStack: ['SpringBoot', 'MyBatis', 'Nacos', '微服务架构'],
      description: '基于分布式微服务架构开发的综合性医院管理系统，覆盖医院日常运营核心业务。',
      details: [
        '依托 Nacos 组件参与微服务架构搭建、服务注册、配置管理与模块联调',
        '开发线上挂号、科室查询、患者信息管理、诊疗记录存储等核心医疗功能',
        '配合团队完成模块测试、Bug 修复与功能优化，保障系统高可用',
      ],
      color: 'from-accent-500 to-primary-500',
    },
  ],

  // 技能分类
  skills: [
    {
      category: '后端开发',
      color: 'from-primary-400 to-primary-600',
      items: [
        { name: 'Java', level: 85 },
        { name: 'SpringBoot', level: 80 },
        { name: 'MyBatis', level: 75 },
        { name: '微服务架构', level: 70 },
        { name: 'Nacos', level: 65 },
      ],
    },
    {
      category: 'AI & 智能化',
      color: 'from-cyan-400 to-teal-500',
      items: [
        { name: 'SpringAI', level: 85 },
        { name: 'AI Agent 优化', level: 80 },
        { name: 'Dify 工作流', level: 75 },
        { name: '大模型微调', level: 70 },
      ],
    },
    {
      category: '工程能力',
      color: 'from-accent-400 to-accent-600',
      items: [
        { name: '企业开发规范', level: 80 },
        { name: '团队协作', level: 85 },
        { name: '需求分析', level: 75 },
        { name: '问题排查', level: 78 },
      ],
    },
  ],

  // 校园经历
  campus: {
    role: '学生会办公室部门 · 部长',
    period: '2025.03 — 2026.03',
    description: '统筹部门工作，负责校内大型活动审批、活动善后及经费报账管理。联动文艺、体育等多部门协同推进活动落地，保障十余场校级活动顺利举办。',
  },

  // 自我评价
  selfEvaluation: '为人随和热心，善于活跃团队氛围，处事稳重不卑不亢。热爱钻研技术，乐于深挖问题根源，沟通协调能力良好，责任心强，适配团队协同开发工作。',
};
