import React, { useState } from "react";
import { motion } from "framer-motion";

import { generateQuiz, submitQuiz, getQuizAttempts } from "../services/api";

function Quiz({ noteId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  const [attempts, setAttempts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Generate Quiz
  const handleGenerate = async () => {
    if (!noteId || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await generateQuiz(noteId);
      const quizData = response.data;

      if (
        !Array.isArray(quizData?.questions) ||
        quizData.questions.length === 0
      ) {
        throw new Error("Invalid quiz response");
      }

      setQuiz(quizData);

      setAnswers(Array(quizData.questions.length).fill(-1));

      setCurrentIndex(0);
      setResult(null);
      setAttempts([]);
      setShowHistory(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to generate quiz. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Select Answer
  const handleSelectAnswer = (optionIndex) => {
    if (submitting || result) return;

    setAnswers((previous) =>
      previous.map((answer, index) =>
        index === currentIndex ? optionIndex : answer,
      ),
    );
  };

  // Clear Selected Answer
  const handleClearAnswer = () => {
    if (submitting || result) return;

    setAnswers((previous) =>
      previous.map((answer, index) => (index === currentIndex ? -1 : answer)),
    );
  };

  // Submit Quiz
  const handleSubmit = async () => {
    if (!quiz || submitting || result) return;

    const unanswered = answers.filter((answer) => answer === -1).length;

    if (unanswered > 0) {
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`,
      );

      if (!confirmed) return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await submitQuiz(quiz._id, answers);

      setResult(response.data);
      setShowHistory(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  // Retake Quiz
  const handleRetake = () => {
    if (!quiz || historyLoading) return;

    setAnswers(Array(quiz.questions.length).fill(-1));

    setCurrentIndex(0);
    setResult(null);
    setError("");
    setShowHistory(false);
  };

  // Retrieve Attempt History
  const handleHistory = async () => {
    if (!quiz || historyLoading) return;

    if (showHistory) {
      setShowHistory(false);
      return;
    }

    setHistoryLoading(true);
    setError("");

    try {
      const response = await getQuizAttempts(quiz._id);

      setAttempts(response.data || []);
      setShowHistory(true);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to retrieve attempt history.",
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const totalQuestions = quiz?.questions.length || 0;

  const answeredCount = answers.filter((answer) => answer !== -1).length;

  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;

  const currentQuestion = quiz?.questions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">🧠 AI Practice Quiz</h2>

        <p className="mt-2 text-indigo-100 text-sm">
          Test your understanding with AI-generated multiple-choice questions.
        </p>
      </div>

      {/* Error Message */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      {/* Initial Empty State */}

      {!quiz && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-6xl mb-4">📝</div>

          <h3 className="text-xl font-bold text-gray-800">
            Ready to test your knowledge?
          </h3>

          <p className="mt-3 text-gray-500">
            Generate 10 practice questions based on your study notes.
          </p>

          <button
            onClick={handleGenerate}
            disabled={loading || !noteId}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Generating Quiz..." : "✨ Generate AI Quiz"}
          </button>

          {loading && (
            <p className="mt-4 text-sm text-gray-500 animate-pulse">
              AI is preparing your questions...
            </p>
          )}
        </div>
      )}

      {/* Active Quiz */}

      {quiz && !result && currentQuestion && (
        <div className="space-y-6">
          {/* Progress Bar */}

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between text-sm font-medium mb-3">
              <span>Quiz Progress</span>

              <span className="text-indigo-600">
                {answeredCount}/{totalQuestions} Answered
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                animate={{
                  width: `${progress}%`,
                }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
          </div>

          {/* Question Navigator */}

          <div className="rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-700 mb-3">
              Question Navigator
            </h4>

            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((q, index) => (
                <button
                  key={q._id || index}
                  disabled={submitting}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Question ${index + 1}`}
                  className={`w-10 h-10 rounded-lg font-medium transition
                                        ${
                                          currentIndex === index
                                            ? "bg-indigo-600 text-white"
                                            : answers[index] !== -1
                                              ? "bg-green-100 text-green-700"
                                              : "bg-gray-100 text-gray-600"
                                        }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
              <span>🟪 Current</span>
              <span>🟩 Answered</span>
              <span>⬜ Unanswered</span>
            </div>
          </div>

          {/* Question Card */}

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-indigo-600 mb-3">
              Question {currentIndex + 1} of {totalQuestions}
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>

            {/* Options */}

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  disabled={submitting}
                  aria-pressed={answers[currentIndex] === index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition
                                            ${
                                              answers[currentIndex] === index
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                            }`}
                >
                  <span
                    className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-bold
                                            ${
                                              answers[currentIndex] === index
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option}</span>
                </button>
              ))}
            </div>

            {/* Clear Answer */}

            <button
              onClick={handleClearAnswer}
              disabled={submitting}
              className="mt-4 text-sm font-medium text-gray-500 hover:text-red-600"
            >
              Clear Selection
            </button>
          </motion.div>

          {/* Navigation Buttons */}

          <div className="flex flex-wrap justify-between gap-3">
            <button
              disabled={currentIndex === 0 || submitting}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-700 disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                disabled={submitting}
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(totalQuestions - 1, prev + 1),
                  )
                }
                className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Quiz ✓"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Result Dashboard */}

      {result && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
          >
            <div className="text-6xl mb-4">
              {result.percentage >= 80
                ? "🏆"
                : result.percentage >= 50
                  ? "🎯"
                  : "📚"}
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Quiz Completed!
            </h2>

            {/* Circular Score */}

            <div
              className="mx-auto my-6 w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(
                                    #4f46e5 ${result.percentage}%,
                                    #e5e7eb ${result.percentage}%
                                )`,
              }}
            >
              <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-indigo-600">
                  {result.percentage}%
                </span>

                <span className="text-sm text-gray-500">
                  {result.score}/{result.totalQuestions}
                </span>
              </div>
            </div>

            <p className="font-semibold text-gray-700">
              {result.percentage >= 80
                ? "Excellent work! Keep it up."
                : result.percentage >= 50
                  ? "Good effort! Keep practising."
                  : "Keep learning and try again."}
            </p>

            {/* Result Statistics */}

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-2xl font-bold text-green-600">
                  {result.correctCount}
                </p>

                <p className="text-sm text-green-700">Correct</p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-2xl font-bold text-red-600">
                  {result.incorrectCount}
                </p>

                <p className="text-sm text-red-700">Incorrect</p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-2xl font-bold text-orange-600">
                  {result.unansweredCount}
                </p>

                <p className="text-sm text-orange-700">Skipped</p>
              </div>
            </div>
          </motion.div>

          {/* Result Actions */}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRetake}
              disabled={historyLoading}
              className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              🔄 Retake Quiz
            </button>

            <button
              onClick={handleHistory}
              disabled={historyLoading}
              className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 font-semibold text-indigo-700"
            >
              {historyLoading
                ? "Loading..."
                : showHistory
                  ? "Hide History"
                  : "📊 Attempt History"}
            </button>
          </div>

          {/* Attempt History */}

          {showHistory && (
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="text-lg font-bold mb-4">Previous Attempts</h3>

              {attempts.length === 0 && (
                <p className="text-gray-500 text-sm">No attempts found.</p>
              )}

              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <div
                    key={attempt._id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        Score: {attempt.score}/{attempt.totalQuestions}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(attempt.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span className="rounded-lg bg-indigo-100 px-3 py-2 font-bold text-indigo-700">
                      {attempt.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Review */}

          <h3 className="text-xl font-bold text-gray-800">📖 Answer Review</h3>

          {result.results.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border p-5
                                ${
                                  item.isCorrect
                                    ? "border-green-200 bg-green-50"
                                    : item.selectedAnswer === -1
                                      ? "border-orange-200 bg-orange-50"
                                      : "border-red-200 bg-red-50"
                                }`}
            >
              <p
                className={`text-sm font-semibold mb-2
                                ${
                                  item.isCorrect
                                    ? "text-green-700"
                                    : item.selectedAnswer === -1
                                      ? "text-orange-700"
                                      : "text-red-700"
                                }`}
              >
                Question {index + 1} —
                {item.isCorrect
                  ? " Correct ✓"
                  : item.selectedAnswer === -1
                    ? " Skipped"
                    : " Incorrect ✗"}
              </p>

              <h4 className="font-bold text-gray-800 mb-3">{item.question}</h4>

              <p className="text-sm text-gray-700">
                <strong>Your answer: </strong>

                {item.selectedAnswer === -1
                  ? "Not answered"
                  : item.options[item.selectedAnswer]}
              </p>

              <p className="mt-2 text-sm font-medium text-green-700">
                Correct answer: {item.options[item.correctAnswer]}
              </p>

              <div className="mt-3 rounded-lg bg-white/70 p-3 text-sm text-gray-700">
                <strong>Explanation: </strong>

                {item.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quiz;
