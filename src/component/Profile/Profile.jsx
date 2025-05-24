// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";

const colors = ["bg-blue-300", "bg-pink-300", "bg-yellow-300", "bg-green-300", "bg-purple-300"];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
          throw new Error("Failed to get authenticated user.");
        }

        const userId = authData.user.id;

        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (profileError) {
          throw new Error("Profile not found.");
        }

        setProfile(userProfile);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-gray-900 text-xl text-blue-600 dark:text-orange-400">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-lg font-medium">
        ❌ {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-gray-900 text-gray-800 dark:text-white relative overflow-hidden">
      {/* Floating Background Objects */}
      <motion.div className="absolute top-20 left-10 w-60 h-60 bg-green-300 opacity-50 rounded-full filter blur-xl z-0"
        animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-10 right-20 w-72 h-72 bg-pink-200 opacity-50 rounded-full filter blur-xl z-0"
        animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} />

      {[...Array(6)].map((_, i) => (
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

      <motion.div
        className="p-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-700 dark:text-orange-400">
          👤 User Profile
        </h1>
        <div className="space-y-4 text-lg">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}> <strong>Username:</strong> {profile.username}</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}> <strong>Email:</strong> {profile.email}</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}> <strong>Role:</strong> {profile.role}</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}> <strong>User ID:</strong> {profile.user_id}</motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;