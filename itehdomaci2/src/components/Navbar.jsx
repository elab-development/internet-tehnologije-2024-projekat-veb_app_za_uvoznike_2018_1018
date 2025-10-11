
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await logout();              // poziva backend /auth/logout iz AuthContext-a
      navigate("/", { replace: true });
    } catch (e) {
      // opciono: pokaži poruku
      console.error(e);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link className="brand" to={isAuth ? "/containers" : "/"}>Importer App</Link>
        {isAuth && (
          <>
            <Link className="nav-link" to="/containers">Containers</Link>
            {/* po potrebi dodaj još linkova: Products, Offers... */}
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
          <Link className="btn" to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}
