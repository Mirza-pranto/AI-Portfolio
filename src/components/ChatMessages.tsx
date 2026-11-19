'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { usePortfolioStore } from '@/lib/store';

export default function ChatMessages() {
  const messages = usePortfolioStore((s) => s.messages);
  const isLoading = usePortfolioStore((s) => s.isLoading);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, 'like' | 'dislike' | null>>({});

  const handleCopy = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 2000);
  };

  const handleReaction = (id: string, type: 'like' | 'dislike') => {
    setReactions((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  if (messages.length === 0) return null;

  return (
    <div id="ai-chat-history" className="mt-10 space-y-6 w-full">
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
              <div className="w-full max-w-3xl text-slate-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">
                {message.content ? (
                  <>
                    <div className="whitespace-pre-line space-y-3">
                      {message.content}
                    </div>

                    {/* Action Bar below at left corner (Copy, Like, Dislike) just like ChatGPT */}
                    <div className="flex items-center gap-1 mt-3 pt-1 text-slate-400 dark:text-zinc-500">
                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        aria-label="Copy response"
                        title={copiedId === message.id ? 'Copied!' : 'Copy response'}
                        className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              Copied
                            </span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Like Button */}
                      <button
                        onClick={() => handleReaction(message.id, 'like')}
                        aria-label="Like response"
                        title="Good response"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          reactions[message.id] === 'like'
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                            : 'hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200'
                        }`}
                      >
                        <ThumbsUp
                          className={`w-3.5 h-3.5 ${
                            reactions[message.id] === 'like' ? 'fill-current' : ''
                          }`}
                        />
                      </button>

                      {/* Dislike Button */}
                      <button
                        onClick={() => handleReaction(message.id, 'dislike')}
                        aria-label="Dislike response"
                        title="Bad response"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          reactions[message.id] === 'dislike'
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50'
                            : 'hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200'
                        }`}
                      >
                        <ThumbsDown
                          className={`w-3.5 h-3.5 ${
                            reactions[message.id] === 'dislike' ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </>
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
