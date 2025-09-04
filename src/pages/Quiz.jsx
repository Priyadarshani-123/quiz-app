import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "../components/QuestionCard";
import Result from "../components/Result";

export default function Quiz({ category, difficulty, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [highScores, setHighScores] = useState([]);
  const [skipped, setSkipped] = useState([]);


  useEffect(() => {
    fetch(
      `https://opentdb.com/api.php?amount=8&category=${category}&difficulty=${difficulty}&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => ({
          question: q.question,
          correct: q.correct_answer,
          options: [...q.incorrect_answers, q.correct_answer].sort(
            () => Math.random() - 0.5
          ),
        }));
        setQuestions(formatted);
      });

    const savedScores = JSON.parse(localStorage.getItem("highScores")) || [];
    setHighScores(savedScores);
  }, [category, difficulty]);

  // Timer
  useEffect(() => {
    if (isFinished || questions.length === 0) return;
    setTimeLeft(20);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null); // timeout counts as incorrect
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isFinished, questions]);

  const handleAnswer = (option) => {
    const currentQ = questions[currentIndex];
    const isCorrect = option === currentQ.correct;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswers([...answers, { ...currentQ, chosen: option, isCorrect }]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    const newScores = [...highScores, score]
      .sort((a, b) => b - a)
      .slice(0, 5);
    setHighScores(newScores);
    localStorage.setItem("highScores", JSON.stringify(newScores));
  };

  const resetQuiz = () => {
  setScore(0);
  setAnswers([]);
  setCurrentIndex(0);
  setIsFinished(false);
  setTimeLeft(20);
};

  if (questions.length === 0) {
    return (
      <div className="text-white text-lg font-semibold">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-blue-950 via-black to-gray-900 shadow-2xl rounded-3xl p-6 text-white border border-blue-800">
      {isFinished ? (
        <Result
          score={score}
          total={questions.length}
          answers={answers}
          highScores={highScores}
          onRestart={onRestart}
          onRetry= {resetQuiz}
        />
      ) : (
        <>
          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 mb-6 overflow-hidden">
            <motion.div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Timer */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-base font-medium">
                Question {currentIndex + 1} / {questions.length}
              </p>
              <div className="font-semibold text-yellow-400">
                ⏳ {timeLeft}s
              </div>
            </div>
            <motion.div
  className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
  key={timeLeft}
  initial={{ width: "100%" }}
  animate={{ width: `${(timeLeft / 20) * 100}%` }}
  transition={{ duration: 1, ease: "linear" }}
/>

          </div>

          {/* Question Card with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
            >
              <QuestionCard
                question={questions[currentIndex]}
                index={currentIndex}
                total={questions.length}
                onAnswer={handleAnswer}
                timeLeft={timeLeft}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
<div className="flex justify-between mt-6 gap-3">
  {/* Previous */}
  <button
    onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
    disabled={currentIndex === 0}
    className="px-4 py-2 rounded-lg bg-gray-700 text-sm font-medium disabled:opacity-50"
  >
    ⬅️ Previous
  </button>

  {/* Skip */}
  <button
    onClick={() => {
      setAnswers([
        ...answers,
        {
          ...questions[currentIndex],
          chosen: null,
          isCorrect: false,
          skipped: true,
        },
      ]);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        finishQuiz();
      }
    }}
    disabled={answers[currentIndex]}
    className="px-4 py-2 rounded-lg bg-yellow-600 text-sm font-medium disabled:opacity-50"
  >
    ⏭️ Skip
  </button>

  {/* Next */}
  <button
    onClick={() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        finishQuiz();
      }
    }}
    disabled={!answers[currentIndex]}   // 👈 Only enabled if answered/skipped
    className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium disabled:opacity-50"
  >
    Next ➡️
  </button>
</div>

        </>
      )}
    </div>
  );
}
