import React, { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  loading?: boolean;
  placeholder?: string;
  showSolutionButton?: boolean;
  onRequestSolution?: () => void;
}

export default function ChatPanel({
  messages,
  onSendMessage,
  loading = false,
  placeholder = 'Type your response...',
  showSolutionButton = false,
  onRequestSolution,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[650px] glass-strong rounded-3xl overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-xl font-medium">Start your conversation with the coach</p>
            <p className="text-sm text-gray-400 mt-2">Ask questions, share your thinking...</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    : 'glass border border-gray-200 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </div>
                {message.timestamp && (
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="glass border border-gray-200 rounded-2xl px-6 py-4">
              <div className="flex space-x-2">
                <div
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-strong border-t border-gray-200 p-6">
        {showSolutionButton && onRequestSolution && (
          <div className="mb-4">
            <button
              onClick={onRequestSolution}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Show Full Solution
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 px-5 py-3 glass-strong rounded-full focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-400 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-8 rounded-full hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
