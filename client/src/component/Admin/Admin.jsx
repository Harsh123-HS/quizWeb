// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const colors = ["bg-blue-300", "bg-pink-300", "bg-yellow-300", "bg-green-300", "bg-purple-300"];

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const [sessionUserId, setSessionUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Access denied. Please login as admin.");
      navigate("/login");
      return;
    }

    setSessionUserId(session.user.id);

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (error || !data || data.role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/");
      return;
    }

    fetchUsers();
  }

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("user_id, email, role, created_at, username")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
      return;
    }

    const formatted = data.map((u) => ({
      id: u.user_id,
      email: u.email,
      role: u.role,
      username: u.username,
      created_at: u.created_at,
    }));

    setUsers(formatted);
    setLoading(false);
  }

  async function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const { error } = await supabase.from("users").delete().eq("user_id", userId);
    if (error) return alert("Delete failed: " + error.message);
    setUsers(users.filter((u) => u.id !== userId));
  }

  async function updateUser(userId, username, role) {
    const { error } = await supabase
      .from("users")
      .update({ username, role })
      .eq("user_id", userId);
    if (error) return alert("Update failed: " + error.message);
    setUsers(users.map((u) => (u.id === userId ? { ...u, username, role } : u)));
    setEditingUserId(null);
    setEditedRole("");
    setEditedUsername("");
  }

  return (
    <div className="bg-sky-100 dark:bg-gray-900 min-h-screen py-10 px-4 relative overflow-hidden text-gray-900 dark:text-white">
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

      <motion.h1 className="text-5xl font-bold text-center text-blue-600 dark:text-orange-400 mb-10 z-10 relative"
        animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
        Admin Panel
      </motion.h1>

      {loading ? (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300 z-10 relative">
          Loading users...
        </p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 z-10 relative">
          <table className="w-full table-auto border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-orange-600 text-lg">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr key={user.id} whileHover={{ scale: 1.01 }}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                    {editingUserId === user.id ? (
                      <input
                        className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{user.email}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                    {editingUserId === user.id ? (
                      <input
                        className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      />
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {user.id !== sessionUserId && (
                      editingUserId === user.id ? (
                        <>
                          <button onClick={() => updateUser(user.id, editedUsername, editedRole)} className="text-green-600 mr-2">Save</button>
                          <button onClick={() => setEditingUserId(null)} className="text-yellow-600">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingUserId(user.id); setEditedRole(user.role); setEditedUsername(user.username); }} className="text-blue-600 mr-2">Edit</button>
                          <button onClick={() => deleteUser(user.id)} className="text-red-600">Delete</button>
                        </>
                      )
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
