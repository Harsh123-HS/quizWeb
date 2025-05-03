import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa"; // social icons

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 mt-" data-aos="fade-up">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center hover:scale-105 transition-transform duration-300">
              <img
                src="https://png.pngtree.com/png-vector/20230120/ourmid/pngtree-quiz-logo-with-speech-bubble-symbols-png-image_6568572.png"
                className="mr-3 h-16"
                alt="Logo"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 dark:text-white uppercase">Resources</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li>
                  <Link to="/" className="hover:text-orange-600 transition-colors duration-200">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-orange-600 transition-colors duration-200">About</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 dark:text-white uppercase">Follow us</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li className="flex items-center gap-2">
                  <FaGithub className="text-lg hover:text-black dark:hover:text-white transition" />
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-600"
                  >
                    Github
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaLinkedin className="text-lg hover:text-blue-700 dark:hover:text-blue-400 transition" />
                  <a
                    href="https://linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-600"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-6 border-t dark:border-gray-700 pt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2025 MinorProject$G1. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
