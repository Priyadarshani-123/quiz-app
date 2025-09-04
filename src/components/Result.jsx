import { useState } from "react";
import { motion } from "framer-motion";

export default function Result({ score, total, answers, highScores, onRestart, onRetry }) {
  const [showReview, setShowReview] = useState(false);

  return (
    <motion.div
      className="quiz-card w-full h-full bg-gradient-to-br from-blue-950 via-black to-gray-900 rounded-3xl p-8 shadow-2xl text-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {!showReview ? (
        <>
          {/* Leaderboard Page */}
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">
            🎉 You Scored {score} / {total}
          </h2>

          <div className="mb-6 bg-gray-800/70 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">🏆 Leaderboard</h3>
            <ul className="space-y-2">
              {highScores.map((s, i) => (
                <li
                  key={i}
                  className={`text-sm font-medium py-2 rounded-lg ${
                    s === score
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  #{i + 1}: {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 rounded-xl text-white font-bold text-base shadow-md"
            >
              🔄 Retry Quiz
            </button>
            <button
              onClick={() => setShowReview(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white font-bold text-base shadow-md"
            >
              📖 Review Answers
            </button>
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-bold text-base shadow-md"
            >
              🏠 Home
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Review Page */}
          <h3 className="text-xl font-semibold text-green-400 mb-4">📖 Review</h3>
          <div className="text-left max-h-64 overflow-y-auto space-y-3 pr-2 custom-scroll">
            {answers.map((ans, i) => (
              <motion.div
                key={i}
                className={`p-4 rounded-xl border ${
                  ans.isCorrect
                    ? "bg-gradient-to-r from-green-600 to-green-700 border-green-400"
                    : "bg-gradient-to-r from-red-600 to-red-700 border-red-400"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <p
                  className="font-semibold text-white mb-1 text-sm"
                  dangerouslySetInnerHTML={{ __html: ans.question }}
                />
                <p className="text-xs">
                  Your answer:{" "}
                  <span
                    className={ans.isCorrect ? "text-yellow-200 font-bold" : "text-yellow-100 font-bold"}
                    dangerouslySetInnerHTML={{ __html: ans.chosen || "⏰ Skipped" }}
                  />
                </p>
                {!ans.isCorrect && (
                  <p className="text-xs">
                    Correct:{" "}
                    <span
                      className="font-bold text-white"
                      dangerouslySetInnerHTML={{ __html: ans.correct }}
                    />
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowReview(false)}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl text-white font-bold text-base shadow-md"
            >
              ⬅️ Back to Leaderboard
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
