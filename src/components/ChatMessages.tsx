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
      <div className="border-t border-slate-200/60 dark:border-zinc-800/80 pt-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          AI Chat
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-sm bg-slate-100 dark:bg-zinc-800">
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
                    ? 'bg-indigo-600 text-white dark:bg-indigo-700 shadow-sm shadow-indigo-200/40 dark:shadow-indigo-900/40'
                    : message.content.startsWith('⚠️') || message.content.startsWith("I'm having trouble")
                    ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60'
                    : 'bg-white text-slate-800 dark:bg-zinc-900 dark:text-zinc-200 border border-slate-200/60 dark:border-zinc-800/80 shadow-sm'
                }`}
              >
                {message.content ? (
                  message.content
                ) : isLoading ? (
                  <span className="text-slate-400 dark:text-zinc-500 italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Thinking...
                  </span>
                ) : (
                  <span className="text-red-500 italic">No response received.</span>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300 flex items-center justify-center">
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
