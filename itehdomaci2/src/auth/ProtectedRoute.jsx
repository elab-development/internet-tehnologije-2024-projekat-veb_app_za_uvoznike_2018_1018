import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}
