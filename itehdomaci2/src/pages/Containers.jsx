import React, { useEffect, useMemo, useState } from "react";
import { createContainer, deleteContainer, listContainers, updateContainer } from "../api";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";

const emptyForm = {
  name: "",
  max_capacity: "",
  max_dimensions: "",
  total_import_cost: "",
  status: "pending",
};

export default function ContainersPage() {
  const { user, logout } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // search/filter
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await listContainers();
      setRows(Array.isArray(data) ? data : data?.data || []);
    } catch (e) {
      setErr(e?.errors || e?.message || "Greška pri učitavanju");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const hitQ =
        !q ||
        [r.name, r.max_dimensions].some((v) =>
          String(v || "").toLowerCase().includes(q)
        );
      const hitS = !status || r.status === status;
      return hitQ && hitS;
    });
  }, [rows, query, status]);

  const columns = [
    { key: "name", header: "Naziv" },
    { key: "max_capacity", header: "Kapacitet" },
    { key: "max_dimensions", header: "Dimenzije" },
    { key: "total_import_cost", header: "Trošak (EUR)" },
    { key: "status", header: "Status" },
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

  const onEdit = (r) => {
    setEditId(r.id);
    setForm({
      name: r.name ?? "",
      max_capacity: r.max_capacity ?? "",
      max_dimensions: r.max_dimensions ?? "",
      total_import_cost: r.total_import_cost ?? "",
      status: r.status ?? "pending",
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati kontejner?")) return;
    try {
      await deleteContainer(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      window.alert(
        typeof e === "string"
          ? e
          : JSON.stringify(e?.errors || e?.message || "Greška pri brisanju")
      );
    }
  };

  const onNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        max_capacity:
          form.max_capacity === "" ? null : parseFloat(form.max_capacity),
        total_import_cost:
          form.total_import_cost === "" ? null : parseFloat(form.total_import_cost),
      };

      if (editId) {
        const { data } = await updateContainer(editId, payload);
        setRows((prev) => prev.map((x) => (x.id === editId ? data : x)));
      } else {
        const { data } = await createContainer(payload);
        setRows((prev) => [data, ...prev]);
      }
      setOpen(false);
    } catch (e) {
      window.alert(
        typeof e === "string"
          ? e
          : JSON.stringify(e?.errors || e?.message || "Greška pri čuvanju")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>Containers</h1>
        <div className="topbar-right">
          <span className="muted">Prijavljen: {user?.name || user?.email}</span>
          <Button variant="ghost" onClick={logout}>
            Odjava
          </Button>
        </div>
      </header>

      <SearchBar
        query={query}
        onQuery={setQuery}
        status={status}
        onStatus={setStatus}
        onReset={() => {
          setQuery("");
          setStatus("");
        }}
        extra={<Button onClick={onNew}>+ Novi kontejner</Button>}
      />

      {loading ? (
        <p>Učitavanje...</p>
      ) : err ? (
        <p className="error-block">{String(err)}</p>
      ) : (
        <DataTable columns={columns} rows={filtered} />
      )}

      <Modal
        open={open}
        title={editId ? "Izmena kontejnera" : "Novi kontejner"}
        onClose={() => setOpen(false)}
      >
        <form className="form-grid" onSubmit={submit}>
          <Input
            label="Naziv"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Max kapacitet"
            type="number"
            value={form.max_capacity}
            onChange={(e) =>
              setForm((f) => ({ ...f, max_capacity: e.target.value }))
            }
            required
          />
          <Input
            label="Dimenzije"
            value={form.max_dimensions}
            onChange={(e) =>
              setForm((f) => ({ ...f, max_dimensions: e.target.value }))
            }
            required
          />
          <Input
            label="Ukupan trošak (EUR)"
            type="number"
            value={form.total_import_cost}
            onChange={(e) =>
              setForm((f) => ({ ...f, total_import_cost: e.target.value }))
            }
            required
          />
          <label className="input">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
              required
            >
              <option value="pending">pending</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
            </select>
          </label>
          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
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
