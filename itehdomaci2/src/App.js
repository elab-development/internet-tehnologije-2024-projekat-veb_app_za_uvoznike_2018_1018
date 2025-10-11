import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import ContainersPage from "./pages/Containers";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/containers"
          element={
            <ProtectedRoute>
              <ContainersPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div style={{padding:16}}>404 – Page not found</div>} />
      </Routes>
    </AuthProvider>
  );
}
