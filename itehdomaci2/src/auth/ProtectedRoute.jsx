import React from "react";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  if (!isAuth) {
    return (
      <div className="guard">
        <h2>Niste prijavljeni</h2>
        <p>Prijavite se da nastavite.</p>
        <a className="btn" href="/">Idi na login</a>
      </div>
    );
  }
  return children;
}
