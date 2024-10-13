import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // functionality for theme toggle
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signInUser = (userData) => {
    setUser(userData);
  };
  const signOutUser = () => {
    setUser(null);
  };
  return (
    <GlobalContext.Provider
      value={{
        toggleThemeMode,
        themeMode,
        signInUser,
        setUser,
        user,
        signOutUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
