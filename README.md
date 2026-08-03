# npm install🤖 个人 AI 数字分身

一个基于**通义千问**大模型和 **LangChain** 框架构建的个人 AI 助手。通过学习你的个人信息、经历和性格，AI 可以代替你回答问题——非常适合面试求职时展示技术能力。

## ✨ 功能特性

### 公开页面（面向访问者）

- 🎯 **智能问答**：访问者提问，AI 以你的身份回答
- 🎨 **精美 UI**：现代化设计，响应式布局，Markdown 渲染
- 💾 **短期记忆**：保持对话上下文连贯性
- 🔒 **身份隔离**：只能基于你授权的记忆回答

### 管理端（仅你本人访问）

- 🔐 **密码保护**：管理端完全隐藏，需要密码登录
- 💬 **对话构建**：通过自然对话让 AI 了解你的信息，自动提取记忆
- 📄 **文档导入**：上传 Word 文档，AI 自动解析并提取结构化记忆
- 🧠 **记忆管理**：查看、筛选、删除长期记忆
- 🏷️ **智能分类**：自动将记忆分为教育、工作、技能等 11 个类别

### 记忆系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      记忆系统                            │
├─────────────────────┬───────────────────────────────────┤
│   短期记忆           │   长期记忆                         │
│   (Redis / 内存)    │   (Redis / 内存)                  │
│                     │                                   │
│   • 对话历史         │   • 结构化事实记忆                  │
│   • 上下文窗口       │   • 分类标签系统                   │
│   • 1 小时 TTL      │   • 重要性权重                     │
│   • 最多 30 条       │   • 关键词搜索 + AI 重排序          │
└─────────────────────┴───────────────────────────────────┘
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd personal-ai
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的真实配置：

```env
# 通义千问 API（在阿里云百炼平台申请）
DASHSCOPE_API_KEY=sk-your-api-key
QWEN_MODEL=qwen-plus

# Redis（持久化记忆 - 强烈推荐 Vercel KV）
# 从 Vercel Storage 创建 Upstash Redis 后复制 KV_URL 填入
# 格式: redis://default:密码@主机.upstash.io:6379
REDIS_URL=
REDIS_MODE=redis

# 管理端密码
ADMIN_PASSWORD=your-secret-password

# 你的基本信息（作为 AI 初始人格）
NEXT_PUBLIC_PERSONA_NAME=张三
NEXT_PUBLIC_PERSONA_BIO=我是一名经验丰富的全栈工程师，擅长 React 和 Node.js...
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问：

- 公开页面：http://localhost:3000
- 管理端：http://localhost:3000/admin

### 5. 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 在 Vercel 项目设置中配置所有环境变量（同 `.env.local.example`）
4. 部署！

### 6. 配置 Vercel KV（持久化记忆）

> ⚠️ 不配置 Redis 的话，Vercel 的 serverless 函数是无状态的，记忆会随机丢失！

1. 在 Vercel 项目页面点击顶部 **Storage** 标签
2. 点击 **Create Database** → 选择 **Upstash** → 选 **Redis** → 创建
3. 创建完成后，Vercel 会自动注入 `KV_URL`、`KV_REST_API_URL`、`KV_REST_API_TOKEN`
4. 在 **Settings → Environment Variables** 确认 `KV_URL` 存在
5. 本地开发时，将 `KV_URL` 的值复制到 `.env.local` 的 `REDIS_URL`

## 📁 项目结构

```
personal-ai/
├── app/
│   ├── page.tsx                  # 公开 Q&A 页面
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式 + 组件类
│   ├── admin/
│   │   ├── page.tsx              # 管理端（对话+记忆+导入）
│   │   └── layout.tsx            # 管理端布局
│   └── api/
│       ├── chat/route.ts         # 公开问答 API
│       ├── admin/
│       │   ├── login/route.ts    # 登录 API
│       │   ├── chat/route.ts     # 记忆构建对话 API
│       │   └── upload/route.ts   # 文档上传 API
│       └── memories/route.ts     # 记忆 CRUD API
├── components/
│   ├── PublicChat.tsx            # 公开聊天组件
│   ├── AdminChat.tsx             # 管理端聊天组件
│   ├── MemoryList.tsx            # 记忆列表组件
│   ├── LoginForm.tsx             # 登录表单组件
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
├── lib/
│   ├── config.ts                 # 全局配置
│   ├── llm.ts                    # 通义千问 LLM 配置
│   ├── redis.ts                  # Redis 客户端（ioredis + 内存回退）
│   ├── memory/
│   │   ├── types.ts              # 记忆类型定义
│   │   ├── store.ts              # 记忆 CRUD 存储层
│   │   └── manager.ts            # 记忆管理（提取/检索/去重）
│   ├── chains/
│   │   ├── public-chain.ts       # 公开问答链
│   │   ├── admin-chain.ts        # 管理端对话链
│   │   └── memory-extraction.ts  # 记忆提取链
│   └── document/
│       └── parser.ts             # Word 文档解析
├── middleware.ts                  # 管理端认证中间件
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local.example
```

## 🛠 技术栈


| 类别     | 技术                    |
| -------- | ----------------------- |
| 框架     | Next.js 14 (App Router) |
| 语言     | TypeScript              |
| AI 框架  | LangChain.js            |
| 大模型   | 通义千问 (qwen-plus)    |
| 样式     | Tailwind CSS            |
| 记忆存储 | Redis / 本地内存模式    |
| 文档解析 | Mammoth (.docx)         |
| 部署     | Vercel                  |

## 🔑 申请第三方服务

### 通义千问 API

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 开通模型服务，获取 API Key
3. 推荐使用 `qwen-plus`（性价比最优）

### Redis（可选）

**默认使用本地内存模式**（无需任何配置，开发直接用，但重启后记忆会清空）。

如需持久化存储（推荐生产环境），可选择国内 Redis 服务：

1. **阿里云 Redis**（推荐，国内直连）
   - 访问 [阿里云 Redis](https://www.aliyun.com/product/kvstore)
   - 创建实例，开启公网访问
   - 获取连接地址和密码，填入 `REDIS_URL`

2. **腾讯云 Redis**
   - 访问 [腾讯云 Redis](https://cloud.tencent.com/product/crs)
   - 同上配置

3. 在 `.env.local` 中配置：
   ```env
   REDIS_URL=redis://:your-password@host:6379
   REDIS_MODE=redis
   ```

## 📝 记忆构建最佳实践

1. **先上传简历文档**：将你的 Word 简历上传，快速建立基础记忆库
2. **再进行对话补充**：通过管理端对话补充文档中没有的信息（性格、目标等）
3. **定期更新**：有新的经历时随时通过对话更新记忆
4. **分类管理**：在记忆管理页面可以删除过时或不准确的记忆

---

Made with ❤️ by AI
