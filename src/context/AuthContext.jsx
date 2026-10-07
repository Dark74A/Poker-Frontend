import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem("ledger_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const setSession = useCallback(({ token, userId, username }) => {
    localStorage.setItem("ledger_token", token);
    localStorage.setItem("ledger_user", JSON.stringify({ userId, username }));
    setUser({ userId, username });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ledger_token");
    localStorage.removeItem("ledger_user");
    setUser(null);
  }, []);

  const value = { user, isAuthenticated: Boolean(user), setSession, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
