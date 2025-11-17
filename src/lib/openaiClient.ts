import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamCallback {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Call OpenAI API with a system prompt and conversation history
 */
export async function callOpenAI(
  systemPrompt: string,
  messages: Message[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: options?.model || 'gpt-4o',
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature ?? 1,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    });

    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error('No content in response');
    }

    return messageContent;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Stream responses from OpenAI API
 */
export async function streamOpenAI(
  systemPrompt: string,
  messages: Message[],
  callback: StreamCallback,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<void> {
  try {
    const stream = await openai.chat.completions.create({
      model: options?.model || 'gpt-4o',
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature ?? 1,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        callback.onToken?.(delta);
      }
    }

    callback.onComplete?.(fullResponse);
  } catch (error) {
    console.error('Error streaming from OpenAI API:', error);
    callback.onError?.(error as Error);
    throw error;
  }
}

export default openai;
