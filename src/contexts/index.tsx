import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { RefineThemes } from "@refinedev/mui";
import { parseCookies, setCookie } from "nookies";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {getApiURL} from "../utils/api";

type ColorModeContextType = {
  apiUrl: string,
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState("light");
  const [apiUrl, setApiUrl] = useState("")

  useEffect(() => {
    const apiURL = getApiURL();
    setApiUrl(apiURL)
    setIsMounted(true);
  }, []);

  const systemTheme = useMediaQuery(`(prefers-color-scheme: light)`);

  useEffect(() => {
    if (isMounted) {
      setMode(parseCookies()["theme"] || (systemTheme ? "dark" : "light"));
    }
  }, [isMounted, systemTheme]);

  const toggleTheme = () => {
    const nextTheme = mode === "light" ? "dark" : "light";

    setMode(nextTheme);
    setCookie(null, "theme", nextTheme);
  };

  return (
    <ColorModeContext.Provider
      value={{
        setMode: toggleTheme,
        mode,
        apiUrl,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        theme={mode === "light" ? RefineThemes.Yellow : RefineThemes.YellowDark}
      >
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
