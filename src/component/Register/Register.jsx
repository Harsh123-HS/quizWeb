import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const passwordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return alert("Enter Email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Enter Valid Email");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password)) return alert("Enter valid Password!");
    if (password !== confirmPass) return alert("Passwords do not match");
    if (!userRole) return alert("Select a role");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/verify", // Adjust as needed
        data: {
          name: userName,
          role: userRole,
        },
      },
    });

    if (error) {
      console.error("auth.signUp error:", error);
      return alert("Registration failed: " + error.message);
    }

    alert("✅ Registration successful! Please check your email and verify your account before logging in.");
    // Optionally, you could clear the form
    setEmail("");
    setPassword("");
    setConfirmPass("");
    setUserName("");
    setUserRole("");
  };

  return (
    <div className="min-h-screen bg-sky-100 dark:bg-gray-900 flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full p-2 rounded-2xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded-2xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 pr-10 rounded-2xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <button
              type="button"
              onClick={passwordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <input
            type="password"
            placeholder="Re-Enter Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
            className="w-full p-2 rounded-2xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            required
            className="w-full p-2 rounded-2xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <input
            type="submit"
            value="Register"
            className="w-full p-2 rounded-2xl border border-gray-600 text-white bg-orange-600 hover:bg-orange-700 cursor-pointer font-semibold"
          />
        </form>
      </div>
    </div>
  );
}

export default Register;
