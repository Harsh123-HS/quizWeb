import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { quizCategories } from "./QuizCategories";
import { supabase } from "../../lib/supabaseClient";

export default function QuizQuestions({
  questions: initialQuestions,
  categoryId,
  difficulty,
  onQuizComplete,
}) {
  const categoryName =
    quizCategories.find((c) => c.id === Number(categoryId))?.name ||
    "General Knowledge";

  const [questions, setQuestions] = useState(initialQuestions || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [startTime, setStartTime] = useState(Date.now());
  const [responseTimes, setResponseTimes] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [locked, setLocked] = useState(false);

  const total = questions.length;
  const q = questions[current];

  const botPhrases = [
    "🎮 Let's play a game! Here's your first challenge:",
    "🤔 Alright, ready for the next one?",
    "🧠 Time to test that brainpower!",
    "🚀 Here's another quiz rocket coming your way!",
    "💡 Think carefully... this one might trick you!",
  ];

  useEffect(() => {
    setTimeLeft(15);
    setStartTime(Date.now());

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (selected[current] === undefined) {
            setSelected((prev) => ({ ...prev, [current]: "Timed out" }));
            setFeedback((prev) => ({ ...prev, [current]: "wrong" }));
            setResponseTimes((prev) => [...prev, 15]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [current]);

  const handleSelect = (answer) => {
    if (!submitted && !locked && selected[current] === undefined) {
      setLocked(true);
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      setSelected((prev) => ({ ...prev, [current]: answer }));
      setResponseTimes((prev) => [...prev, timeTaken]);
      if (answer === q.correct_answer) {
        setScore((prev) => prev + 2);
        setFeedback((prev) => ({ ...prev, [current]: "correct" }));
      } else {
        setFeedback((prev) => ({ ...prev, [current]: "wrong" }));
      }
    }
  };

  const handleNext = async () => {
    setLocked(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setSubmitted(true);

      // Updated session-based user fetching
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (!sessionError && userId) {
        try {
          const { error: insertError } = await supabase
            .from("user_quiz_attempts")
            .insert({
              user_id: userId,
              score,
              total_questions: questions.length,
            });

          if (insertError) {
            console.error("Insert failed:", insertError.message);
          } else {
            console.log("✅ Quiz result saved to database!");
          }
        } catch (err) {
          console.error("Insert error:", err.message);
        }
      } else {
        console.warn("⚠️ User not logged in — quiz result not saved.");
      }

      // Trigger callback
      if (typeof onQuizComplete === "function") {
        onQuizComplete({ score, total: questions.length });
      }
    }
  };

  const handleSkip = () => {
    if (selected[current] === undefined) {
      setSelected((prev) => ({ ...prev, [current]: "Skipped" }));
      setFeedback((prev) => ({ ...prev, [current]: "wrong" }));
      setResponseTimes((prev) => [...prev, timeLeft]);
    }
    handleNext();
  };

  const handleRestart = () => window.location.reload();

  const radius = 20;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / 15) * circumference;

  if (error || !q) {
    return (
      <div className="text-center py-20 text-red-600 dark:text-red-400 text-lg">
        ❌ Failed to load quiz questions. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-gray-800 dark:text-white transition-all duration-300">
      {!submitted ? (
        <>
          <h2 className="text-xl font-bold mb-3 text-center">
            {categoryName} — {difficulty[0].toUpperCase() + difficulty.slice(1)} Level
          </h2>

          {/* Conversational Bot Message */}
          <p className="text-center text-sm text-indigo-600 dark:text-indigo-300 mb-2 italic">
            {botPhrases[current % botPhrases.length]}
          </p>

          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              Question {current + 1} / {questions.length}
            </h3>
            <svg height="40" width="40">
              <circle
                stroke="#ccc"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="20"
                cy="20"
              />
              <circle
                stroke="red"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                style={{
                  strokeDashoffset,
                  transition: "stroke-dashoffset 1s linear",
                }}
                r={normalizedRadius}
                cx="20"
                cy="20"
              />
              <text x="20" y="24" textAnchor="middle" fontSize="12" fill="red">
                {timeLeft}s
              </text>
            </svg>
          </div>

          <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>

          <p className="text-lg font-semibold mb-4">{q.question}</p>

          <ul className="space-y-3">
            {Array.isArray(q?.options) ? (
              q.options.map((opt, idx) => {
                const isCorrect = feedback[current] === "correct" && opt === q.correct_answer;
                const isWrong = feedback[current] === "wrong" && selected[current] === opt;
                const isSelected = selected[current] === opt;

                return (
                  <li
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 cursor-pointer
                    ${
                      isCorrect
                        ? "bg-green-200 dark:bg-green-600 animate-bounce"
                        : ""
                    } 
                    ${
                      isWrong
                        ? "bg-red-200 dark:bg-red-600 animate-shake"
                        : ""
                    } 
                    ${isSelected ? "scale-105 shadow-md" : ""}
                    hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600`}
                  >
                    {opt}
                    {feedback[current] && isCorrect && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-300" />
                    )}
                    {feedback[current] && isWrong && (
                      <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-300" />
                    )}
                  </li>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Options not available.
              </p>
            )}
          </ul>

          {selected[current] && (
            <p className="text-sm text-right text-gray-500 dark:text-gray-400 mt-2">
              ⏱ You answered in {responseTimes[current] || 0}s
            </p>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={handleSkip}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow"
            >
              ⏭ Skip
            </button>

            <button
              onClick={handleNext}
              disabled={!selected[current]}
              className={`px-6 py-2 rounded text-white shadow transition ${
                selected[current]
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {current < questions.length - 1 ? "➡️ Next" : "✅ Submit"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
            🎉 Quiz Completed!
          </h2>
          <p className="text-lg">
            Your Score: <span className="font-bold">{score}</span> / {questions.length * 2}
          </p>

          <div className="text-left mt-6">
            <h4 className="text-xl font-semibold mb-3">
              📊 Your Answer Report
            </h4>
            <ul className="space-y-4">
              {questions.map((q, i) => (
                <li
                  key={i}
                  className="bg-white dark:bg-gray-700 p-4 rounded shadow border-l-4 border-blue-500"
                >
                  <p className="text-base font-medium mb-1 text-gray-900 dark:text-white">
                    <span className="font-semibold">Q{i + 1}:</span> {q.question}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✅ Correct: {q.correct_answer}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ⏱ Time: {responseTimes[i] || "–"}s | Answer: {selected[i]}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleRestart}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            🔁 Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
}
