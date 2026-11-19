'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Loader2 } from 'lucide-react';
import { usePortfolioStore } from '@/lib/store';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = usePortfolioStore((s) => s.isLoading);
  const setIsLoading = usePortfolioStore((s) => s.setIsLoading);
  const addMessage = usePortfolioStore((s) => s.addMessage);

  // Fallback / error handler for chat
  const handleChatError = useCallback(
    (error: Error | string, assistantId?: string) => {
      console.error('Gemini API Error (Frontend):', error);

      const targetId = assistantId || (Date.now() + 1).toString();
      const state = usePortfolioStore.getState();
      const existingMsg = state.messages.find((m) => m.id === targetId);

      const errorMessage =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
      const displayMessage = `⚠️ AI chat request failed: ${errorMessage}`;

      if (existingMsg) {
        usePortfolioStore.setState((prev) => ({
          messages: prev.messages.map((m) =>
            m.id === targetId
              ? {
                  ...m,
                  content: displayMessage,
                }
              : m
          ),
        }));
      } else {
        addMessage({
          id: targetId,
          role: 'assistant',
          content: displayMessage,
        });
      }

      setIsLoading(false);
    },
    [addMessage, setIsLoading]
  );

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setInput('');

    const userMessageId = Date.now().toString();
    const assistantMessageId = (Date.now() + 1).toString();

    addMessage({
      id: userMessageId,
      role: 'user',
      content: trimmedInput,
    });

    addMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    });

    setIsLoading(true);

    try {
      const currentMessages = usePortfolioStore.getState().messages;
      const payloadMessages = currentMessages
        .filter((m) => m.content.trim() !== '')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      console.log(`[Frontend] Sending ${payloadMessages.length} message(s) to /api/chat...`);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Server returned status ${response.status} (${response.statusText})`;
        try {
          const errData: unknown = await response.json();
          if (
            typeof errData === 'object' &&
            errData !== null &&
            'error' in errData &&
            typeof errData.error === 'string' &&
            errData.error.trim()
          ) {
            errorMessage = errData.error;
          }
        } catch {
          // Keep the HTTP status message when the response is not valid JSON.
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body stream is not available');
      }

      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        usePortfolioStore.setState((prev) => ({
          messages: prev.messages.map((m) =>
            m.id === assistantMessageId ? { ...m, content: accumulatedText } : m
          ),
        }));
      }

      if (!accumulatedText.trim()) {
        console.warn('Gemini stream completed with 0 text chunks.');
        usePortfolioStore.setState((prev) => ({
          messages: prev.messages.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content:
                    '⚠️ The AI returned an empty response. Check the API key, selected Gemini model, and server logs.',
                }
              : m
          ),
        }));
      }
    } catch (err: unknown) {
      handleChatError(err instanceof Error ? err : String(err), assistantMessageId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="w-full rounded-2xl bg-slate-50 border-2 border-slate-200/90 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:bg-zinc-800/90 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 px-5 py-3.5 pr-12 text-sm font-medium transition-all shadow-inner disabled:opacity-50"
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </form>
  );
}
