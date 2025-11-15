import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header with glass morphism */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                🧠
              </span>
              <span className="text-2xl font-semibold tracking-tight text-gradient-blue">
                Reasoning Gym
              </span>
            </Link>

            <nav className="flex items-center space-x-2">
              <Link
                href="/coach"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50/50 transition-all duration-200"
              >
                Coach
              </Link>
              <Link
                href="/critique"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-full hover:bg-purple-50/50 transition-all duration-200"
              >
                Critique
              </Link>
              <Link
                href="/planner"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 rounded-full hover:bg-green-50/50 transition-all duration-200"
              >
                Planner
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {title && (
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-12 animate-fade-in">
            {title}
          </h1>
        )}
        <div className="animate-slide-up">{children}</div>
      </main>

      {/* Footer */}
      <footer className="mt-24 glass-strong">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Built for the Anthropic AI Hackathon @ UofT
            </p>
            <p className="mt-3 text-xs text-gray-500 max-w-md mx-auto">
              Use for learning and practice. Do not submit AI-generated work as your own.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
