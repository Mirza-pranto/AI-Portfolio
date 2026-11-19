'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/lib/store';

export default function ChatMessages() {
  const messages = usePortfolioStore((s) => s.messages);
  const isLoading = usePortfolioStore((s) => s.isLoading);

  if (messages.length === 0) return null;

  return (
    <div id="ai-chat-history" className="mt-8 space-y-4">
      <div className="border-t-2 border-slate-200/80 dark:border-zinc-800/80 pt-6">
        <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          AI Conversation
        </h3>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex mb-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`text-sm sm:text-[15px] leading-relaxed ${
                  message.role === 'user'
                    ? 'max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-xs px-4 sm:px-5 py-2.5 sm:py-3 bg-indigo-600 text-white dark:bg-indigo-600 shadow-md shadow-indigo-600/25 font-medium'
                    : message.content.startsWith('⚠️') || message.content.startsWith("I'm having trouble")
                    ? 'max-w-[95%] sm:max-w-[85%] rounded-2xl px-4 sm:px-5 py-3 bg-red-50 text-red-900 border-2 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60 font-medium'
                    : 'max-w-[95%] sm:max-w-[85%] rounded-2xl rounded-bl-xs px-4 sm:px-5 py-3 sm:py-3.5 bg-white text-slate-800 dark:bg-zinc-900 dark:text-zinc-100 border-2 border-slate-300 dark:border-zinc-800 shadow-sm font-medium'
                }`}
              >
                {message.content ? (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                ) : isLoading ? (
                  <span className="text-slate-500 dark:text-zinc-400 italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    Thinking...
                  </span>
                ) : (
                  <span className="text-red-500 italic">No response received.</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
