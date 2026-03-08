import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { registerApi } from "../api";

const initial = {
  name: "Test User",
  email: "test" + Date.now() + "@mail.com",
  password: "password123",
  role: "importer",
  company_name: "Test Company",
  contact_person: "Test Contact",
  phone: "+381600000000",
  address: "Test Address 1",
  country: "Serbia",
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const totalSteps = 2;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const list = data
          .map((c) => c?.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setCountries(list);
      })
      .catch(() => setCountries([]));
  }, []);

  const validStep1 = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    return form.name.trim().length > 0 && emailOk && form.password.length >= 8;
  }, [form.name, form.email, form.password]);

  const progressPct = Math.round((step / totalSteps) * 100);

  const goNext = () => {
    if (step === 1 && !validStep1) {
      setErr("Popuni ime, validan email i lozinku (min 8 karaktera).");
      return;
    }
    setErr(null);
    setStep(2);
  };

  const goBack = () => {
    setErr(null);
    setStep(1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      return goNext();
    }

    setErr(null);
    setBusy(true);

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        role: "importer",
      };

      await registerApi(payload);

      navigate("/", {
        replace: true,
        state: { justRegistered: true, emailPrefill: form.email },
      });
    } catch (e) {
      setErr(e?.errors || e?.message || "Greška pri registraciji");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="stepper-head">
        <h1>Registracija (Importer)</h1>

        <div className="stepper">
          <div className="stepper-track" aria-hidden="true">
            <div className="stepper-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="stepper-dots" role="list" aria-label="Koraci registracije">
            <span role="listitem" className={`dot ${step >= 1 ? "active" : ""}`}>
              1
            </span>
            <span role="listitem" className={`dot ${step >= 2 ? "active" : ""}`}>
              2
            </span>
          </div>

          <div className="stepper-label">
            {step === 1 ? "Korak 1/2 — Osnovni podaci" : "Korak 2/2 — Podaci o kompaniji"}
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          if (step === 1 && e.key === "Enter") e.preventDefault();
        }}
      >
        {step === 1 && (
          <>
            <Input
              label="Ime i prezime"
              value={form.name}
              onChange={set("name")}
              required
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              required
            />

            <Input
              label="Lozinka (min 8)"
              type="password"
              value={form.password}
              onChange={set("password")}
              required
            />

            <label className="input">
              <span>Uloga</span>
              <input value="importer" readOnly />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="Kompanija"
              value={form.company_name}
              onChange={set("company_name")}
            />

            <Input
              label="Kontakt osoba"
              value={form.contact_person}
              onChange={set("contact_person")}
            />

            <Input
              label="Telefon"
              value={form.phone}
              onChange={set("phone")}
            />

            <Input
              label="Adresa"
              value={form.address}
              onChange={set("address")}
            />

            <label className="input">
              <span>Država</span>
              <select value={form.country} onChange={set("country")}>
                <option value="">Izaberi državu</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {err && (
          <p className="error-block">
            {typeof err === "string" ? err : JSON.stringify(err)}
          </p>
        )}

        <div className="form-actions" style={{ marginTop: 6 }}>
          {step > 1 && (
            <Button type="button" variant="ghost" onClick={goBack}>
              Nazad
            </Button>
          )}

          {step < totalSteps ? (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                goNext();
              }}
              disabled={!validStep1}
            >
              Dalje
            </Button>
          ) : (
            <Button type="submit" disabled={busy}>
              {busy ? "Kreiram nalog..." : "Završi registraciju"}
            </Button>
          )}
        </div>
      </form>

      <p className="muted" style={{ marginTop: 12 }}>
        Već imaš nalog? <Link to="/">Prijava</Link>
      </p>
    </div>
  );
}