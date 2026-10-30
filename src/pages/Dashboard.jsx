import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try { const res = await api.get("/cvs"); setCvs(res.data.data.cvs); }
    catch (err) { setError(err.response?.data?.message || "Could not load CVs."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  async function removeCV(id) {
    if (!window.confirm("Delete this CV permanently?")) return;
    try { await api.delete(`/cvs/${id}`); setCvs(old => old.filter(cv => cv._id !== id)); }
    catch (err) { setError(err.response?.data?.message || "Could not delete CV."); }
  }
  function signOut() { logout(); navigate("/login"); }
  return <main className="page">
    <header className="topbar"><Link className="brand" to="/dashboard">CV<span>Forge</span></Link><div className="top-actions"><span className="muted">{user?.name}</span><button className="secondary small" onClick={signOut}>Log out</button></div></header>
    <section className="hero"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>Build your next opportunity.</h1><p className="muted">Create, improve, and manage your professional CVs in one place.</p></div><Link className="button-link" to="/create-cv">＋ Create new CV</Link></section>
    {error && <p className="error">{error}</p>}
    <section className="panel"><div className="section-head"><h2>Your CVs</h2><span className="count">{cvs.length} saved</span></div>
      {loading ? <p className="muted">Loading CVs…</p> : cvs.length === 0 ? <div className="empty"><h3>Your first CV starts here</h3><p className="muted">Add your details and let AI help polish your wording.</p><Link className="button-link" to="/create-cv">Create your first CV</Link></div> :
      <div className="cv-list">{cvs.map(cv => <article className="cv-row" key={cv._id}><div className="document-icon">CV</div><div className="cv-info"><h3>{cv.title}</h3><p className="muted">{cv.personalInfo?.jobTitle || "Professional CV"} · Updated {new Date(cv.updatedAt).toLocaleDateString()}</p><span className="tag">{cv.template}</span>{cv.generatedByAI && <span className="tag ai-tag">AI generated</span>}</div><div className="row-actions"><Link className="button-link secondary-link" to={`/cvs/${cv._id}`}>Open / Edit</Link><button className="danger small" onClick={() => removeCV(cv._id)}>Delete</button></div></article>)}</div>}
    </section>
    <p className="footer-note">Review AI-written content carefully before sending your CV to employers.</p>
  </main>;
}
