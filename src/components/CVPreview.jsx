import { sectionTitle, splitHighlights, toLines } from "../utils/cv";

/* ---------- small icon set (no extra packages needed) ---------- */
const ICONS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  cap: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /><path d="M3 13h18" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9z" /><path d="M8.5 12h7M8.5 16h7" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 21h8M12 16v5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></>,
  doc: <><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14L7 22l5-3 5 3-1.5-8" /></>,
  code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  heart: <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>
};

function Icon({ name }) {
  return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name] || ICONS.star}</svg>;
}

// Pick an icon from the words in a section title (works for any custom section name).
function iconFor(title = "") {
  const t = title.toLowerCase();
  if (/summary|profile|about|objective/.test(t)) return "user";
  if (/educat|academic|qualif|study/.test(t)) return "cap";
  if (/experien|intern|work|employ|career|training/.test(t)) return "briefcase";
  if (/tool|software|technolog|computer/.test(t)) return "monitor";
  if (/language/.test(t)) return "globe";
  if (/skill|competen|expertise/.test(t)) return "gear";
  if (/thesis|research|publication|paper|project/.test(t)) return /project/.test(t) ? "code" : "doc";
  if (/certif|award|achiev|honou?r|licen/.test(t)) return "award";
  if (/volunteer|interest|hobb|activit/.test(t)) return "heart";
  if (/info|knowledge|clinical|nutrition/.test(t)) return "clipboard";
  return "star";
}

/* ---------- reusable pieces ---------- */
function Bullets({ text }) {
  const lines = toLines(text);
  if (!lines.length) return null;
  return <ul className="r-bullets">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>;
}
function Plain({ items }) {
  const list = (items || []).map((x) => (typeof x === "string" ? x : x?.description || "")).filter(Boolean);
  if (!list.length) return null;
  return <ul className="r-bullets">{list.map((l, i) => <li key={i}>{l}</li>)}</ul>;
}
const has = (arr) => Array.isArray(arr) && arr.length > 0;
const dot = (...parts) => parts.filter(Boolean).join(" · ");

/* Each standard block returns the entries only; the wrapper (sidebar bar / main heading) is added by the template. */
function EducationBody({ items }) {
  return items.map((e, i) => (
    <div className="r-item" key={i}>
      <strong>{e.qualification || e.institution}</strong>
      {e.qualification && e.institution && <div>{e.institution}</div>}
      {e.year && <div className="r-date">{e.year}</div>}
      <Bullets text={e.description} />
    </div>
  ));
}
function ExperienceBody({ items, timeline }) {
  return <div className={timeline ? "r-timeline" : ""}>{items.map((e, i) => (
    <div className="r-item r-entry" key={i}>
      <strong className="r-heading">{e.role || e.company}</strong>
      {e.role && e.company && <div>{e.company}</div>}
      {e.duration && <div className="r-date">{e.duration}</div>}
      <Bullets text={e.description} />
    </div>
  ))}</div>;
}
function ProjectsBody({ items, timeline }) {
  return <div className={timeline ? "r-timeline" : ""}>{items.map((p, i) => (
    <div className="r-item r-entry" key={i}>
      <strong className="r-heading">{p.name}</strong>
      {p.technologies && <div className="r-date">{p.technologies}</div>}
      <Bullets text={p.description} />
      {p.url && <div className="r-date">{p.url}</div>}
    </div>
  ))}</div>;
}
function CertBody({ items }) {
  return <ul className="r-bullets">{items.map((c, i) => <li key={i}>{dot(c.name || c.description, c.issuer, c.year)}</li>)}</ul>;
}
function LanguageBody({ items }) {
  return <ul className="r-bullets">{items.map((l, i) => <li key={i}>{[l.name, l.proficiency].filter(Boolean).join(" — ")}</li>)}</ul>;
}
function VolunteerBody({ items, timeline }) {
  return <div className={timeline ? "r-timeline" : ""}>{items.map((v, i) => (
    <div className="r-item r-entry" key={i}>
      <strong className="r-heading">{v.role || v.organization}</strong>
      {v.role && v.organization && <div>{v.organization}</div>}
      <Bullets text={v.description} />
    </div>
  ))}</div>;
}
function CustomBody({ section, timeline }) {
  if (section.kind === "text") return section.lines ? <p className="r-text">{section.lines}</p> : null;
  if (section.kind === "entries") {
    return <div className={timeline ? "r-timeline" : ""}>{(section.entries || []).map((e, i) => (
      <div className="r-item r-entry" key={i}>
        {e.heading && <strong className="r-heading">{e.heading}</strong>}
        {e.subheading && <div>{e.subheading}</div>}
        {e.date && <div className="r-date">{e.date}</div>}
        <Bullets text={e.description} />
      </div>
    ))}</div>;
  }
  return <Bullets text={section.lines} />;
}
const customHasContent = (s) => (s.title || "").trim() && (s.kind === "entries" ? has(s.entries) : (s.lines || "").trim());

