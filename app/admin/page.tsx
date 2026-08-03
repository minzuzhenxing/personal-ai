/**
 * 管理端页面 - 记忆构建中心
 *
 * 功能标签：
 * 1. 对话构建 - 通过自然对话让 AI 了解你
 * 2. 记忆管理 - 查看、筛选、删除已存储的记忆
 * 3. 文档导入 - 上传 Word 文档批量导入信息
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { AdminChat } from '@/components/AdminChat';
import { MemoryList } from '@/components/MemoryList';
import { Button } from '@/components/ui/Button';

type Tab = 'chat' | 'memories' | 'upload';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);

  // 组件挂载时检查 cookie（同步，不阻塞渲染）
  useEffect(() => {
    const hasAuth = document.cookie.includes('admin_auth=true');
    if (hasAuth) {
      setAuthenticated(true);
    }
  }, []);

  const handleNewMemories = useCallback((facts: string[]) => {
    // 触发记忆列表刷新
    setRefreshTrigger((prev) => prev + 1);

    // 如果有新记忆，显示通知
    if (facts.length > 0) {
      setUploadStatus({
        type: 'success',
        message: `已自动提取 ${facts.length} 条新记忆`,
      });
      setTimeout(() => setUploadStatus(null), 5000);
    }
  }, []);

  // 文件上传处理
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUploadStatus({
          type: 'success',
          message: data.message,
        });
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setUploadStatus({
          type: 'error',
          message: data.error || '上传失败',
        });
      }
    } catch {
      setUploadStatus({
        type: 'error',
        message: '上传失败，请检查网络连接',
      });
    } finally {
      setUploading(false);
      // 清除文件选择
      e.target.value = '';
    }
  };

  // 未登录 - 显示登录表单
  if (!authenticated) {
    return (
      <LoginForm onLoginSuccess={() => setAuthenticated(true)} />
    );
  }

  // 已登录 - 管理界面
  return (
    <div className="min-h-screen flex">
      {/* 侧边栏 */}
      <aside className="w-56 flex-shrink-0 border-r border-gray-800/60 bg-gray-950/80 backdrop-blur-xl hidden md:flex flex-col">
        <div className="px-5 py-5 border-b border-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">管理端</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {([
            { key: 'chat', label: '对话构建', icon: '💬', desc: '通过对话建立记忆' },
            { key: 'memories', label: '记忆管理', icon: '🧠', desc: '查看和管理记忆' },
            { key: 'upload', label: '文档导入', icon: '📄', desc: '上传 Word 批量导入' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-primary-600/20 border border-primary-500/30 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{tab.icon}</span>
                <div>
                  <div className="text-sm font-medium">{tab.label}</div>
                  <div className="text-[10px] text-gray-500">{tab.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-800/60">
          <a
            href="/"
            target="_blank"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            查看公开页面
          </a>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 移动端顶部标签 */}
        <div className="flex md:hidden border-b border-gray-800/60 bg-gray-950/80">
          {([
            { key: 'chat', label: '对话' },
            { key: 'memories', label: '记忆' },
            { key: 'upload', label: '导入' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'text-white border-b-2 border-primary-500'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 状态提示 */}
        {uploadStatus && (
          <div
            className={`mx-4 mt-3 px-4 py-2.5 rounded-xl text-sm animate-slide-up ${
              uploadStatus.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {uploadStatus.message}
          </div>
        )}

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminChat onNewMemories={handleNewMemories} />
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <MemoryList refreshTrigger={refreshTrigger} />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-lg mx-auto space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    文档导入
                  </h2>
                  <p className="text-sm text-gray-400">
                    上传 Word 文档（.docx），AI 会自动提取其中的个人信息作为长期记忆。
                  </p>
                </div>

                {/* 上传区域 */}
                <label className="block">
                  <div className="glass-card p-8 text-center cursor-pointer hover:border-primary-500/30 transition-all duration-200 border-dashed">
                    <div className="w-14 h-14 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">
                      {uploading ? '正在解析文档...' : '点击或拖拽上传 Word 文档'}
                    </p>
                    <p className="text-xs text-gray-500">
                      支持 .docx 和 .doc 格式
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".docx,.doc"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {/* 提示 */}
                <div className="glass-card p-5 space-y-3">
                  <h3 className="text-sm font-medium text-white">💡 使用提示</h3>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex gap-2">
                      <span className="text-primary-400">•</span>
                      文档中越详细地描述你的经历，AI 回答越准确
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary-400">•</span>
                      建议包含：教育经历、工作经历、技能、项目经验、个人简介
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary-400">•</span>
                      上传后会自动去重，不会重复存储相同的信息
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary-400">•</span>
                      也可以使用"对话构建"功能，边聊边完善记忆
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
