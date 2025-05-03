import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import FeatureIcons from "./FeatureIcons";
import Cards from "./Cards";
import homePNG from "../../assets/homePNG.png";

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-sky-100 dark:bg-gray-900 transition-colors duration-300 min-h-screen py-6">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-[80vh] rounded-xl mx-auto mt-4 max-w-6xl px-10 py-16 flex flex-col justify-center"
        style={{ backgroundImage: `url(${homePNG})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/60 dark:bg-black/40  rounded-xl"></div>

        {/* Hero Text */}
        <div className="relative z-10 text-left text-blue-900 dark:text-white max-w-2xl" data-aos="fade-right">
          <h1 className="text-6xl md:text-8xl font-bold mb-2 text-blue-600">Challenge</h1>
          <h2 className="text-5xl md:text-7xl font-semibold text-blue-400">Your Brain!</h2>
          <p className="mt-6 text-xl md:text-2xl text-gray-800 dark:text-slate-200">
            Fun, Fast, and Brain-boosting quizzes on every topic.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="QuizField"
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl text-xl px-8 py-2 transition"
            >
              Start a Quiz
            </Link>

            <Link
              to="/auth"
              className="bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 border border-gray-300 dark:border-gray-500 rounded-xl text-xl px-8 py-2 transition"
            >
              Sign In / Register
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Icons */}
      <FeatureIcons />

      {/* Cards Section */}
      <div
        className="flex gap-8 rounded-xl mt-6 bg-white dark:bg-gray-800 text-black dark:text-white justify-between items-center mx-auto max-w-6xl p-4 flex-wrap transition-colors duration-300"
        data-aos="fade-up"
      >
        <Cards />
      </div>
    </div>
  );
}

export default Home;
