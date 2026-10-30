import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import CVForm from "../components/CVForm";
import { SAMPLE_CV, blankCV, normalizeCV, toPayload } from "../utils/cv";

export default function CreateCV() {
  const [cv, setCv] = useState(blankCV);
  const [formKey, setFormKey] = useState(0); // changing the key re-creates the form (used by the sample button)
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function loadSample() {
    if (!window.confirm("Replace the form with sample data?")) return;
    setCv(normalizeCV(SAMPLE_CV));
    setFormKey((k) => k + 1);
  }
  async function save() {
    setError("");
    if (!cv.title.trim()) return setError("Please enter a CV title.");
    try { setBusy(true); const res = await api.post("/cvs", toPayload(cv)); navigate(`/cvs/${res.data.data.cv._id}`); }
    catch (err) { setError(err.response?.data?.message || "Could not save CV."); }
    finally { setBusy(false); }
  }
  async function generate(e) {
    e.preventDefault(); setError("");
    try {
      setBusy(true);
      const res = await api.post("/cvs/generate", toPayload(cv));
      navigate(`/cvs/${res.data.data.cv._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Generation failed. Check the backend and API key.");
    } finally { setBusy(false); }
  }
  return <main className="page narrow">
    <header className="topbar"><Link className="brand" to="/dashboard">CV<span>Forge</span></Link><Link to="/dashboard">← Dashboard</Link></header>
    <section className="panel form-panel">
      <div className="eyebrow">CV BUILDER</div>
      <h1>Tell us about yourself</h1>
      <p className="muted">Fill in only what applies to you. Empty sections are hidden automatically. AI improves wording but must not invent qualifications or experience.</p>
      <button type="button" className="secondary small" onClick={loadSample}>Fill with sample data</button>
      {error && <p className="error">{error}</p>}
      <form onSubmit={generate}>
        <CVForm key={formKey} cv={cv} setCv={setCv} />
        <div className="form-actions">
          <button type="button" className="secondary" onClick={save} disabled={busy}>Save without AI</button>
          <button type="submit" disabled={busy}>{busy ? "Generating…" : "✦ Generate CV with AI"}</button>
        </div>
      </form>
    </section>
  </main>;
}
