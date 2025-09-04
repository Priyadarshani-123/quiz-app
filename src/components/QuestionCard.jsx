import { useState } from "react";

export default function QuestionCard({ question, index, total, onAnswer, timeLeft }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (opt) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onAnswer(opt), 800); // quicker feedback
  };

  return (
    <div className="quiz-card w-full h-full bg-gradient-to-br from-blue-950 via-black to-gray-900 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
      {/* Question Header */}
      <h2 className="text-2xl font-bold mb-4 text-blue-300">
        Question {index + 1} of {total}
      </h2>

      {/* Question */}
      <p
        className="mb-6 text-lg font-medium text-gray-200"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />

      {/* Options */}
      <div className="grid gap-4 flex-grow">
        {question.options.map((opt, i) => {
          let btnClass =
            "w-full py-4 px-5 rounded-xl text-base font-semibold shadow-md transition transform ";

          if (!selected) {
            btnClass +=
              "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105";
          } else if (opt === question.correct) {
            btnClass += "bg-gradient-to-r from-green-500 to-green-700 text-white";
          } else if (opt === selected) {
            btnClass += "bg-gradient-to-r from-red-500 to-red-700 text-white";
          } else {
            btnClass += "bg-gray-700 text-gray-400";
          }

          return (
            <button
              key={i}
              onClick={() => handleClick(opt)}
              disabled={!!selected}
              className={btnClass}
              dangerouslySetInnerHTML={{ __html: opt }}
            />
          );
        })}
      </div>

      {/* Timer */}
      <div className="mt-6 text-right text-sm font-medium text-yellow-400">
        ⏳ {timeLeft}s
      </div>
    </div>
  );
}
