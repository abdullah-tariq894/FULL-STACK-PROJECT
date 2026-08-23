import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // modalMode: null | "signup" | "login"
  const [modalMode, setModalMode] = useState(null);

  const openSignup = () => setModalMode("signup");
  const openLogin = () => setModalMode("login");
  const closeModal = () => setModalMode(null);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, modalMode, openSignup, openLogin, closeModal, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
