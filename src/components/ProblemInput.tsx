import React, { useState } from 'react';

interface ProblemInputProps {
  onSubmit?: (problem: string) => void;
  placeholder?: string;
  buttonText?: string;
  loading?: boolean;
  showSolutionInput?: boolean;
  onSolutionSubmit?: (problem: string, solution: string) => void;
}

export default function ProblemInput({
  onSubmit,
  placeholder = 'Paste your problem here...',
  buttonText = 'Start',
  loading = false,
  showSolutionInput = false,
  onSolutionSubmit,
}: ProblemInputProps) {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      if (showSolutionInput && onSolutionSubmit) {
        onSolutionSubmit(problem.trim(), solution.trim());
      } else if (onSubmit) {
        onSubmit(problem.trim());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="problem"
          className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3"
        >
          Problem Statement
        </label>
        <textarea
          id="problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder={placeholder}
          className="w-full h-48 px-5 py-4 rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-br from-white to-blue-50/40 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 dark:focus:border-blue-600 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
          disabled={loading}
        />
      </div>

      {showSolutionInput && (
        <div>
          <label
            htmlFor="solution"
            className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3"
          >
            Your Solution/Attempt
          </label>
          <textarea
            id="solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Paste your solution or attempted work here..."
            className="w-full h-48 px-5 py-4 rounded-2xl border-2 border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-br from-white to-purple-50/40 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 dark:focus:border-purple-600 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            disabled={loading}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !problem.trim()}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}
