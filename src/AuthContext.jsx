import { createContext, useEffect, useState } from "react";

// 1️⃣ Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 👈 usuario logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔄 Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // 🔐 Login: guarda usuario en estado y localStorage
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 🔓 Logout: limpiar todo
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
