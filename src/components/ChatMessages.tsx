'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/lib/store';
import { portfolioData } from '@/lib/data';
import { User } from 'lucide-react';

export default function ChatMessages() {
  const messages = usePortfolioStore((s) => s.messages);
  const isLoading = usePortfolioStore((s) => s.isLoading);

  if (messages.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="border-t border-slate-200 dark:border-zinc-800 pt-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          💬 AI Chat
        </h3>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 mb-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-xs bg-slate-100 dark:bg-zinc-800">
                  <img
                    src={portfolioData.about.profileImage || portfolioData.avatar || '/profile.jpg'}
                    alt="AI Assistant"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                    : message.content.startsWith('⚠️') || message.content.startsWith("I'm having trouble")
                    ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60'
                    : 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 border border-slate-200/60 dark:border-zinc-700/50'
                }`}
              >
                {message.content ? (
                  message.content
                ) : isLoading ? (
                  <span className="text-slate-500 dark:text-zinc-400 italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Thinking...
                  </span>
                ) : (
                  <span className="text-red-500 italic">No response received.</span>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-200 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
