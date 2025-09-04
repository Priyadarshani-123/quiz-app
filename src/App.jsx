import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Quiz from "./pages/Quiz";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function App() {
  const [start, setStart] = useState(false);
  const [category, setCategory] = useState("9"); // Default: General Knowledge
  const [difficulty, setDifficulty] = useState("easy");

  // Particle background
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-black to-gray-900 text-white overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          particles: {
            number: { value: 60 },
            color: { value: ["#3b82f6", "#2563eb", "#1e40af"] }, // blue shades
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: 3 },
            move: { enable: true, speed: 1 },
            links: { enable: true, color: "#60a5fa", opacity: 0.2 },
          },
        }}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />

      <AnimatePresence mode="wait">
        {!start ? (
          // 🌌 Landing Page
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg bg-black/50 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center border border-blue-800"
          >
            <h1 className="text-3xl font-bold mb-4 text-blue-300 drop-shadow">
              🚀 Welcome to QuizMaster
            </h1>
            <p className="mb-6 text-base text-gray-300">
              Test your knowledge and climb the leaderboard!
            </p>

            {/* Category Selection */}
            <div className="mb-4 text-left">
              <label className="block mb-1 font-medium text-sm text-gray-200">
                📚 Select Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-lg text-sm font-medium text-black"
              >
                <option value="9">General Knowledge</option>
                <option value="21">Sports</option>
                <option value="23">History</option>
                <option value="17">Science & Nature</option>
                <option value="18">Computers</option>
              </select>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6 text-left">
              <label className="block mb-1 font-medium text-sm text-gray-200">
                ⚡ Select Difficulty:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 rounded-lg text-sm font-medium text-black"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setStart(true)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white font-bold text-lg shadow-md hover:scale-105 transition"
            >
              ▶️ Start Quiz
            </button>
          </motion.div>
        ) : (
          // Quiz Page
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl"
          >
            <Quiz
              category={category}
              difficulty={difficulty}
              onRestart={() => setStart(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
