// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

function Login() {
  const [eMail, setEMail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordVisibility = () => setShowPassword((prev) => !prev);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!eMail) return alert("Enter Email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eMail)) return alert("Enter Valid Email");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(pass)) return alert("Enter Valid Password!");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: eMail,
      password: pass,
    });

    if (error) {
      console.error("Login error:", error.message);
      return alert("Login failed: " + error.message);
    }

    const user = data?.user;

    if (!user?.email_confirmed_at) {
      return alert("Please verify your email before logging in.");
    }

    const pendingUser = JSON.parse(localStorage.getItem("pending_user") || "{}");
    const role = pendingUser.role;

    alert(`✅ Login successful! Welcome, ${pendingUser.username || "User"}.`);

    if (role === "admin") {
      navigate("/Admin");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-sky-100 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-xl">
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="E-mail"
            value={eMail}
            onChange={(e) => setEMail(e.target.value)}
            required
            className="w-full border border-gray-400 dark:border-gray-600 rounded-3xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="w-full border border-gray-400 dark:border-gray-600 rounded-3xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

          <button type="button" className="text-blue-600 hover:underline text-center block">
            Forgot password?
          </button>

          <input
            type="submit"
            value="Login"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-3xl transition"
          />

          <div className="text-center text-sm text-gray-700 dark:text-gray-300">
            Don&apos;t have an account?{" "}
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
