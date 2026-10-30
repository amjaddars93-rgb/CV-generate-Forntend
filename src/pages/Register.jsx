import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await register(name, email, password); navigate("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Could not create account."); }
    finally { setBusy(false); }
  }
  return <main className="auth-wrap"><form className="panel auth-panel" onSubmit={submit}>
    <div className="eyebrow">AI CV BUILDER</div><h1>Create your account</h1><p className="muted">Start building a professional CV.</p>
    {error && <p className="error">{error}</p>}
    <label>Full name<input value={name} onChange={e=>setName(e.target.value)} minLength="2" maxLength="80" required autoComplete="name" /></label>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" /></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength="8" maxLength="128" required autoComplete="new-password" /><small>Use at least 8 characters.</small></label>
    <button disabled={busy}>{busy ? "Creating account…" : "Register"}</button>
    <p className="muted">Already registered? <Link to="/login">Sign in</Link></p>
  </form></main>;
}
