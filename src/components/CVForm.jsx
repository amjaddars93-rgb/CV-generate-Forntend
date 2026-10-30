import { useState } from "react";
import { DEFAULT_TITLES, TEMPLATES, parseList, resizePhoto } from "../utils/cv";

/* A textarea that keeps what the user typed, and gives the parent a clean array. */
function ListText({ label, value, onChange, rows = 4, placeholder, hint }) {
  const [text, setText] = useState(() => (value || []).join("\n"));
  return (
    <label>{label}{hint && <small>{hint}</small>}
      <textarea rows={rows} value={text} placeholder={placeholder}
        onChange={(e) => { setText(e.target.value); onChange(parseList(e.target.value)); }} />
    </label>
  );
}

/* Add / remove / edit a list of objects (education, experience, ...). */
function EntryList({ items, onChange, fields, blank, addLabel, itemName }) {
  const update = (i, key, val) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="entry-list">
      {items.map((it, i) => (
        <div className="entry-card" key={i}>
          <div className="entry-head">
            <strong>{itemName} {i + 1}</strong>
            <button type="button" className="danger small" onClick={() => remove(i)}>Remove</button>
          </div>
          <div className="two-col">
            {fields.map((f) => (
              <label key={f.key} className={f.wide ? "wide" : ""}>{f.label}
                {f.area
                  ? <textarea rows="3" value={it[f.key] || ""} placeholder={f.placeholder} onChange={(e) => update(i, f.key, e.target.value)} />
                  : <input value={it[f.key] || ""} placeholder={f.placeholder} onChange={(e) => update(i, f.key, e.target.value)} />}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="button" className="secondary small" onClick={() => onChange([...items, { ...blank }])}>＋ {addLabel}</button>
    </div>
  );
}

const BULLET_HINT = "One point per line";

export default function CVForm({ cv, setCv }) {
  const [photoError, setPhotoError] = useState("");
  const set = (key, value) => setCv((c) => ({ ...c, [key]: value }));
  const setPersonal = (key, value) => setCv((c) => ({ ...c, personalInfo: { ...c.personalInfo, [key]: value } }));
  const setTitle = (key, value) => setCv((c) => ({ ...c, sectionTitles: { ...c.sectionTitles, [key]: value } }));
  const p = cv.personalInfo;
  const [moreOpen] = useState(() => ["certifications", "languages", "achievements", "volunteerExperience", "interests"].some((k) => (cv[k] || []).length > 0));

  async function onPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try { setPhotoError(""); setPersonal("photo", await resizePhoto(file)); }
    catch (err) { setPhotoError(err.message); }
  }

  const updateCustom = (i, patch) => set("customSections", cv.customSections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  return (
    <>
      <div className="two-col">
        <label>CV title<input value={cv.title} onChange={(e) => set("title", e.target.value)} required maxLength="120" /></label>
        <label>Template<select value={cv.template} onChange={(e) => set("template", e.target.value)}>{TEMPLATES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
      </div>
      <label className="color-row">Accent colour
        <input type="color" value={cv.accentColor || "#0b3b9a"} onChange={(e) => set("accentColor", e.target.value)} />
      </label>

      <h2>Personal information</h2>
      <div className="photo-row">
        <div className="photo-thumb">{p.photo ? <img src={p.photo} alt="Profile" /> : <span>No photo</span>}</div>
        <div>
          <label className="file-label">Profile photo (optional)<input type="file" accept="image/*" onChange={onPhoto} /></label>
          {p.photo && <button type="button" className="danger small" onClick={() => setPersonal("photo", "")}>Remove photo</button>}
          {photoError && <p className="error">{photoError}</p>}
          <small>Used by the Profile Sidebar template. A clear, front-facing photo works best.</small>
        </div>
      </div>
      <div className="two-col">
        <label>Full name<input value={p.fullName} onChange={(e) => setPersonal("fullName", e.target.value)} required maxLength="120" /></label>
        <label>Job title / headline<input value={p.jobTitle} onChange={(e) => setPersonal("jobTitle", e.target.value)} placeholder="" required maxLength="120" /></label>
        <label>Email<input type="email" value={p.email} onChange={(e) => setPersonal("email", e.target.value)} /></label>
        <label>Phone<input value={p.phone} onChange={(e) => setPersonal("phone", e.target.value)} /></label>
        <label>Address / city<input value={p.address} onChange={(e) => setPersonal("address", e.target.value)} placeholder="" /></label>
        <label>Key highlights<input value={p.highlights} onChange={(e) => setPersonal("highlights", e.target.value)} placeholder="" maxLength="300" /></label>
      </div>
      <label>Professional summary<small>Leave empty and AI will write one from your details.</small>
        <textarea rows="4" value={p.summary} onChange={(e) => setPersonal("summary", e.target.value)} placeholder="Your career goal or professional summary" />
      </label>

      <h2>Education</h2>
      <EntryList itemName="Education" addLabel="Add education" items={cv.education} onChange={(v) => set("education", v)}
        blank={{ qualification: "", institution: "", year: "", description: "" }}
        fields={[
          { key: "qualification", label: "Degree / qualification", placeholder: "" },
          { key: "institution", label: "Institution", placeholder: "" },
          { key: "year", label: "Years", placeholder: "" },
          { key: "description", label: "Details (optional)", area: true, wide: true, placeholder: BULLET_HINT }
        ]} />

      <h2>Experience / internships</h2>
      <EntryList itemName="Experience" addLabel="Add experience" items={cv.experience} onChange={(v) => set("experience", v)}
        blank={{ role: "", company: "", duration: "", description: "" }}
        fields={[
          { key: "role", label: "Role / place", placeholder: "" },
          { key: "company", label: "Organisation (optional)", placeholder: "" },
          { key: "duration", label: "Dates", placeholder: "", wide: true },
          { key: "description", label: "What you did", area: true, wide: true, placeholder: BULLET_HINT }
        ]} />

      <h2>Skills</h2>
      <ListText label="Skills" hint="One skill per line (or separate with commas on a single line)" rows={5} value={cv.skills} onChange={(v) => set("skills", v)} placeholder={""} />

      <h2>Projects / thesis</h2>
      <EntryList itemName="Project" addLabel="Add project" items={cv.projects} onChange={(v) => set("projects", v)}
        blank={{ name: "", technologies: "", description: "", url: "" }}
        fields={[
          { key: "name", label: "Project name", placeholder: "" },
          { key: "technologies", label: "Tools / technologies", placeholder: "" },
          { key: "url", label: "Link (optional)", wide: true },
          { key: "description", label: "Description", area: true, wide: true, placeholder: BULLET_HINT }
        ]} />

      <details className="more" open={moreOpen}>
        <summary>More sections: certifications, languages, achievements, volunteering, interests</summary>
        <h2>Certifications</h2>
        <EntryList itemName="Certification" addLabel="Add certification" items={cv.certifications} onChange={(v) => set("certifications", v)}
          blank={{ name: "", issuer: "", year: "" }}
          fields={[{ key: "name", label: "Name" }, { key: "issuer", label: "Issuer" }, { key: "year", label: "Year" }]} />
        <h2>Languages</h2>
        <EntryList itemName="Language" addLabel="Add language" items={cv.languages} onChange={(v) => set("languages", v)}
          blank={{ name: "", proficiency: "" }}
          fields={[{ key: "name", label: "Language", placeholder: "English" }, { key: "proficiency", label: "Level (optional)", placeholder: "Fluent" }]} />
        <h2>Achievements</h2>
        <ListText label="Achievements" hint="One per line" rows={3} value={cv.achievements} onChange={(v) => set("achievements", v)} />
        <h2>Volunteer experience</h2>
        <EntryList itemName="Volunteer role" addLabel="Add volunteer role" items={cv.volunteerExperience} onChange={(v) => set("volunteerExperience", v)}
          blank={{ role: "", organization: "", description: "" }}
          fields={[{ key: "role", label: "Role" }, { key: "organization", label: "Organisation" }, { key: "description", label: "Details", area: true, wide: true, placeholder: BULLET_HINT }]} />
        <h2>Interests</h2>
        <ListText label="Interests" hint="One per line (or commas)" rows={2} value={cv.interests} onChange={(v) => set("interests", v)} />
      </details>

      <h2>Your own sections</h2>
      <p className="muted small-text">Need a section that is not above (Thesis, Tools &amp; Software, Publications, Clinical Skills, Awards…)? Add it here with any title. “Side panel” puts it in the left column of the Profile Sidebar template.</p>
      {cv.customSections.map((s, i) => (
        <div className="entry-card" key={i}>
          <div className="entry-head">
            <strong>Section {i + 1}</strong>
            <button type="button" className="danger small" onClick={() => set("customSections", cv.customSections.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
          <div className="two-col">
            <label className="wide">Section title<input value={s.title} maxLength="60" onChange={(e) => updateCustom(i, { title: e.target.value })} placeholder="Final Thesis" /></label>
            <label>Where to show it
              <select value={s.placement} onChange={(e) => updateCustom(i, { placement: e.target.value })}>
                <option value="main">Main column</option>
                <option value="sidebar">Side panel (left)</option>
              </select>
            </label>
            <label>Content type
              <select value={s.kind} onChange={(e) => updateCustom(i, { kind: e.target.value })}>
                <option value="bullets">Bullet list</option>
                <option value="entries">Entries (title, date, details)</option>
                <option value="text">Paragraph</option>
              </select>
            </label>
          </div>
          {s.kind === "entries"
            ? <EntryList itemName="Entry" addLabel="Add entry" items={s.entries} onChange={(v) => updateCustom(i, { entries: v })}
                blank={{ heading: "", subheading: "", date: "", description: "" }}
                fields={[
                  { key: "heading", label: "Title", wide: true },
                  { key: "subheading", label: "Subtitle (optional)" },
                  { key: "date", label: "Date (optional)" },
                  { key: "description", label: "Details", area: true, wide: true, placeholder: BULLET_HINT }
                ]} />
            : <label>{s.kind === "text" ? "Text" : "Items"}{s.kind === "bullets" && <small>One item per line</small>}
                <textarea rows="4" maxLength="4000" value={s.lines} onChange={(e) => updateCustom(i, { lines: e.target.value })} />
              </label>}
        </div>
      ))}
      <button type="button" className="secondary small" disabled={cv.customSections.length >= 10}
        onClick={() => set("customSections", [...cv.customSections, { title: "", placement: "main", kind: "bullets", lines: "", entries: [] }])}>＋ Add your own section</button>

      <details className="more">
        <summary>Rename section headings (e.g. Experience → Internship Experience)</summary>
        <div className="two-col">
          {Object.keys(DEFAULT_TITLES).map((k) => (
            <label key={k}>{DEFAULT_TITLES[k]}
              <input value={cv.sectionTitles?.[k] || ""} maxLength="60" placeholder={DEFAULT_TITLES[k]} onChange={(e) => setTitle(k, e.target.value)} />
            </label>
          ))}
        </div>
      </details>
    </>
  );
}
