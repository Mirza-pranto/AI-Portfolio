'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/lib/store';

export default function ChatMessages() {
  const messages = usePortfolioStore((s) => s.messages);
  const isLoading = usePortfolioStore((s) => s.isLoading);

  if (messages.length === 0) return null;

  return (
    <div id="ai-chat-history" className="mt-10 space-y-6 w-full max-w-3xl">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-6 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'user' ? (
              /* User Message Bubble: Solid, high-contrast, ChatGPT-style rounded bubble */
              <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3 bg-slate-200 text-slate-900 border border-slate-300/80 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 shadow-xs text-base sm:text-[17px] leading-relaxed font-normal">
                {message.content}
              </div>
            ) : (
              /* AI Response: Pure seamless text directly on the canvas — NO box, NO border, exact site typography */
              <div className="w-full text-slate-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">
                {message.content ? (
                  <div className="whitespace-pre-line space-y-3">
                    {message.content}
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-base italic py-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <span className="text-red-500 italic">No response received.</span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
