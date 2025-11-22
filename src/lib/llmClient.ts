import { callClaude, streamClaude } from './anthropicClient';
import { callOpenAI, streamOpenAI } from './openaiClient';

export interface ContentBlock {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
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
  anthropic: 'claude-3-5-sonnet-20240620',
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
    // Cast to any to avoid strict type checking issues between similar interfaces
    return callOpenAI(systemPrompt, messages as any, llmOptions);
  } else {
    // Cast to any to avoid strict type checking issues between similar interfaces
    return callClaude(systemPrompt, messages as any, llmOptions);
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
    // Cast to any to avoid strict type checking issues between similar interfaces
    return streamOpenAI(systemPrompt, messages as any, callback, llmOptions);
  } else {
    // Cast to any to avoid strict type checking issues between similar interfaces
    return streamClaude(systemPrompt, messages as any, callback, llmOptions);
  }
}

// Re-export types for convenience
export type { Message as LLMMessage, StreamCallback as LLMStreamCallback };
