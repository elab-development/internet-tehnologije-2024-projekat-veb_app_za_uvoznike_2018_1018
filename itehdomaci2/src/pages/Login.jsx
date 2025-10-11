import React, { useState } from "react";
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
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setErr(e?.errors || e?.message || "Greška pri prijavi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Prijava (Importer)</h1>
      <form onSubmit={onSubmit}>
        <Input label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Input label="Lozinka" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {err && <p className="error-block">{typeof err === "string" ? err : JSON.stringify(err)}</p>}
        <Button disabled={busy} type="submit">{busy ? "Prijavljivanje..." : "Prijavi se"}</Button>
      </form>
    </div>
  );
}
