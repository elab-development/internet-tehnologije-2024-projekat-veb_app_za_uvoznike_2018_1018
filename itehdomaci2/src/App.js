import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContainersPage from "./pages/Containers";
import ProductsPage from "./pages/Products";  
import "./App.css";
import AdminUsers from "./pages/AdminUsers";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/containers"
          element={
            <ProtectedRoute>
              <ContainersPage />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
        <Route path="*" element={<div style={{ padding: 16 }}>404 – Page not found</div>} />
      </Routes>
    </AuthProvider>
  );
}
