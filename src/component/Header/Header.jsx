import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

export default function Header() {
  const { themeMode, darkTheme, lightTheme } = useTheme();
  const { session } = useAuth();
  const navigate = useNavigate();

  const isDark = themeMode === "dark";
  const toggle = () => (isDark ? lightTheme() : darkTheme());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/LeaderBoard", label: "LeaderBoard" },
  ];

  const userFirstName = session?.user?.user_metadata?.username?.split(" ")[0] || "User";
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (!error && data?.role) setRole(data.role);
    };

    if (session?.user?.id) fetchRole();
  }, [session]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://png.pngtree.com/png-vector/20230120/ourmid/pngtree-quiz-logo-with-speech-bubble-symbols-png-image_6568572.png"
            alt="logo"
            className="w-12 h-10"
          />
        </Link>

        <nav className="hidden lg:flex gap-8 items-center">
          {navItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-orange-600"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <Menu as="div" className="relative inline-block text-left group">
              <Menu.Button
                className="w-10 h-10 rounded-full bg-orange-600 text-white font-bold text-sm flex items-center justify-center uppercase relative"
                title={userFirstName}
              >
                {userFirstName[0]}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg focus:outline-none">
                  <div className="px-1 py-1">
                    {role === "admin" && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate("/Admin")}
                            className={`$${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-white`}
                          >
                            Admin Page
                          </button>
                        )}
                      </Menu.Item>
                    )}

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate("/profile")}
                          className={`$${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-white`}
                        >
                          Profile
                        </button>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`$${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-800 dark:text-white hover:underline"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-orange-600 text-white px-4 py-1.5 text-sm rounded hover:bg-orange-700 transition"
              >
                Register
              </Link>
            </>
          )}

          <button
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:ring-2 ring-orange-400 transition"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
