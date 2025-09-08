// app/components/LeaderBoard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";

function LeaderBoard({ role, userId }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data, error } = await supabase
        .from("user_quiz_attempts")
        .select(`user_id, users(username, email), score, total_questions`)
        .order("user_id", { ascending: true });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const userMap = {};

      for (const attempt of data) {
        const uid = attempt.user_id;
        if (!userMap[uid]) {
          userMap[uid] = {
            user_id: uid,
            username: attempt.users?.username || "Unknown",
            email: attempt.users?.email || "-",
            score: 0,
            total_questions: 0,
          };
        }
        userMap[uid].score += attempt.score;
        userMap[uid].total_questions += attempt.total_questions;
      }

      const aggregated = Object.values(userMap);
      aggregated.sort((a, b) => b.score - a.score);
      setLeaders(aggregated);
      setLoading(false);
    };

    fetchLeaders();
  }, [role]);

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-20">{error}</div>;

  const getRank = (user_id) =>
    leaders.findIndex((entry) => entry.user_id === user_id) + 1;

  const isCurrentUser = (entry) => entry.user_id === userId;

  const renderUserView = () => {
    const top10 = leaders.slice(0, 10);
    const currentUser = leaders.find((l) => l.user_id === userId);
    const currentRank = getRank(userId);

    return (
      <motion.div
        className="max-w-xl mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-orange-400">
          Top 10 Quiz Leaders
        </h2>
        <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {top10.map((entry, i) => (
              <tr
                key={entry.user_id}
                className={`text-center transition-colors duration-300 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                  isCurrentUser(entry) ? "bg-yellow-100 dark:bg-yellow-900" : ""
                }`}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{isCurrentUser(entry) ? "You" : entry.username}</td>
                <td className="px-4 py-2">{entry.score}</td>
              </tr>
            ))}
            {!top10.some((e) => e.user_id === userId) && currentUser && (
              <tr className="text-center bg-green-100 dark:bg-green-800">
                <td className="px-4 py-2">{currentRank}</td>
                <td className="px-4 py-2">You</td>
                <td className="px-4 py-2">{currentUser.score}</td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    );
  };

  const renderAdminView = () => (
    <motion.div
      className="overflow-x-auto max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-2xl font-semibold text-blue-600 dark:text-orange-400 mb-4 text-center">
        Admin View
      </h2>
      <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
        <thead className="bg-blue-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Total Questions</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((entry, i) => (
            <tr
              key={entry.user_id}
              className="text-center transition-colors duration-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{entry.username}</td>
              <td className="px-4 py-2">{entry.email}</td>
              <td className="px-4 py-2">{entry.score}</td>
              <td className="px-4 py-2">{entry.total_questions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );

  return (
    <div className="min-h-screen px-4 py-10 bg-sky-50 dark:bg-gray-900 text-gray-900 dark:text-white relative">
      <motion.h1
        className="text-5xl font-bold text-center mb-10 text-blue-700 dark:text-orange-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🏆 Leaderboard
      </motion.h1>
      {role === "admin" ? renderAdminView() : renderUserView()}
    </div>
  );
}

export default LeaderBoard;