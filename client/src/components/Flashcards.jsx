import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateFlashcards } from "../services/api";

function Flashcards({ noteId }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!noteId || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await generateFlashcards(noteId);

      const generatedCards = response?.data?.cards;

      if (!Array.isArray(generatedCards) || generatedCards.length === 0) {
        throw new Error("No flashcards received");
      }

      setCards(generatedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load flashcards. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const progress = cards.length ? ((currentIndex + 1) / cards.length) * 100 : 0;

  return (
    <div className="space-y-6 py-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-700">🗂️ AI Flashcards</h2>

        <p className="text-sm text-gray-500 mt-2">
          Strengthen your memory through active recall and quick revision.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div role="alert" className="p-4 rounded-xl bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {cards.length === 0 && (
        <div
          className="rounded-2xl border border-indigo-100
                    bg-gradient-to-br from-indigo-50 to-purple-50
                    p-10 text-center space-y-4"
        >
          <div className="text-5xl">🧠</div>

          <h3 className="text-xl font-semibold text-gray-800">
            Ready to revise?
          </h3>

          <p className="text-sm text-gray-500">
            Generate 10 AI-powered flashcards from your study notes.
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleGenerate}
            disabled={loading || !noteId}
            className="px-6 py-3 rounded-xl
                            bg-indigo-600 text-white font-medium
                            hover:bg-indigo-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed"
          >
            {loading ? "Generating Flashcards..." : "✨ Generate Flashcards"}
          </motion.button>

          {loading && (
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
              }}
              className="text-sm text-indigo-600"
            >
              Preparing your study cards...
            </motion.p>
          )}
        </div>
      )}

      {/* FLASHCARD DISPLAY */}
      {cards.length > 0 && (
        <div className="space-y-6">
          {/* PROGRESS */}
          <div
            className="flex justify-between
                        text-sm font-medium text-gray-600"
          >
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div
            className="w-full h-2 bg-gray-200
                        rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full
                                bg-gradient-to-r
                                from-indigo-500 to-purple-500"
            />
          </div>

          {/* ANIMATED CARD */}
          <AnimatePresence mode="wait">
            <motion.button
              type="button"
              key={`${currentIndex}-${isFlipped}`}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsFlipped((prev) => !prev)}
              className={`w-full min-h-[280px]
                                rounded-2xl p-8
                                flex flex-col items-center
                                justify-center text-center
                                cursor-pointer border shadow-lg
                                transition-colors
                                ${
                                  isFlipped
                                    ? "bg-green-50 border-green-200"
                                    : "bg-indigo-50 border-indigo-200"
                                }`}
            >
              <span
                className={`text-xs font-bold
                                tracking-widest mb-6
                                ${
                                  isFlipped
                                    ? "text-green-600"
                                    : "text-indigo-600"
                                }`}
              >
                {isFlipped ? "ANSWER" : "QUESTION"}
              </span>

              <p
                className="text-xl md:text-2xl
                                font-semibold text-gray-800
                                leading-relaxed"
              >
                {isFlipped
                  ? cards[currentIndex].answer
                  : cards[currentIndex].question}
              </p>

              <span className="mt-8 text-sm text-gray-500">
                🔄 Click to reveal
                {isFlipped ? " question" : " answer"}
              </span>
            </motion.button>
          </AnimatePresence>

          {/* NAVIGATION */}
          <div
            className="flex flex-wrap
                        justify-between items-center gap-3"
          >
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-5 py-2 rounded-lg
                                border border-gray-300
                                hover:bg-gray-100
                                disabled:opacity-40"
            >
              ← Previous
            </button>

            <button
              onClick={() => setIsFlipped((prev) => !prev)}
              className="px-5 py-2 rounded-lg
                                bg-purple-100 text-purple-700
                                hover:bg-purple-200"
            >
              🔄 Flip Card
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="px-5 py-2 rounded-lg
                                bg-indigo-600 text-white
                                hover:bg-indigo-700
                                disabled:opacity-40"
            >
              Next →
            </button>
          </div>

          {/* RESTART */}
          {currentIndex === cards.length - 1 && (
            <div
              className="text-center p-5
                            rounded-xl bg-green-50
                            border border-green-200"
            >
              <h3 className="font-semibold text-green-700">
                🎉 You've reached the last card!
              </h3>

              <button
                onClick={handleRestart}
                className="mt-3 px-5 py-2
                                    rounded-lg bg-green-600
                                    text-white hover:bg-green-700"
              >
                Restart Revision
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Flashcards;
