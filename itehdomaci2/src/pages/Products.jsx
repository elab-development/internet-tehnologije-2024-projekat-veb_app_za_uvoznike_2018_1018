import React, { useEffect, useMemo, useState } from "react";
import { listProducts } from "../api";
import { useAuth } from "../auth/AuthContext";
import DataTable from "../components/DataTable";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function ProductsPage() {
  const { user, logout } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // filteri
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // show/hide supplier detalja po ID-u proizvoda
  const [openRows, setOpenRows] = useState(() => new Set());
  const toggleRow = (id) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listProducts(); // {message, data:[...]}
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setRows(data);
    } catch (e) {
      setErr(e?.errors || e?.message || "Greška pri učitavanju proizvoda");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      const hitQ = !s || [r.name, r.code, r.dimensions, r.category]
        .some(v => String(v || "").toLowerCase().includes(s));
      const hitCat = !category || r.category === category;
      const hitMin = !priceMin || Number(r.price) >= Number(priceMin);
      const hitMax = !priceMax || Number(r.price) <= Number(priceMax);
      return hitQ && hitCat && hitMin && hitMax;
    });
  }, [rows, q, category, priceMin, priceMax]);

  const categories = useMemo(() => {
    const set = new Set(rows.map(r => r.category).filter(Boolean));
    return Array.from(set);
  }, [rows]);

  const resetFilters = () => {
    setQ(""); setCategory(""); setPriceMin(""); setPriceMax("");
  };

  const columns = [
    { key: "code", header: "Šifra" },
    { key: "name", header: "Naziv" },
    { key: "category", header: "Kategorija" },
    { key: "price", header: "Cena (EUR)" },
    { key: "dimensions", header: "Dimenzije" },
    {
      key: "actions",
      header: "Dobavljač",
      render: (r) => {
        const isOpen = openRows.has(r.id);
        const s = r.supplier || null; // backend šalje supplier objekat
        return (
          <div>
            <Button variant="ghost" onClick={() => toggleRow(r.id)}>
              {isOpen ? "Sakrij" : "Prikaži"}
            </Button>

            {isOpen && (
              <div className="supplier-inline-card">
                {s ? (
                  <div className="supplier-inline-grid">
                    <div><b>Naziv:</b> {s.name ?? "—"}</div>
                    <div><b>Email:</b> {s.email ?? "—"}</div>
                    <div><b>Kompanija:</b> {s.company_name ?? "—"}</div>
                    <div><b>Kontakt osoba:</b> {s.contact_person ?? "—"}</div>
                    <div><b>Telefon:</b> {s.phone ?? "—"}</div>
                    <div><b>Adresa:</b> {s.address ?? "—"}</div>
                    <div><b>Država:</b> {s.country ?? "—"}</div>
                    {"id" in s && <div><b>ID:</b> {s.id}</div>}
                  </div>
                ) : (
                  <div className="muted">Nema detalja dobavljača (supplier je null). ID: {r.supplier_id ?? "—"}</div>
                )}
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="page">
      <header className="topbar">
        <h1>Proizvodi (svi dobavljači)</h1>
        <div className="topbar-right">
          <span className="muted">Prijavljen: {user?.name || user?.email}</span>
          <Button variant="ghost" onClick={logout}>Odjava</Button>
        </div>
      </header>

      {/* filter traka */}
      <div className="searchbar">
        <input
          placeholder="Pretraga (naziv, šifra, dimenzije, kategorija...)"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">Sve kategorije</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Input label="Cena od" type="number" value={priceMin} onChange={(e)=>setPriceMin(e.target.value)} />
        <Input label="Cena do" type="number" value={priceMax} onChange={(e)=>setPriceMax(e.target.value)} />
        <Button variant="ghost" onClick={resetFilters}>Reset</Button>
      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : err ? (
        <p className="error-block">{String(err)}</p>
      ) : (
        <DataTable columns={columns} rows={filtered} emptyText="Nema proizvoda" />
      )}
    </div>
  );
}
