import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";
import { normalizeCV, toPayload } from "../utils/cv";

export default function EditCV() {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/cvs/${id}`)
      .then((res) => setCv(normalizeCV(res.data.data.cv)))
      .catch((err) => setError(err.response?.data?.message || "Could not load CV."));
  }, [id]);

  async function save() {
    setBusy(true); setError(""); setSaved(false);
    try {
      await api.patch(`/cvs/${id}`, toPayload(cv));
      setSaved(true);
    } catch (err) { setError(err.response?.data?.message || "Could not save changes."); }
    finally { setBusy(false); }
  }

  if (error && !cv) return <main className="page"><p className="error">{error}</p><Link to="/dashboard">Back</Link></main>;
  if (!cv) return <main className="page"><p>Loading CV…</p></main>;
  return <main className="page">
    <header className="topbar no-print">
      <Link className="brand" to="/dashboard">CV<span>Forge</span></Link>
      <div className="top-actions">
        <Link to="/dashboard">Dashboard</Link>
        <button type="button" onClick={() => window.print()} className="secondary">Download / Print PDF</button>
        <button type="button" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
      </div>
    </header>
    {error && <p className="error no-print">{error}</p>}
    {saved && <p className="success no-print">Changes saved.</p>}
    <div className="editor-grid">
      <section className="panel editor-panel no-print">
        <h2>Edit CV</h2>
        <CVForm cv={cv} setCv={(updater) => { setSaved(false); setCv(updater); }} />
        <button type="button" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
      </section>
      <CVPreview cv={cv} />
    </div>
    <p className="footer-note no-print">To save a PDF: click “Download / Print PDF”, choose “Save as PDF”, set Margins to “None” and turn on “Background graphics”.</p>
  </main>;
}
