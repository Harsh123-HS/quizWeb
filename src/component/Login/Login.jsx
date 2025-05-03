import React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient"; // adjust the path if needed

function Login() {
  const passwordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [eMail, setEMail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!eMail) {
      alert("Enter Email");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eMail)) {
      alert("Enter Valid Email");
      return;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(pass)) {
      alert("Enter Valid Password!");
      return;
    }

    // Authentication logic here
  }

  return (
    <div className="min-h-screen bg-sky-100 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-xl">
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full border border-gray-400 dark:border-gray-600 rounded-3xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="E-mail"
              value={eMail}
              onChange={(e) => setEMail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "password" : "text"}
              name="password"
              id="pass"
              className="w-full border border-gray-400 dark:border-gray-600 rounded-3xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              autoComplete="off"
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />
            <button
              type="button"
              onClick={passwordVisibility}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 dark:text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="text-blue-600 text-center hover:underline cursor-pointer">
            <button type="button">Forgot password?</button>
          </div>

          <div>
            <input
              type="submit"
              value="Login"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-3xl transition"
            />
          </div>

          <div className="text-center text-sm text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <button type="button" className="text-blue-600 hover:underline">
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
