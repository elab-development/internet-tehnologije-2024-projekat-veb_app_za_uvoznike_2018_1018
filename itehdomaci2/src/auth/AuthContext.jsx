import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, logoutApi, setAuthToken } from "../api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("auth:user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth:token"));

  useEffect(() => setAuthToken(token || null), [token]);

  const login = async ({ email, password }) => {
    const { token, user } = await loginApi(email, password);
    setUser(user);
    setToken(token);
    localStorage.setItem("auth:user", JSON.stringify(user));
    localStorage.setItem("auth:token", token);
  };

  const logout = async () => {
    try { await logoutApi(); } catch {}
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:token");
  };

  const value = useMemo(() => ({ user, token, isAuth: !!token, login, logout }), [user, token]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
