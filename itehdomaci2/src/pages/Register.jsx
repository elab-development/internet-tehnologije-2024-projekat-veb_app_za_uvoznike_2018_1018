// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { registerApi } from "../api";
import { useAuth } from "../auth/AuthContext";

const initial = {
  name: "",
  email: "",
  password: "",
  role: "importer",              // imamo jednu ulogu
  company_name: "",
  contact_person: "",
  phone: "",
  address: "",
  country: "",
};

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      // 1) registracija na backendu
      await registerApi(form);
      // 2) auto-login posle registracije
      await login({ email: form.email, password: form.password });
      navigate("/containers", { replace: true });
    } catch (e) {
      setErr(e?.errors || e?.message || "Greška pri registraciji");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Registracija (Importer)</h1>
      <form onSubmit={onSubmit}>
        <Input label="Ime i prezime" value={form.name} onChange={set("name")} required />
        <Input label="Email" type="email" value={form.email} onChange={set("email")} required />
        <Input label="Lozinka" type="password" value={form.password} onChange={set("password")} required />

        {/* fiksirana uloga, može i hidden field — ovde samo read-only prikaz */}
        <label className="input">
          <span>Uloga</span>
          <input value="importer" readOnly />
        </label>

        <Input label="Kompanija" value={form.company_name} onChange={set("company_name")} />
        <Input label="Kontakt osoba" value={form.contact_person} onChange={set("contact_person")} />
        <Input label="Telefon" value={form.phone} onChange={set("phone")} />
        <Input label="Adresa" value={form.address} onChange={set("address")} />
        <Input label="Država" value={form.country} onChange={set("country")} />

        {err && <p className="error-block">{typeof err === "string" ? err : JSON.stringify(err)}</p>}
        <Button disabled={busy} type="submit">{busy ? "Kreiram nalog..." : "Registruj se"}</Button>
      </form>

      <p className="muted" style={{marginTop:12}}>
        Već imaš nalog? <Link to="/">Prijava</Link>
      </p>
    </div>
  );
}
