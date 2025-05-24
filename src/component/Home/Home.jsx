import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import { motion } from "framer-motion";
import "aos/dist/aos.css";
import FeatureIcons from "./FeatureIcons";
import Cards from "./Cards";
import homePNG from "../../assets/homePNG.png";
const MotionLink = motion(Link);


function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-sky-100 dark:bg-gray-900 transition-colors duration-300 min-h-screen py-6 relative overflow-hidden">

      {/* Decorative Floating Blobs */}
      <motion.div
        className="absolute top-20 left-10 w-60 h-60 bg-purple-300 opacity-30 rounded-full filter blur-2xl z-0"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-72 h-72 bg-yellow-200 opacity-30 rounded-full filter blur-2xl z-0"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-2/3 left-2/3 w-64 h-64 bg-blue-300 opacity-20 rounded-full filter blur-3xl z-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-[80vh] rounded-xl mx-auto mt-4 max-w-6xl px-10 py-16 flex flex-col justify-center z-10"
        style={{ backgroundImage: `url(${homePNG})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/60 dark:bg-black/40 rounded-xl"></div>

        {/* Hero Text */}
        <motion.div
          className="relative z-10 text-left text-blue-900 dark:text-white max-w-2xl"
          data-aos="fade-right"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-2 text-blue-600"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            Challenge
          </motion.h1>
          <h2 className="text-5xl md:text-7xl font-semibold text-blue-400">
            Your Brain!
          </h2>
          <p className="mt-6 text-xl md:text-2xl text-gray-800 dark:text-slate-200">
            Fun, Fast, and Brain-boosting quizzes on every topic.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
          <MotionLink
  to="QuizField"
  whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(255, 165, 0, 0.8)" }}
  className="bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl text-xl px-8 py-2 transition"
>
  Start a Quiz
</MotionLink>

<MotionLink
  to="/LeaderBoard"
  whileHover={{ scale: 1.05 }}
  className="bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 border border-gray-300 dark:border-gray-500 rounded-xl text-xl px-8 py-2 transition"
>
LeaderBoard
</MotionLink>
          </div>
        </motion.div>
      </div>

      {/* Feature Icons */}
      <div className="z-10 relative">
        <FeatureIcons />
      </div>

      {/* Cards Section */}
      <motion.div
        className="flex gap-8 rounded-xl mt-6 bg-white dark:bg-gray-800 text-black dark:text-white justify-between items-center mx-auto max-w-6xl p-4 flex-wrap transition-colors duration-300 z-10 relative"
        data-aos="fade-up"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Cards />
      </motion.div>
    </div>
  );
}

export default Home;

