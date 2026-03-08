import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  listSupplierImporters,
  createSupplierImporter,
  deleteSupplierImporter,
  listUsers,
} from "../api";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import DataTable from "../components/DataTable";

const emptyForm = {
  supplier_id: "",
  importer_id: "",
};

export default function AdminRelationships() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const fetchedRef = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);

    try {
      const relRes = await listSupplierImporters();
      setRows(Array.isArray(relRes?.data) ? relRes.data : []);
    } catch (e) {
      console.log("supplier-importers error", e);
    }

    try {
      const usersRes = await listUsers();
      setUsers(Array.isArray(usersRes?.data) ? usersRes.data : []);
    } catch (e) {
      console.log("users error", e);
      setErr(e?.message || "Greška pri učitavanju podataka");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchData();
  }, []);

  const suppliers = useMemo(
    () => users.filter((u) => u.role === "supplier"),
    [users]
  );

  const importers = useMemo(
    () => users.filter((u) => u.role === "importer"),
    [users]
  );

  const exportToExcel = () => {
    const exportData = rows.map((r) => ({
      "Supplier ID": r.supplier?.id || "",
      Supplier: r.supplier?.name || "",
      "Supplier Email": r.supplier?.email || "",
      "Supplier Company": r.supplier?.company_name || "",
      "Importer ID": r.importer?.id || "",
      Importer: r.importer?.name || "",
      "Importer Email": r.importer?.email || "",
      "Importer Company": r.importer?.company_name || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Relationships");
    XLSX.writeFile(workbook, "supplier_importer_relationships.xlsx");
  };

  const columns = [
    {
      key: "supplier",
      header: "Supplier",
      render: (r) => (
        <div>
          <div><b>{r.supplier?.name || "—"}</b></div>
          <div className="muted">{r.supplier?.email || "—"}</div>
          <div className="muted">{r.supplier?.company_name || "—"}</div>
        </div>
      ),
    },
    {
      key: "importer",
      header: "Importer",
      render: (r) => (
        <div>
          <div><b>{r.importer?.name || "—"}</b></div>
          <div className="muted">{r.importer?.email || "—"}</div>
          <div className="muted">{r.importer?.company_name || "—"}</div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button variant="danger" onClick={() => onDelete(r.id)}>
          Obriši
        </Button>
      ),
    },
  ];

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati ovu vezu?")) return;

    try {
      await deleteSupplierImporter(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      window.alert(
        e?.response?.data?.message ||
          JSON.stringify(
            e?.response?.data?.errors || e?.message || "Greška pri brisanju"
          )
      );
    }
  };

  const onNew = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        supplier_id: Number(form.supplier_id),
        importer_id: Number(form.importer_id),
      };

      const res = await createSupplierImporter(payload);
      setRows((prev) => [res.data, ...prev]);
      setOpen(false);
      setForm(emptyForm);
    } catch (e) {
      window.alert(e?.message || "Greška pri čuvanju");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>Povezivanje supplier i importer firmi</h1>
        <div className="topbar-right">
          <Button variant="ghost" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button onClick={onNew}>+ Nova veza</Button>
        </div>
      </header>

      {loading ? (
        <p>Učitavanje...</p>
      ) : err ? (
        <p className="error-block">{String(err)}</p>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          emptyText="Nema definisanih veza"
        />
      )}

      <Modal
        open={open}
        title="Nova supplier-importer veza"
        onClose={() => setOpen(false)}
      >
        <form className="form-grid" onSubmit={submit}>
          <label className="input">
            <span>Supplier</span>
            <select
              value={form.supplier_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplier_id: e.target.value }))
              }
              required
            >
              <option value="">Izaberi supplier-a</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.company_name ? `- ${s.company_name}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="input">
            <span>Importer</span>
            <select
              value={form.importer_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, importer_id: e.target.value }))
              }
              required
            >
              <option value="">Izaberi importer-a</option>
              {importers.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} {i.company_name ? `- ${i.company_name}` : ""}
                </option>
              ))}
            </select>
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