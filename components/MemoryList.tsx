'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import type { Memory, MemoryCategory } from '@/lib/memory/types';

const CATEGORY_LABELS: Record<string, string> = {
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

const CATEGORY_COLORS: Record<string, string> = {
  personal_info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  education: 'bg-green-500/20 text-green-400 border-green-500/30',
  work_experience: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  skills: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  projects: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  interests: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  personality: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  values: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  goals: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  contact: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const SOURCE_LABELS: Record<string, string> = {
  document: '📄 文档',
  conversation: '💬 对话',
  manual: '✏️ 手动',
};

interface MemoryListProps {
  refreshTrigger: number;
}

export function MemoryList({ refreshTrigger }: MemoryListProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadMemories = useCallback(async () => {
    try {
      const res = await fetch('/api/memories');
      const data = await res.json();
      if (data.success) {
        setMemories(data.memories);
      }
    } catch {
      console.error('加载记忆失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories, refreshTrigger]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/memories?id=${id}`, { method: 'DELETE' });
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch {
      console.error('删除记忆失败');
    } finally {
      setDeleting(null);
    }
  };

  // 筛选
  const filteredMemories =
    filter === 'all'
      ? memories
      : memories.filter((m) => m.category === filter);

  // 分类统计
  const categoryCounts: Record<string, number> = {};
  for (const m of memories) {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 统计概览 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          共 {memories.length} 条记忆
        </span>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
            filter === 'all'
              ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
              : 'bg-gray-800/50 text-gray-400 border-gray-700/30 hover:border-gray-600/40'
          }`}
        >
          全部 ({memories.length})
        </button>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
              filter === cat
                ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                : 'bg-gray-800/50 text-gray-400 border-gray-700/30 hover:border-gray-600/40'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat} ({count})
          </button>
        ))}
      </div>

      {/* 记忆列表 */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            {filter === 'all'
              ? '还没有任何记忆，开始对话或上传文档来构建记忆吧'
              : '该分类下暂无记忆'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredMemories.map((memory) => (
            <Card
              key={memory.id}
              padding="sm"
              className="group hover:border-gray-700/60 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {memory.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded border ${
                        CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.other
                      }`}
                    >
                      {CATEGORY_LABELS[memory.category] || memory.category}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {SOURCE_LABELS[memory.source] || memory.source}
                    </span>
                    {memory.tags.length > 0 && (
                      <span className="text-[10px] text-gray-600">
                        {memory.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(memory.id)}
                  disabled={deleting === memory.id}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400
                           transition-all flex-shrink-0"
                  title="删除"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
