import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await login(email, password); navigate("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Could not sign in. Check the server."); }
    finally { setBusy(false); }
  }
  return <main className="auth-wrap"><form className="panel auth-panel" onSubmit={submit}>
    <div className="eyebrow">AI CV BUILDER</div><h1>Welcome back</h1><p className="muted">Sign in to manage your CVs.</p>
    {error && <p className="error">{error}</p>}
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" /></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></label>
    <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    <p className="muted">No account? <Link to="/register">Create one</Link></p>
  </form></main>;
}
