import React from 'react';

interface WeekSchedule {
  week: number;
  topics: string[];
  hours: Record<string, number>;
  goals: string;
  checkpointQuestions: string[];
}

interface StudyPlan {
  summary: {
    totalWeeks: number;
    totalHours: number;
    topicsCovered: number;
  };
  schedule: WeekSchedule[];
  tips: string[];
}

interface StudyPlanViewProps {
  plan: StudyPlan;
}

export default function StudyPlanView({ plan }: StudyPlanViewProps) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-3xl p-10 border-2 border-green-300/50 dark:border-green-700/50 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Study Plan Summary
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient-green mb-2">
              {plan.summary.totalWeeks}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Weeks</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient-blue mb-2">
              {plan.summary.totalHours}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient-purple mb-2">
              {plan.summary.topicsCovered}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Topics</div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weekly Breakdown</h3>
        <div className="space-y-5">
          {plan.schedule.map((week, index) => (
            <div
              key={week.week}
              className="rounded-2xl p-6 border-l-4 border-green-500 dark:border-green-400 bg-gradient-to-br from-white via-green-50/40 to-emerald-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 hover-lift"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  Week {week.week}
                </h4>
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold">
                  {Object.values(week.hours).reduce((a, b) => a + b, 0)} hours
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Topics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {week.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                    >
                      {topic}
                      {week.hours[topic] && (
                        <span className="ml-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                          ({week.hours[topic]}h)
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Goals:
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{week.goals}</p>
              </div>

              {week.checkpointQuestions.length > 0 && (
                <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-700/50">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-3">
                    Checkpoint Questions:
                  </p>
                  <ul className="space-y-2">
                    {week.checkpointQuestions.map((question, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold mr-3 mt-0.5">
                          ?
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      {plan.tips.length > 0 && (
        <div className="rounded-2xl p-8 border-2 border-amber-300/50 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50/50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="text-3xl mr-3">💡</span>
            Study Tips
          </h3>
          <ul className="space-y-3">
            {plan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold mr-3 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
