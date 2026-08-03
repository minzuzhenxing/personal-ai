'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicChat } from '../PublicChat';

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 浮动气泡按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="AI 对话"
      >
        {/* 脉冲环 */}
        <span className="absolute inset-0 rounded-full bg-primary-500/30 animate-pulse-ring" />

        {/* 按钮主体 */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95">
          <AnimatePresence mode="wait">
            {open ? (
              <motion.svg
                key="close"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                className="w-6 h-6 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                className="w-6 h-6 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>

        {/* 提示标签 */}
        {!open && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900/90 border border-gray-700/60 text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            和 AI 聊聊 👋
          </motion.span>
        )}
      </button>

      {/* 对话面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/60"
            style={{ background: 'rgba(15, 23, 42, 0.97)' }}
          >
            {/* 面板头部 */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800/60 bg-gray-900/80">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI 数字分身</h3>
                <p className="text-[10px] text-gray-400">基于记忆的智能问答</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto p-1.5 rounded-lg hover:bg-gray-800/60 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PublicChat 内容区 */}
            <div className="flex-1 flex flex-col h-[calc(100%-56px)] overflow-hidden">
              <PublicChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
