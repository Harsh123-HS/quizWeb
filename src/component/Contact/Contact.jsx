import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import { motion } from "framer-motion";
import "aos/dist/aos.css";
import emailjs from '@emailjs/browser';

const MotionLink = motion(Link);

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const formRef = useRef();
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_6xt45l9', 'template_c16gc7u', formRef.current, 'uH-9EO8YWsyyOjAw-')
      .then(() => {
        setSubmitted(true);
      }, (error) => {
        console.log(error.text);
      });
  };

  return (
    <div className="bg-sky-100 dark:bg-gray-900 transition-colors duration-300 min-h-screen py-6 relative overflow-hidden">

      {/* Floating Background Blobs */}
      <motion.div className="absolute top-10 left-20 w-52 h-52 bg-purple-300 opacity-40 rounded-full filter blur-xl z-0"
        animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-10 right-16 w-64 h-64 bg-yellow-200 opacity-40 rounded-full filter blur-xl z-0"
        animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} />

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute bg-pink-300 opacity-50 rounded-full z-0`}
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

      {/* Contact Section */}
      <div className="relative min-h-[70vh] rounded-xl mx-auto mt-4 max-w-4xl px-10 py-16 flex flex-col justify-center z-10 text-center"
        data-aos="fade-up">
        <motion.h1 className="text-5xl md:text-7xl font-bold mb-4 text-blue-600"
          animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          Get in Touch
        </motion.h1>
        <motion.p className="mt-6 text-lg md:text-xl text-gray-800 dark:text-slate-200 max-w-2xl mx-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: "easeInOut" }}>
          Have questions or feedback? We'd love to hear from you. Fill out the form below!
        </motion.p>

        {submitted ? (
          <p className="text-green-500 text-xl mt-6">Thank you! Your message has been sent.</p>
        ) : (
          <form ref={formRef} onSubmit={sendEmail} className="mt-10 space-y-4 max-w-md mx-auto text-left">
            <input
              type="text"
              name="user_name"
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="user_email"
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg px-4 py-2 transition duration-300"
            >
              Send Message
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
