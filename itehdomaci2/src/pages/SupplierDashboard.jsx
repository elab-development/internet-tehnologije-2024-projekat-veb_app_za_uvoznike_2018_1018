import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/ui/Button";

export default function SupplierDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <header className="topbar">
        <h1>Supplier Dashboard</h1>
        <div className="topbar-right">
          <span className="muted">Prijavljen: {user?.name || user?.email}</span>
          <Button variant="ghost" onClick={logout}>
            Odjava
          </Button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Moji proizvodi</h2>
          <p>
            Dodaj, izmeni ili obriši proizvode koje nudiš uvoznicima.
          </p>
          <Link to="/supplier/products" className="dashboard-link">
            Upravljaj proizvodima
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Moji partneri</h2>
          <p>
            Pregledaj uvoznike koji mogu da naručuju tvoje proizvode.
          </p>
          <Link to="/supplier/importers" className="dashboard-link">
            Prikaži partnere
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Moj nalog</h2>
          <p>
            Ulogovan si kao <b>supplier</b>.
          </p>
          <p>
            Firma: <b>{user?.company_name || "Nije uneto"}</b>
          </p>
          <p>
            Kontakt: <b>{user?.email || "Nije uneto"}</b>
          </p>
        </div>
      </div>
    </div>
  );
}