/* ---------- Template 1: Profile Sidebar (photo + side panel) ---------- */
function SidebarTemplate({ cv }) {
  const p = cv.personalInfo || {};
  const t = (k) => sectionTitle(cv, k);
  const custom = (cv.customSections || []).filter(customHasContent);
  const initials = (p.fullName || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const highlights = splitHighlights(p.highlights);

  const SideSec = ({ icon, title, children }) => <section className="sb-sec"><h3 className="sb-bar"><Icon name={icon} /><span>{title}</span></h3>{children}</section>;
  const MainSec = ({ icon, title, children }) => <section className="mn-sec"><div className="mn-head"><span className="mn-icon"><Icon name={icon} /></span><h3>{title}</h3></div>{children}</section>;

  return (
    <article className="resume resume-sidebar" id="resume" style={{ "--accent": cv.accentColor || "#0b3b9a" }}>
      <div className="sb-shape" />
      <aside className="sb-side">
        <div className="sb-photo">{p.photo ? <img src={p.photo} alt="" /> : <span>{initials || "CV"}</span>}</div>
        {has(cv.education) && <SideSec icon="cap" title={t("education")}><EducationBody items={cv.education} /></SideSec>}
        {has(cv.skills) && <SideSec icon="gear" title={t("skills")}><Plain items={cv.skills} /></SideSec>}
        {custom.filter((s) => s.placement === "sidebar").map((s, i) => <SideSec key={`s${i}`} icon={iconFor(s.title)} title={s.title}><CustomBody section={s} /></SideSec>)}
        {has(cv.languages) && <SideSec icon="globe" title={t("languages")}><LanguageBody items={cv.languages} /></SideSec>}
        {has(cv.interests) && <SideSec icon="heart" title={t("interests")}><Plain items={cv.interests} /></SideSec>}
      </aside>

      <div className="sb-main">
        <header className="mn-top">
          <h1>{p.fullName || "Your Name"}</h1>
          {p.jobTitle && <h2>{p.jobTitle}</h2>}
          {highlights.length > 0 && <div className="mn-tags">{highlights.map((h, i) => <span key={i}>{h}</span>)}</div>}
          <div className="mn-contact">
            {p.phone && <span><i><Icon name="phone" /></i>{p.phone}</span>}
            {p.email && <span><i><Icon name="mail" /></i>{p.email}</span>}
            {p.address && <span><i><Icon name="pin" /></i>{p.address}</span>}
          </div>
        </header>

        {p.summary && <MainSec icon="user" title={t("summary")}><div className="mn-box"><p>{p.summary}</p></div></MainSec>}
        {has(cv.experience) && <MainSec icon="briefcase" title={t("experience")}><ExperienceBody items={cv.experience} timeline /></MainSec>}
        {has(cv.projects) && <MainSec icon="code" title={t("projects")}><ProjectsBody items={cv.projects} timeline /></MainSec>}
        {custom.filter((s) => s.placement !== "sidebar").map((s, i) => <MainSec key={`m${i}`} icon={iconFor(s.title)} title={s.title}><CustomBody section={s} timeline={s.kind === "entries" && s.entries.length > 1} /></MainSec>)}
        {has(cv.certifications) && <MainSec icon="award" title={t("certifications")}><CertBody items={cv.certifications} /></MainSec>}
        {has(cv.achievements) && <MainSec icon="award" title={t("achievements")}><Plain items={cv.achievements} /></MainSec>}
        {has(cv.volunteerExperience) && <MainSec icon="heart" title={t("volunteerExperience")}><VolunteerBody items={cv.volunteerExperience} timeline /></MainSec>}
      </div>
    </article>
  );
}

/* ---------- Templates 2-4: single column (Modern / Classic / Minimal) ---------- */
function SingleColumnTemplate({ cv }) {
  const p = cv.personalInfo || {};
  const t = (k) => sectionTitle(cv, k);
  const custom = (cv.customSections || []).filter(customHasContent);
  const Sec = ({ title, children }) => <section><h3>{title}</h3>{children}</section>;
  return (
    <article className={`resume resume-${cv.template}`} id="resume" style={{ "--accent": cv.accentColor || "#4859d7" }}>
      <div className="resume-head">
        {p.photo && <img className="resume-photo" src={p.photo} alt="" />}
        <h1>{p.fullName || "Your Name"}</h1>
        <h2>{p.jobTitle || "Professional Title"}</h2>
        <p>{[p.email, p.phone, p.address].filter(Boolean).join(" · ")}</p>
      </div>
      {p.summary && <Sec title={t("summary")}><p>{p.summary}</p></Sec>}
      {has(cv.skills) && <Sec title={t("skills")}><p>{cv.skills.join(" · ")}</p></Sec>}
      {has(cv.experience) && <Sec title={t("experience")}><ExperienceBody items={cv.experience} /></Sec>}
      {has(cv.education) && <Sec title={t("education")}><EducationBody items={cv.education} /></Sec>}
      {has(cv.projects) && <Sec title={t("projects")}><ProjectsBody items={cv.projects} /></Sec>}
      {custom.map((s, i) => <Sec key={i} title={s.title}><CustomBody section={s} /></Sec>)}
      {has(cv.certifications) && <Sec title={t("certifications")}><CertBody items={cv.certifications} /></Sec>}
      {has(cv.languages) && <Sec title={t("languages")}><p>{cv.languages.map((l) => [l.name, l.proficiency].filter(Boolean).join(" — ")).join(" · ")}</p></Sec>}
      {has(cv.achievements) && <Sec title={t("achievements")}><Plain items={cv.achievements} /></Sec>}
      {has(cv.volunteerExperience) && <Sec title={t("volunteerExperience")}><VolunteerBody items={cv.volunteerExperience} /></Sec>}
      {has(cv.interests) && <Sec title={t("interests")}><p>{cv.interests.join(" · ")}</p></Sec>}
    </article>
  );
}

export default function CVPreview({ cv }) {
  return <div className="resume-frame">{cv.template === "sidebar" ? <SidebarTemplate cv={cv} /> : <SingleColumnTemplate cv={cv} />}</div>;
}
