"use client";

import { useTheme } from "next-themes";
import React, { useState } from "react";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

const ThemeButton = () => {
  const { setTheme } = useTheme();
  const [themeLight, setThemeLight] = useState<boolean>(true);

  const handleThemeChange = () => {
    if (!themeLight) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    setThemeLight(!themeLight);
  };

  return (
    <Button variant={"outline"} size={"icon"} onClick={handleThemeChange}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

export default ThemeButton;
