import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProblemInput from '@/components/ProblemInput';

interface CritiqueData {
  overallAssessment?: string;
  strengths?: string[];
  issues?: Array<{
    location: string;
    type: string;
    description: string;
    severity: string;
  }>;
  suggestions?: string[];
  score?: string;
  correctness?: string;
}

export default function CritiquePage() {
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState<string | null>(null);
  const [parsedCritique, setParsedCritique] = useState<CritiqueData | null>(null);

  const handleAnalyzeSolution = async (problem: string, solution: string) => {
    setLoading(true);
    setCritique(null);
    setParsedCritique(null);

    try {
      const response = await fetch('/api/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, solution }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze solution');
      }

      setCritique(data.critique);
      setParsedCritique(data.parsed);
    } catch (error) {
      console.error('Error analyzing solution:', error);
      alert(error instanceof Error ? error.message : 'Failed to analyze solution');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCritique(null);
    setParsedCritique(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'moderate':
        return 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'minor':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <Layout title="🔍 Solution Critique">
      <div className="max-w-4xl mx-auto">
        {/* Description */}
        <div className="rounded-2xl p-8 mb-8 border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 via-pink-50/80 to-purple-100/50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-800/30">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Get TA-Style Feedback
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold mr-3 mt-0.5">
                1
              </span>
              <span>Paste the problem statement</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold mr-3 mt-0.5">
                2
              </span>
              <span>Paste your attempted solution or work</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold mr-3 mt-0.5">
                3
              </span>
              <span>Receive detailed feedback on correctness and reasoning</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold mr-3 mt-0.5">
                4
              </span>
              <span>Learn what you did well and how to improve</span>
            </li>
          </ul>
        </div>

        {/* Input or Results */}
        {!critique ? (
          <div className="rounded-3xl p-8 border-2 border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/40 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
            <ProblemInput
              onSolutionSubmit={handleAnalyzeSolution}
              showSolutionInput
              buttonText="Analyze My Solution"
              loading={loading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-6 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
              >
                Analyze Another Solution
              </button>
            </div>

            {/* Structured Critique */}
            {parsedCritique ? (
              <div className="space-y-6">
                {/* Overall Assessment */}
                {parsedCritique.overallAssessment && (
                  <div className="rounded-3xl p-8 border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100/50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Overall Assessment
                      </h3>
                      {parsedCritique.score && (
                        <span className="text-3xl font-bold text-gradient-purple">
                          {parsedCritique.score}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {parsedCritique.overallAssessment}
                    </p>
                    {parsedCritique.correctness && (
                      <div className="mt-4">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                          {parsedCritique.correctness}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengths */}
                {parsedCritique.strengths && parsedCritique.strengths.length > 0 && (
                  <div className="rounded-3xl p-8 border-2 border-green-300/50 dark:border-green-700/50 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50/50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="text-3xl mr-3">✓</span>
                      What You Did Well
                    </h3>
                    <ul className="space-y-3">
                      {parsedCritique.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold mr-3 mt-0.5">
                            ✓
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {parsedCritique.issues && parsedCritique.issues.length > 0 && (
                  <div className="rounded-3xl p-8 border-2 border-red-300/50 dark:border-red-700/50 bg-gradient-to-br from-red-50 via-orange-50/80 to-red-100/50 dark:from-red-900/30 dark:via-orange-900/30 dark:to-red-800/30">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Issues to Address
                    </h3>
                    <div className="space-y-4">
                      {parsedCritique.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`border-2 rounded-2xl p-5 ${getSeverityColor(issue.severity)}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-lg">{issue.location}</h4>
                            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-white/50 dark:bg-black/30">
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-2">
                            <span className="font-bold">Type:</span> {issue.type}
                          </p>
                          <p className="text-sm leading-relaxed">{issue.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {parsedCritique.suggestions && parsedCritique.suggestions.length > 0 && (
                  <div className="rounded-3xl p-8 border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100/50 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-blue-800/30">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="text-3xl mr-3">💡</span>
                      How to Improve
                    </h3>
                    <ul className="space-y-3">
                      {parsedCritique.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold mr-3 mt-0.5">
                            →
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              // Fallback to plain text critique
              <div className="rounded-3xl p-8 border-2 border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/40 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Feedback</h3>
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                    {critique}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
