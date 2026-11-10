import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { systemPrompt } from '@/lib/data';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // Validate API Key upfront
    if (!apiKey || apiKey === 'your_api_key_here') {
      const errorMsg =
        'Google Generative AI API key is missing or not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file.';
      console.error('Gemini API Error:', errorMsg);
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    const body = await req.json();
    const { messages } = body;

    // Validate messages payload
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const errorMsg = 'Invalid request: messages array is required and must not be empty.';
      console.error('Gemini API Error:', errorMsg);
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    console.log(
      `[API /api/chat] Generating response for prompt with ${messages.length} message(s) using ${modelName}...`
    );

    // Call Gemini via Vercel AI SDK
    const result = streamText({
      model: google(modelName),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: (m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user') as
          | 'user'
          | 'assistant'
          | 'system',
        content: m.content,
      })),
      onError({ error }) {
        console.error('Gemini API Error (during streamText generation):', error);
      },
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error('Gemini API Error in route catch block:', error);
    return NextResponse.json(
      {
        error:
          (error instanceof Error && error.message) ||
          'An unexpected error occurred while communicating with the Gemini API.',
      },
      { status: 500 }
    );
  }
}
