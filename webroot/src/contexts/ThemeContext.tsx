import { createContext, useContext } from "react";

interface ThemeContextValue {
  themeName: "management";
}

export const ThemeContext = createContext<ThemeContextValue>({ themeName: "management" });
export const useThemeName = () => useContext(ThemeContext).themeName;
