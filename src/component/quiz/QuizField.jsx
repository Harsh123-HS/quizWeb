import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { quizCategories } from "./QuizCategories";
import QuizQuestions from "./QuizQuestions";

export default function QuizField() {
  const location = useLocation();
  const passedCategory = location.state?.category;

  const initialCategoryId =
    quizCategories.find((cat) => cat.name === passedCategory)?.id || 9;

  const [category, setCategory] = useState(initialCategoryId);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [showQuizPage, setShowQuizPage] = useState(false);
  const questionRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const handleStartQuiz = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/questions?amount=5&category=${category}&difficulty=${difficulty}`
      );
      const data = await res.json();
      setQuestions(data.questions);
      setShowQuizPage(true);
      setTimeout(() => {
        questionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      alert("Failed to fetch questions.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      {!showQuizPage ? (
        <div
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl font-bold mb-6">🎯 Select Your Quiz</h2>
          <div className="text-left space-y-4">
            <label className="block">
              📚 Category:
              <select
                className="mt-1 w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
              >
                {quizCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              🎚 Difficulty:
              <select
                className="mt-1 w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>

          <button
            onClick={handleStartQuiz}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition shadow-lg"
          >
            🎮 Let's Play
          </button>
        </div>
      ) : (
        <div className="max-w-2xl w-full" ref={questionRef}>
          <QuizQuestions
            questions={questions}
            categoryId={category}
            difficulty={difficulty}
          />
        </div>
      )}
    </div>
  );
}
