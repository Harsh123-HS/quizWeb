import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { quizCategories } from "./QuizCategories";
import QuizQuestions from "./QuizQuestions";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient"; // make sure supabase client is initialized here
import { useSession } from "@supabase/auth-helpers-react";

export default function QuizField() {
  const session = useSession(); // get user session
  const location = useLocation();
  const passedCategory = location.state?.category;
  const passedDifficulty = location.state?.difficulty || "medium";

  const initialCategoryId =
    typeof passedCategory === "number"
      ? passedCategory
      : quizCategories.find((cat) => cat.name === passedCategory)?.id || 9;

  const [category, setCategory] = useState(initialCategoryId);
  const [difficulty, setDifficulty] = useState(passedDifficulty);
  const [questions, setQuestions] = useState([]);
  const [showQuizPage, setShowQuizPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const questionRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  useEffect(() => {
    if (passedCategory) {
      handleStartQuiz();
    }
  }, [passedCategory]);

 const handleStartQuiz = async () => {
  try {
    setLoading(true);

    const baseUrl = import.meta.env.VITE_API_URL; // backend URL from env
    const res = await fetch(
      `${baseUrl}/questions?amount=5&category=${category}&difficulty=${difficulty}`
    );

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    setQuestions(data.questions);
    setShowQuizPage(true);

    setTimeout(() => {
      questionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (err) {
    console.error("Failed to fetch questions", err);
    alert("Failed to fetch questions.");
  } finally {
    setLoading(false);
  }
};


  const handleQuizComplete = async ({ score, total }) => {
    if (!session?.user) {
      console.error("User not logged in");
      return;
    }

    const { data, error } = await supabase.from("user_quiz_attempts").insert([
      {
        user_id: session.user.id,
        quiz_id: category, // assuming category = quiz_id
        score: score,
        total_question: total,
      },
    ]);

    if (error) {
      console.error("Error storing attempt:", error);
      alert("Error storing quiz result.");
    } else {
      console.log("Quiz result stored:", data);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 overflow-hidden">
      {/* ... SVG blobs skipped for brevity ... */}

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-200">Loading quiz...</p>
        </div>
      ) : !showQuizPage ? (
        !passedCategory ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-xl rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-sm bg-opacity-80"
          >
            <h2 className="text-3xl font-bold mb-6">Select Your Quiz</h2>
            <div className="text-left space-y-4">
              <label className="block">
                Category:
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
                Difficulty:
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
              Start Quiz
            </button>
          </motion.div>
        ) : null
      ) : (
        <div className="max-w-2xl w-full" ref={questionRef}>
          <QuizQuestions
            questions={questions}
            categoryId={category}
            difficulty={difficulty}
            onQuizComplete={handleQuizComplete} // ✅ pass handler
          />
        </div>
      )}
    </div>
  );
}
