import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import { motion } from "framer-motion";
import "aos/dist/aos.css";

const MotionLink = motion(Link);

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const colors = ["bg-blue-300", "bg-pink-300", "bg-yellow-300", "bg-green-300", "bg-purple-300"];

  return (
    <div className="bg-sky-100 dark:bg-gray-900 transition-colors duration-300 min-h-screen py-6 relative overflow-hidden">

      {/* Floating Blobs */}
      {/* Big blobs */}
      <motion.div className="absolute top-20 left-10 w-60 h-60 bg-green-300 opacity-50 rounded-full filter blur-xl z-0"
        animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-10 right-20 w-72 h-72 bg-pink-200 opacity-50 rounded-full filter blur-xl z-0"
        animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} />

      {/* Interactive small objects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${colors[i % colors.length]} opacity-60 rounded-full z-0`}
          style={{
            width: `${20 + Math.random() * 20}px`,
            height: `${20 + Math.random() * 20}px`,
            top: `${Math.random() * 80}vh`,
            left: `${Math.random() * 80}vw`,
          }}
          animate={{ y: [0, 10, 0] }}
          whileHover={{ scale: 1.5, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
          transition={{ repeat: Infinity, duration: 5 + Math.random() * 5, ease: "easeInOut" }}
        />
      ))}

      {/* Medium-sized blobs */}
      <motion.div className="absolute top-1/2 left-5 w-40 h-40 bg-yellow-200 opacity-50 rounded-full filter blur-xl z-0"
        animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/4 right-1/3 w-50 h-50 bg-purple-200 opacity-50 rounded-full filter blur-xl z-0"
        animate={{ scale: [1, 0.9, 1] }} transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }} />

      {/* Hero Section */}
      <div className="relative min-h-[70vh] rounded-xl mx-auto mt-4 max-w-5xl px-10 py-16 flex flex-col justify-center z-10 text-center"
        data-aos="fade-up">
        <motion.h1 className="text-5xl md:text-7xl font-bold mb-4 text-blue-600"
          animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          About This App
        </motion.h1>
        <motion.h2 className="text-3xl md:text-5xl font-semibold text-blue-400"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}>
          Boost Your Brain!
        </motion.h2>
        <motion.p className="mt-6 text-lg md:text-xl text-gray-800 dark:text-slate-200 max-w-2xl mx-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: "easeInOut" }}>
          This app offers fun, fast, and brain-boosting quizzes across every topic you love. 
          Learn while playing and challenge your mind daily!
        </motion.p>

        <div className="mt-10 flex justify-center">
          <MotionLink
            to="/QuizField"
            whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(255, 165, 0, 0.8)", transition: { duration: 0.3, ease: "easeInOut" } }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl text-xl px-8 py-2 transition"
          >
            Try a Quiz
          </MotionLink>
        </div>
      </div>

      {/* Features Section */}
      <motion.div className="flex flex-col md:flex-row gap-8 rounded-xl mt-6 bg-white dark:bg-gray-800 text-black dark:text-white justify-between items-center mx-auto max-w-6xl p-8 flex-wrap transition-colors duration-300 z-10 relative"
        data-aos="fade-up" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}>

        <motion.div className="text-center max-w-sm"
          whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}>
          <h3 className="text-2xl font-bold mb-2 text-blue-500">Learn Fast</h3>
          <p className="text-gray-700 dark:text-gray-300">Quick quizzes designed to maximize retention and minimize boredom.</p>
        </motion.div>

        <motion.div className="text-center max-w-sm"
          whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}>
          <h3 className="text-2xl font-bold mb-2 text-green-500">Track Progress</h3>
          <p className="text-gray-700 dark:text-gray-300">Monitor your scores and improve over time with detailed feedback.</p>
        </motion.div>

        <motion.div className="text-center max-w-sm"
          whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}>
          <h3 className="text-2xl font-bold mb-2 text-pink-500">Challenge Friends</h3>
          <p className="text-gray-700 dark:text-gray-300">Compete with friends and climb the leaderboard for ultimate bragging rights.</p>
        </motion.div>

      </motion.div>

    </div>
  );
}