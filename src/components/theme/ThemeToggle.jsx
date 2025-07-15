import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-[var(--interactive-hover)] text-[var(--text-secondary)]"
      title="Toggle Theme"
    >
      {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
      <span className="truncate">{darkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
