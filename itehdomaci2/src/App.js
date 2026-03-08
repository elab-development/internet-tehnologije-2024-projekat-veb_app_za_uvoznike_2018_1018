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
import AdminRelationships from "./pages/AdminRelationships";
import ImporterDashboard from "./pages/ImporterDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierProductsPage from "./pages/SupplierProductsPage";
import SupplierImportersPage from "./pages/SupplierImportersPage";

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
      <Route
        path="/admin/relationships"
        element={
          <ProtectedRoute>
            <AdminRelationships />
          </ProtectedRoute>
        }
      />

      <Route
        path="/importer/dashboard"
        element={
          <ProtectedRoute>
            <ImporterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supplier/dashboard"
        element={
          <ProtectedRoute>
            <SupplierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier/products"
        element={
          <ProtectedRoute>
            <SupplierProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier/importers"
        element={
          <ProtectedRoute>
            <SupplierImportersPage />
          </ProtectedRoute>
        }
      />
        <Route path="*" element={<div style={{ padding: 16 }}>404 – Page not found</div>} />
      </Routes>
    </AuthProvider>
  );
}
