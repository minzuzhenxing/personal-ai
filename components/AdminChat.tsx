'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AdminChatProps {
  onNewMemories: (facts: string[]) => void;
}

export function AdminChat({ onNewMemories }: AdminChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载历史对话
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/admin/chat');
        const data = await res.json();
        if (data.success && data.history.length > 0) {
          setMessages(data.history);
        }
      } catch {
        // 忽略加载失败
      }
      setInitialLoaded(true);
    };
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message },
        ]);

        if (data.newMemories && data.newMemories.length > 0) {
          onNewMemories(data.newMemories);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ 发送失败，请重试。' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!initialLoaded) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 对话引导提示 */}
      {messages.length === 0 && (
        <div className="px-4 py-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.405 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            AI 记忆构建器
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            通过自然对话让 AI 了解你。你可以从以下话题开始：
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {[
              '我叫什么名字',
              '我毕业于哪所学校',
              '我的技术栈',
              '我的工作经历',
              '我的兴趣爱好',
              '我的职业目标',
            ].map((hint) => (
              <button
                key={hint}
                onClick={() => setInput(`我想告诉你关于：${hint}`)}
                className="px-3 py-1.5 text-xs bg-gray-800/50 border border-gray-700/40 rounded-lg
                         text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                AI
              </div>
            )}
            <div
              className={
                msg.role === 'user' ? 'message-user' : 'message-ai'
              }
            >
              {msg.role === 'assistant' ? (
                <div className="markdown-content text-xs">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold mr-2">
              AI
            </div>
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-800/60">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="和 AI 聊聊你自己..."
            className="input-field flex-1 text-sm"
            disabled={loading}
          />
          <Button onClick={sendMessage} loading={loading} disabled={!input.trim()}>
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
