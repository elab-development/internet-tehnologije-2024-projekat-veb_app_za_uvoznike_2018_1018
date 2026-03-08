import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  const getHomeRoute = () => {
    if (role === "admin") return "/admin/users";
    if (role === "supplier") return "/supplier/dashboard";
    if (role === "importer") return "/importer/dashboard";
    return "/";
  };

  const onLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link className="brand" to={isAuth ? getHomeRoute() : "/"}>
          Importer App
        </Link>

        {isAuth && role === "admin" && (
          <>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Korisnici
            </NavLink>

            <NavLink
              to="/admin/relationships"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Relacije
            </NavLink>
          </>
        )}

        {isAuth && role === "supplier" && (
          <>
            <NavLink
              to="/supplier/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/supplier/products"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Moji proizvodi
            </NavLink>

            <NavLink
              to="/supplier/importers"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Partneri
            </NavLink>
          </>
        )}

        {isAuth && role === "importer" && (
          <>
            <NavLink
              to="/importer/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Proizvodi
            </NavLink>

            <NavLink
              to="/containers"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Kontejneri
            </NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        {isAuth ? (
          <>
            <span className="nav-user">
              {user?.name || user?.email} ({user?.role})
            </span>
            <Button variant="ghost" onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Link className="btn" to="/">
              Login
            </Link>
            <Link className="btn ghost" to="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}