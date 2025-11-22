import React, { useState } from 'react';

interface ProblemInputProps {
  onSubmit?: (problem: string, image?: string) => void;
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
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim() || image) {
      if (showSolutionInput && onSolutionSubmit) {
        onSolutionSubmit(problem.trim(), solution.trim());
      } else if (onSubmit) {
        onSubmit(problem.trim(), image || undefined);
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

        {/* Image Upload */}
        <div className="mt-4">
          {!imagePreview ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-blue-50/50 dark:bg-gray-700/50 hover:bg-blue-100/50 dark:hover:bg-gray-600/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-blue-500 dark:text-blue-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload image</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or GIF (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>
            </div>
          ) : (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-700">
              <img
                src={imagePreview}
                alt="Problem preview"
                className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
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
        disabled={loading || (!problem.trim() && !image)}
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
