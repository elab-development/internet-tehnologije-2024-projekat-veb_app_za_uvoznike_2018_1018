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

  useEffect(() => {
    setAuthToken(token || null);
  }, [token]);

  const login = async ({ email, password }) => {
    let res;

    try {
      res = await loginApi(email, password);
    } catch (e) {
      const msg = e?.errors || e?.message || "Neuspešna prijava";
      throw typeof msg === "string" ? new Error(msg) : msg;
    }

    if (!res || !res.token) {
      throw new Error("Login failed: server nije vratio token.");
    }

    const { token: tk, user: usr } = res;

    setUser(usr);
    setToken(tk);

    localStorage.setItem("auth:user", JSON.stringify(usr));
    localStorage.setItem("auth:token", tk);

    return usr;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {}

    setUser(null);
    setToken(null);
    localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:token");
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuth: !!token, login, logout }),
    [user, token]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}