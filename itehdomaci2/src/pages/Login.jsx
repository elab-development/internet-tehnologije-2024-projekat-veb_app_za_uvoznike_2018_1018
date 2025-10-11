import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/containers";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [info, setInfo] = useState(null); // info poruka (npr. posle registracije)
  const [busy, setBusy] = useState(false);

  // Ako dolazimo sa registracije, popuni email i prikaži info
  useEffect(() => {
    if (location.state?.emailPrefill) setEmail(location.state.emailPrefill);
    if (location.state?.justRegistered) {
      setInfo("Registracija uspešna — sada se prijavi.");
      // opciono: očisti state da se ne zadržava pri refresh-u
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setBusy(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (e) {
      const msg = e?.message || e?.errors || "Greška pri prijavi";
      setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Prijava (Importer)</h1>

      {info && (
        <p
          className="error-block"
          style={{ background: "#1d2b1d", borderColor: "#224a22", color: "#b3ffb3" }}
        >
          {info}
        </p>
      )}

      {err && <p className="error-block">{err}</p>}

      <form onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Lozinka"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button disabled={busy} type="submit">
          {busy ? "Prijavljivanje..." : "Prijavi se"}
        </Button>
      </form>
    </div>
  );
}
