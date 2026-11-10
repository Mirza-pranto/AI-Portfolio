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
          className="w-full rounded-2xl bg-white border border-gray-200/80 shadow-inner text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:bg-zinc-800 dark:border-transparent dark:shadow-none dark:text-white dark:placeholder:text-zinc-500 dark:focus:ring-zinc-600 px-5 py-3.5 pr-12 text-sm transition-all disabled:opacity-50"
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500 text-white hover:bg-blue-600 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </form>
  );
}
