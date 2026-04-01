import React, { useEffect, useState } from "react";
import { getSuppliersByImporter } from "../api";
import { useAuth } from "../auth/AuthContext";
import DataTable from "../components/DataTable";
import Button from "../components/ui/Button";

export default function ImporterSuppliersPage() {
  const { user, logout } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setErr("");

    try {
      const res = await getSuppliersByImporter(user.id);
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setErr(e?.message || "Greška pri učitavanju dobavljača.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const columns = [
    { key: "name", header: "Naziv" },
    { key: "email", header: "Email" },
    { key: "company_name", header: "Kompanija" },
    { key: "contact_person", header: "Kontakt osoba" },
    { key: "phone", header: "Telefon" },
    { key: "address", header: "Adresa" },
    { key: "country", header: "Država" },
  ];

  return (
    <div className="page">
      <header className="topbar">
        <h1>Moji dobavljači</h1>
        <div className="topbar-right">
          <span className="muted">
            Prijavljen: {user?.name || user?.email}
          </span>
          <Button variant="ghost" onClick={logout}>
            Odjava
          </Button>
        </div>
      </header>

      {loading ? (
        <p>Učitavanje...</p>
      ) : err ? (
        <p className="error-block">{err}</p>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          emptyText="Nema povezanih dobavljača."
        />
      )}
    </div>
  );
}