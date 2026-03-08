import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/ui/Button";

export default function ImporterDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <header className="topbar">
        <h1>Importer Dashboard</h1>
        <div className="topbar-right">
          <span className="muted">Prijavljen: {user?.name || user?.email}</span>
          <Button variant="ghost" onClick={logout}>
            Odjava
          </Button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Proizvodi dobavljača</h2>
          <p>
            Pregledaj proizvode dobavljača sa kojima tvoja firma sarađuje,
            filtriraj ih i uporedi ponude.
          </p>
          <Link to="/products" className="dashboard-link">
            Idi na proizvode
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Kontejneri</h2>
          <p>
            Kreiraj i upravljaj kontejnerima za uvoz robe i prati njihove troškove.
          </p>
          <Link to="/containers" className="dashboard-link">
            Idi na kontejnere
          </Link>
        </div>
 

        <div className="dashboard-card">
          <h2>Moj nalog</h2>
          <p>
            Ulogovan si kao <b>importer</b>.
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