import React, { useEffect, useState } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "../api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import DataTable from "../components/DataTable";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "supplier",
};

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await listUsers();
      setRows(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju korisnika:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: "name", header: "Ime" },
    { key: "email", header: "Email" },
    { key: "role", header: "Uloga" },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="row-actions">
          <Button onClick={() => onEdit(r)}>Izmeni</Button>
          <Button variant="danger" onClick={() => onDelete(r.id)}>Obriši</Button>
        </div>
      ),
    },
  ];

  const onEdit = (r) => {
    setEditId(r.id);
    setForm({
      name: r.name || "",
      email: r.email || "",
      password: "",
      role: r.role || "supplier",
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati korisnika?")) return;

    try {
      await deleteUser(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Greška pri brisanju:", err);
    }
  };

  const onNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        const res = await updateUser(editId, form);
        setRows((prev) =>
          prev.map((x) => (x.id === editId ? res.data : x))
        );
      } else {
        const res = await createUser(form);
        setRows((prev) => [res.data, ...prev]);
      }

      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
    } catch (err) {
      console.error("Greška pri čuvanju:", err);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>Upravljanje korisnicima</h1>
        <Button onClick={onNew}>+ Novi korisnik</Button>
      </header>

      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      <Modal open={open} title="Korisnik" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="form-grid">
          <Input
            label="Ime"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />

          <Input
            label="Lozinka"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />

          <label className="input">
            <span>Uloga</span>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="admin">admin</option>
              <option value="supplier">supplier</option>
              <option value="importer">importer</option>
            </select>
          </label>

          <Button type="submit">Sačuvaj</Button>
        </form>
      </Modal>
    </div>
  );
}