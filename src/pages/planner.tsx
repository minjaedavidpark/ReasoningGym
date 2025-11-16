import React, { useState } from 'react';
import Layout from '@/components/Layout';
import StudyPlanView from '@/components/StudyPlanView';

interface StudyPlan {
  summary: {
    totalWeeks: number;
    totalHours: number;
    topicsCovered: number;
  };
  schedule: Array<{
    week: number;
    topics: string[];
    hours: Record<string, number>;
    goals: string;
    checkpointQuestions: string[];
  }>;
  tips: string[];
}

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [plainTextPlan, setPlainTextPlan] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    courseName: '',
    topics: '',
    examDate: '',
    weeklyHours: 10,
    currentLevel: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'weeklyHours' ? parseInt(value) || 0 : value,
    }));
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStudyPlan(null);
    setPlainTextPlan(null);

    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study plan');
      }

      if (data.parsed) {
        setStudyPlan(data.parsed);
      } else {
        setPlainTextPlan(data.plan);
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudyPlan(null);
    setPlainTextPlan(null);
  };

  // Get minimum date (today) for exam date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout title="📅 Study Planner">
      <div className="max-w-4xl mx-auto">
        {/* Description */}
        <div className="rounded-2xl p-8 mb-8 border-2 border-green-300/50 dark:border-green-700/50 bg-gradient-to-br from-green-50 via-emerald-50/80 to-green-100/50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-green-800/30">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Custom Study Plan
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold mr-3 mt-0.5">
                1
              </span>
              <span>Enter your course name and topics/syllabus</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold mr-3 mt-0.5">
                2
              </span>
              <span>Set your exam date and weekly study hours</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold mr-3 mt-0.5">
                3
              </span>
              <span>Get a day-by-day schedule with spaced repetition</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold mr-3 mt-0.5">
                4
              </span>
              <span>Use checkpoint questions to test yourself</span>
            </li>
          </ul>
        </div>

        {/* Input Form or Results */}
        {!studyPlan && !plainTextPlan ? (
          <div className="rounded-3xl p-8 border-2 border-green-200/50 dark:border-green-700/50 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
            <form onSubmit={handleGeneratePlan} className="space-y-6">
              {/* Course Name */}
              <div>
                <label
                  htmlFor="courseName"
                  className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3"
                >
                  Course Name
                </label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  placeholder="e.g., CSC458 - Computer Networks"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-green-200/50 dark:border-green-700/50 bg-gradient-to-r from-white to-green-50/40 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 dark:focus:border-green-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Topics */}
              <div>
                <label
                  htmlFor="topics"
                  className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3"
                >
                  Topics / Syllabus
                </label>
                <textarea
                  id="topics"
                  name="topics"
                  value={formData.topics}
                  onChange={handleInputChange}
                  placeholder="List the topics or paste your syllabus here..."
                  className="w-full h-40 px-5 py-4 rounded-2xl border-2 border-green-200/50 dark:border-green-700/50 bg-gradient-to-br from-white to-green-50/40 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 dark:focus:border-green-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Exam Date and Weekly Hours */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="examDate"
                    className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Exam Date
                  </label>
                  <input
                    type="date"
                    id="examDate"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-green-200/50 dark:border-green-700/50 bg-gradient-to-r from-white to-green-50/40 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 dark:focus:border-green-600 text-gray-900 dark:text-gray-100 transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="weeklyHours"
                    className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Weekly Study Hours
                  </label>
                  <input
                    type="number"
                    id="weeklyHours"
                    name="weeklyHours"
                    value={formData.weeklyHours}
                    onChange={handleInputChange}
                    min="1"
                    max="40"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-green-200/50 dark:border-green-700/50 bg-gradient-to-r from-white to-green-50/40 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 dark:focus:border-green-600 text-gray-900 dark:text-gray-100 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Current Level (Optional) */}
              <div>
                <label
                  htmlFor="currentLevel"
                  className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3"
                >
                  Current Understanding Level (Optional)
                </label>
                <select
                  id="currentLevel"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-green-200/50 dark:border-green-700/50 bg-gradient-to-r from-white to-green-50/40 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 dark:focus:border-green-600 text-gray-900 dark:text-gray-100 transition-all"
                  disabled={loading}
                >
                  <option value="">Select (optional)</option>
                  <option value="beginner">Beginner - Just starting to learn</option>
                  <option value="intermediate">Intermediate - Some familiarity</option>
                  <option value="advanced">Advanced - Good understanding, need review</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
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
                    Generating Your Plan...
                  </span>
                ) : (
                  'Generate Study Plan'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Reset Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleReset}
                className="px-6 py-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-all"
              >
                Create Another Plan
              </button>
            </div>

            {/* Display Study Plan */}
            {studyPlan ? (
              <StudyPlanView plan={studyPlan} />
            ) : (
              <div className="rounded-3xl p-8 border-2 border-green-200/50 dark:border-green-700/50 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Your Study Plan
                </h3>
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                    {plainTextPlan}
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
