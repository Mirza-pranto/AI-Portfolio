import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 15;

const COMPANION_SYSTEM = `You are the sarcastic, witty AI companion residing inside an AI Engineer's portfolio website. The engineer is Mirza Julkawsar — a BRAC University CS graduate who builds LLM/RAG/NLP systems.

When a visitor clicks on one of Mirza's projects, you receive the project name, subtitle, and tech stack. Your job:
- In 1–2 short, punchy sentences, make a clever observation or joke about this project or its tech stack.
- Be slightly edgy, technically aware, and never generic. You understand transformers, RAG pipelines, LoRA, vector databases, and full-stack development deeply.
- DO NOT use hashtags. DO NOT be cringe. Think witty senior engineer at a bar, not a LinkedIn influencer.
- You may use ONE emoji at the end if it fits naturally.
- Keep it under 35 words.`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'Gemini API key not configured.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { projectName, subtitle, tags } = body;

    if (!projectName) {
      return NextResponse.json(
        { error: 'projectName is required.' },
        { status: 400 }
      );
    }

    const userPrompt = `The visitor just clicked on this project:
Name: ${projectName}
Subtitle: ${subtitle || 'N/A'}
Tech Stack: ${(tags || []).join(', ') || 'N/A'}

Give your witty companion reaction.`;

    const result = await generateText({
      model: google('gemini-2.0-flash'),
      system: COMPANION_SYSTEM,
      prompt: userPrompt,
      maxOutputTokens: 80,
      temperature: 0.9,
    });

    return NextResponse.json({ message: result.text.trim() });
  } catch (error: unknown) {
    console.error('[API /api/companion] Error:', error);

    // Return a fallback witty message instead of an error
    return NextResponse.json({
      message: "My neural pathways hiccuped. But this project still looks impressive. 🧠",
    });
  }
}
