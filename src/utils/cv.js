// Shared helpers for the CV form and the CV preview.

export const DEFAULT_TITLES = {
  summary: "Professional Summary",
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
  volunteerExperience: "Volunteer Experience",
  interests: "Interests"
};

export const TEMPLATES = [
  { value: "sidebar", label: "Profile Sidebar (photo + side panel)" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "minimal", label: "Minimal" }
];

export function blankCV() {
  return {
    title: "My Professional CV",
    template: "sidebar",
    accentColor: "#0b3b9a",
    personalInfo: { fullName: "", jobTitle: "", highlights: "", email: "", phone: "", address: "", summary: "", photo: "" },
    sectionTitles: {},
    education: [], experience: [], skills: [], projects: [], certifications: [],
    languages: [], achievements: [], volunteerExperience: [], interests: [], customSections: []
  };
}

// Make sure an old CV from the database has every field the new form expects.
export function normalizeCV(cv) {
  const base = blankCV();
  return {
    ...base,
    ...cv,
    personalInfo: { ...base.personalInfo, ...(cv.personalInfo || {}) },
    sectionTitles: { ...(cv.sectionTitles || {}) },
    customSections: (cv.customSections || []).map((s) => ({
      title: s.title || "", placement: s.placement || "main", kind: s.kind || "bullets",
      lines: s.lines || "", entries: (s.entries || []).map((e) => ({ heading: e.heading || "", subheading: e.subheading || "", date: e.date || "", description: e.description || "" }))
    }))
  };
}

// The part we send to the API (no _id, createdAt, empty cards, etc.).
const isBlank = (item) => typeof item === "string" ? !item.trim() : Object.entries(item).every(([k, v]) => k === "_id" || !String(v ?? "").trim());
export function toPayload(cv) {
  const clean = (arr) => (arr || [])
    .filter((item) => !isBlank(item))
    .map((item) => (typeof item === "string" ? item : Object.fromEntries(Object.entries(item).filter(([k]) => k !== "_id"))));
  return {
    title: cv.title,
    template: cv.template,
    accentColor: cv.accentColor,
    personalInfo: cv.personalInfo,
    sectionTitles: Object.fromEntries(Object.entries(cv.sectionTitles || {}).filter(([k, v]) => k !== "_id" && typeof v === "string")),
    education: clean(cv.education),
    experience: clean(cv.experience),
    skills: clean(cv.skills),
    projects: clean(cv.projects),
    certifications: clean(cv.certifications),
    languages: clean(cv.languages),
    achievements: clean(cv.achievements),
    volunteerExperience: clean(cv.volunteerExperience),
    interests: clean(cv.interests),
    customSections: (cv.customSections || [])
      .map((s) => ({ title: s.title || "", placement: s.placement, kind: s.kind, lines: s.lines || "", entries: clean(s.entries) }))
      .filter((s) => s.title.trim() || s.lines.trim() || s.entries.length)
  };
}

// "one per line" lists. If the user typed a single line, also allow commas.
export function parseList(text) {
  const raw = String(text || "");
  const parts = raw.includes("\n") ? raw.split("\n") : raw.split(",");
  return parts.map((s) => s.trim()).filter(Boolean);
}

// Turn a multi-line description into clean bullet lines.
export function toLines(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.replace(/^\s*[-•*▪●]+\s*/, "").trim())
    .filter(Boolean);
}

export function sectionTitle(cv, key) {
  return (cv.sectionTitles?.[key] || "").trim() || DEFAULT_TITLES[key];
}

export function splitHighlights(text) {
  return String(text || "").split(/[,•|]/).map((s) => s.trim()).filter(Boolean);
}

// Resize and crop a chosen photo to a small square JPEG (keeps the database and API light).
export function resizePhoto(file, size = 400) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("This image could not be opened."));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 4; // keep the face: crop a little higher than centre
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, sx, Math.max(0, sy), side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export const SAMPLE_CV = {
  title: "Nutrition Graduate CV",
  template: "sidebar",
  accentColor: "#0b3b9a",
  personalInfo: {
    fullName: "Muhammad Ashraf",
    jobTitle: "Nutrition & Food Science Graduate",
    highlights: "Quality Control, Food Safety, Nutrition, Clinical Nutrition",
    email: "darsashraf79@gmail.com",
    phone: "03403686978",
    address: "Karachi, Sindh, Pakistan",
    summary: "Motivated and detail-oriented Nutrition and Food Science graduate with hands-on experience in quality control, food safety, laboratory analysis and clinical nutrition. Skilled in nutritional assessment, diet planning and patient counseling. Passionate about promoting healthy eating habits through evidence-based nutrition and food quality assurance.",
    photo: ""
  },
  sectionTitles: { skills: "Clinical Skills", experience: "Internship Experience" },
  education: [
    { qualification: "BS Nutrition and Food Science", institution: "University of Sindh, Jamshoro", year: "2022 – 2026", description: "" },
    { qualification: "Intermediate (Pre-Medical)", institution: "Govt Boys Degree College Qasimabad, Hyderabad", year: "2019 – 2021", description: "" }
  ],
  experience: [
    { role: "Peads Unit – II, Liaquat University Hospital, Hyderabad", company: "", duration: "04-06-2024 to 04-07-2024 (1 Month)", description: "Completed 1 month internship at Peads Unit – II, Liaquat University Hospital, Hyderabad." },
    { role: "Nutrition Stabilization Center, Civil Hospital Mithi, District Tharparkar", company: "", duration: "05-07-2024 to 05-09-2024 (2 Months)", description: "Completed 2 month internship at the Nutrition Stabilization Center of Civil Hospital Mithi." }
  ],
  skills: ["Nutritional Assessment & Counseling", "Diet Plan Development (therapeutic & clinical diets)", "Patient Education & Behavior Change Communication", "Anthropometric Measurements (Height, Weight, BMI, MUAC)", "Dietary Recall & Food Frequency Assessment", "Clinical Documentation & Reporting"],
  projects: [], certifications: [],
  languages: [{ name: "English", proficiency: "" }, { name: "Urdu", proficiency: "" }, { name: "Sindhi", proficiency: "" }],
  achievements: [], volunteerExperience: [], interests: [],
  customSections: [
    { title: "Nutritional Information", placement: "sidebar", kind: "bullets", lines: "Macronutrients (Carbohydrates, Proteins, Fats)\nMicronutrients (Vitamins & Minerals)\nDietary Fibre\nCaloric Requirements & Energy Balance\nFood Label Reading & Interpretation\nSpecial Diets (Diabetic, Renal, Cardiac, GI, etc.)", entries: [] },
    { title: "Tools & Software", placement: "sidebar", kind: "bullets", lines: "Microsoft Word\nMicrosoft Excel\nMicrosoft PowerPoint\nNutrition Analysis Software", entries: [] },
    { title: "Final Thesis", placement: "main", kind: "entries", lines: "", entries: [
      { heading: "Effects of Drinking Water Quality on Micronutrient Deficiencies among Residents of Tharparkar Desert", subheading: "", date: "", description: "Assessed water quality and micronutrient levels.\nCollected and analyzed data on Iron, Calcium and Magnesium.\nEvaluated the impact of water quality on nutritional status.\nPrepared and presented final research report." }
    ] }
  ]
};
