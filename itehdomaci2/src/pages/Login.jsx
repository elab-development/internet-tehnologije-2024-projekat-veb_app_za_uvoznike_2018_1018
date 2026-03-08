import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/containers";

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (location.state?.emailPrefill) {
      setEmail(location.state.emailPrefill);
    }

    if (location.state?.justRegistered) {
      setInfo("Registracija uspešna — sada se prijavi.");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setErr("");
    setInfo("");
    setBusy(true);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (e) {
      const msg =
        e?.message ||
        JSON.stringify(e?.errors) ||
        "Greška pri prijavi.";

      setErr(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Prijava</h1>

      {info && (
        <p
          className="error-block"
          style={{
            background: "#1d2b1d",
            borderColor: "#224a22",
            color: "#b3ffb3",
          }}
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

        <Button type="submit" disabled={busy}>
          {busy ? "Prijavljivanje..." : "Prijavi se"}
        </Button>
      </form>
    </div>
  );
}