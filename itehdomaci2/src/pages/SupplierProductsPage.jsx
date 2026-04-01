import React, { useEffect, useMemo, useState } from "react";
import {
  listProducts,
  createProductWithImage,
  updateProductWithImage,
  deleteProduct,
} from "../api";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import DataTable from "../components/DataTable";

const emptyForm = {
  code: "",
  name: "",
  dimensions: "",
  features: "",
  price: "",
  category: "",
  image: null,
};

const IMAGE_BASE = "http://127.0.0.1:8000/storage/";

export default function SupplierProductsPage() {
  const { user, logout } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await listProducts();
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setErr(e?.message || "Greška pri učitavanju proizvoda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.category).filter(Boolean)));
  }, [rows]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    return rows.filter((r) => {
      const hitQ =
        !s ||
        [r.code, r.name, r.category, r.dimensions]
          .some((v) => String(v || "").toLowerCase().includes(s));

      const hitCategory = !category || r.category === category;

      return hitQ && hitCategory;
    });
  }, [rows, q, category]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const onNew = () => {
    resetForm();
    setOpen(true);
  };

  const onEdit = (row) => {
    setEditId(row.id);
    setForm({
      code: row.code || "",
      name: row.name || "",
      dimensions: row.dimensions || "",
      features: row.features || "",
      price: row.price || "",
      category: row.category || "",
      image: null,
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati proizvod?")) return;

    try {
      await deleteProduct(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      window.alert(e?.message || "Greška pri brisanju proizvoda.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("code", form.code);
      fd.append("name", form.name);
      fd.append("dimensions", form.dimensions || "");
      fd.append("features", form.features || "");
      fd.append("price", form.price);
      fd.append("category", form.category || "");

      if (form.image) {
        fd.append("image", form.image);
      }

      let res;
      if (editId) {
        res = await updateProductWithImage(editId, fd);
        setRows((prev) =>
          prev.map((x) => (x.id === editId ? res.data : x))
        );
      } else {
        res = await createProductWithImage(fd);
        setRows((prev) => [res.data, ...prev]);
      }

      setOpen(false);
      resetForm();
    } catch (e) {
      window.alert(
        e?.message ||
        JSON.stringify(e?.errors || "Greška pri čuvanju proizvoda.")
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "image",
      header: "Slika",
      render: (r) =>
        r.image_path ? (
          <img
            src={`${IMAGE_BASE}${r.image_path}`}
            alt={r.name}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #333",
            }}
          />
        ) : (
          <span className="muted">Nema slike</span>
        ),
    },
    { key: "code", header: "Šifra" },
    { key: "name", header: "Naziv" },
    { key: "category", header: "Kategorija" },
    { key: "price", header: "Cena (EUR)" },
    { key: "dimensions", header: "Dimenzije" },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="row-actions">
          <Button variant="ghost" onClick={() => onEdit(r)}>
            Izmeni
          </Button>
          <Button variant="danger" onClick={() => onDelete(r.id)}>
            Obriši
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <header className="topbar">
        <h1>Moji proizvodi</h1> 
      </header>

      <div className="searchbar">
        <input
          placeholder="Pretraga po šifri, nazivu, kategoriji..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Sve kategorije</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <Button
          variant="ghost"
          onClick={() => {
            setQ("");
            setCategory("");
          }}
        >
          Reset
        </Button>

        <Button onClick={onNew}>+ Novi proizvod</Button>
      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : err ? (
        <p className="error-block">{err}</p>
      ) : (
        <DataTable columns={columns} rows={filtered} emptyText="Nema proizvoda" />
      )}

      <Modal
        open={open}
        title={editId ? "Izmena proizvoda" : "Novi proizvod"}
        onClose={() => setOpen(false)}
      >
        <form className="form-grid" onSubmit={submit}>
          <Input
            label="Šifra"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            required
          />

          <Input
            label="Naziv"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />

          <Input
            label="Dimenzije"
            value={form.dimensions}
            onChange={(e) =>
              setForm((f) => ({ ...f, dimensions: e.target.value }))
            }
          />

          <Input
            label="Karakteristike"
            value={form.features}
            onChange={(e) =>
              setForm((f) => ({ ...f, features: e.target.value }))
            }
          />

          <Input
            label="Cena"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />

          <Input
            label="Kategorija"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          />

          <label className="input">
            <span>Slika proizvoda</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  image: e.target.files?.[0] || null,
                }))
              }
            />
          </label>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Otkaži
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Čuvam..." : "Sačuvaj"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}