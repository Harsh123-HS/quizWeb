import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { themeMode, darkTheme, lightTheme } = useTheme();
  const isDark = themeMode === "dark";

  const toggle = () => (isDark ? lightTheme() : darkTheme());

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/github", label: "LeaderBoard" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://png.pngtree.com/png-vector/20230120/ourmid/pngtree-quiz-logo-with-speech-bubble-symbols-png-image_6568572.png"
            alt="logo"
            className="w-12 h-10"
          />
        </Link>

        {/* Nav Links */}
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

        {/* Right controls */}
        <div className="flex items-center gap-3">
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

          {/* Toggle theme */}
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
