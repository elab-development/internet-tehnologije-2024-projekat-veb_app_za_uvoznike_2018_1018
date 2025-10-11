import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

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
        <Link className="brand" to={isAuth ? "/containers" : "/"}>Importer App</Link>

        {isAuth && (
          <>
            <NavLink
              to="/containers"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Containers
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Products
            </NavLink>
          
          </>
        )}
      </div>

      <div className="nav-right">
        {isAuth ? (
          <>
            <span className="nav-user">👤 {user?.name || user?.email}</span>
            <Button variant="ghost" onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Link className="btn" to="/">Login</Link>
            <Link className="btn ghost" to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
