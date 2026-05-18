import React, { useEffect, useState } from "react";
import { IconThemeSwitcher } from "../../icons";

import "./ThemeSwitcher.css";

export const ThemeSwitcher = () => {
  const [scheme, setScheme] = useState("");

  useEffect(() => {
    // Match the browser color scheme
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
      title="Toggle color scheme"
      aria-label={`${scheme} scheme`}
      aria-live="polite"
      tabIndex={1}
      onClick={onThemeToggle}
    >
      <IconThemeSwitcher className="sun-and-moon" />
    </button>
  );
};
