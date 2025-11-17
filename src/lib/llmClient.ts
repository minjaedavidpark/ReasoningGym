import { callClaude, streamClaude } from './anthropicClient';
import { callOpenAI, streamOpenAI } from './openaiClient';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamCallback {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

export type LLMProvider = 'anthropic' | 'openai';

// Get the provider from environment variable, default to anthropic
export const getProvider = (): LLMProvider => {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  if (provider === 'openai') return 'openai';
  return 'anthropic';
};

// Model mapping for each provider
const DEFAULT_MODELS = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
};

/**
 * Unified interface to call LLM API with a system prompt and conversation history
 * Automatically uses the provider specified in LLM_PROVIDER env variable
 */
export async function callLLM(
  systemPrompt: string,
  messages: Message[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    provider?: LLMProvider;
  }
): Promise<string> {
  const provider = options?.provider || getProvider();
  const model = options?.model || DEFAULT_MODELS[provider];

  const llmOptions = {
    model,
    maxTokens: options?.maxTokens,
    temperature: options?.temperature,
  };

  if (provider === 'openai') {
    return callOpenAI(systemPrompt, messages, llmOptions);
  } else {
    return callClaude(systemPrompt, messages, llmOptions);
  }
}

/**
 * Unified interface to stream responses from LLM API
 * Automatically uses the provider specified in LLM_PROVIDER env variable
 */
export async function streamLLM(
  systemPrompt: string,
  messages: Message[],
  callback: StreamCallback,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    provider?: LLMProvider;
  }
): Promise<void> {
  const provider = options?.provider || getProvider();
  const model = options?.model || DEFAULT_MODELS[provider];

  const llmOptions = {
    model,
    maxTokens: options?.maxTokens,
    temperature: options?.temperature,
  };

  if (provider === 'openai') {
    return streamOpenAI(systemPrompt, messages, callback, llmOptions);
  } else {
    return streamClaude(systemPrompt, messages, callback, llmOptions);
  }
}

// Re-export types for convenience
export type { Message as LLMMessage, StreamCallback as LLMStreamCallback };
