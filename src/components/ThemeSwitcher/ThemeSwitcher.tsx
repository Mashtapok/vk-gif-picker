import React, { useEffect, useState } from "react";
import { IconThemeSwitcher } from "../../icons";
import "./ThemeSwitcher.css";

export const ThemeSwitcher: React.FC = () => {
  const [scheme, setScheme] = useState("");

  useEffect(() => {
    // Подстраиваемся под тему браузера
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setScheme("dark");
    } else {
      setScheme("light");
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute("scheme", scheme);
  }, [scheme]);

  const onThemeToggle = () => {
    setScheme(scheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      className="theme-switcher"
      id="theme-switcher"
      title="Переключить цветовую схему"
      aria-label={scheme}
      aria-live="polite"
      tabIndex={1}
      onClick={onThemeToggle}
    >
      <IconThemeSwitcher className="sun-and-moon" />
    </button>
  );
};
