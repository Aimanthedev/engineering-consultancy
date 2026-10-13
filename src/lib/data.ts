export type Health = "On Track" | "At Risk" | "Delayed" | "Review";
export type Stage =
  | "Brief" | "Survey" | "Concept" | "Schematic" | "Developed" | "Detailed" | "Authority" | "IFC" | "Supervision" | "Handover";

export const STAGES: Stage[] = ["Brief", "Survey", "Concept", "Schematic", "Developed", "Detailed", "Authority", "IFC", "Supervision", "Handover"];
export const DISCIPLINES = ["Architecture", "Interior", "Structural", "MEP", "Landscape", "Civil"] as const;
export type Discipline = (typeof DISCIPLINES)[number];

export type Person = { id: string; name: string; role: string; discipline: Discipline | "Management" | "Site"; load: number; initials: string };

const mk = (id: string, name: string, role: string, discipline: Person["discipline"], load: number): Person => ({
  id, name, role, discipline, load, initials: name.split(" ").map((s) => s[0]).join("").slice(0, 2),
});

export const PEOPLE: Person[] = [
  mk("p1", "Sarah Ahmed", "Project Manager", "Management", 92),
  mk("p2", "Omar Haddad", "Design Director", "Architecture", 78),
  mk("p3", "Lina Farouk", "Senior Architect", "Architecture", 108),
  mk("p4", "James Whitford", "Structural Engineer", "Structural", 84),
  mk("p5", "Priya Nair", "Interior Designer", "Interior", 71),
  mk("p6", "Khalid Al-Mansoori", "MEP Engineer", "MEP", 116),
  mk("p7", "Elena Petrova", "Design Coordinator", "Architecture", 88),
  mk("p8", "Yousef Saleh", "Site Engineer", "Site", 95),
  mk("p9", "Marco Bellini", "Project Manager", "Management", 64),
  mk("p10", "Aisha Rahman", "Document Controller", "Management", 58),
  mk("p11", "Daniel Cho", "Quantity Surveyor", "Management", 73),
  mk("p12", "Fatima Zahra", "Surveyor", "Civil", 81),
  mk("p13", "Noah Kessler", "Landscape Architect", "Landscape", 46),
  mk("p14", "Hana Ito", "Interior Designer", "Interior", 99),
];
export const person = (id: string) => PEOPLE.find((p) => p.id === id)!;

export type Project = {
  id: string; code: string; name: string; type: string; location: string; client: string; pm: string;
  stage: Stage; progress: number; health: Health; next: string; nextDate: string; fee: number; invoiced: number;
  packages: Partial<Record<Discipline, number>>; team: number; pendingReviews: number; days: number; hue: number;
};

const P = (
  n: number, name: string, type: string, location: string, client: string, pm: string, stage: Stage,
  progress: number, health: Health, next: string, nextDate: string, fee: number, packages: Project["packages"], hue: number,
): Project => ({
  id: `prj-${n}`, code: `PRJ-2026-${String(n).padStart(3, "0")}`, name, type, location, client, pm, stage, progress, health,
  next, nextDate, fee, invoiced: Math.round(fee * progress * 0.0085), packages,
  team: 6 + (n % 19), pendingReviews: n % 9, days: 40 + n * 7, hue,
});

export const PROJECTS: Project[] = [
  P(14, "Al Noor Private Residence", "Residential Villa", "Doha", "Al Noor Holdings", "p1", "Detailed", 68, "On Track", "IFC Architecture", "22 Oct", 1850000, { Architecture: 78, Interior: 62, Structural: 71, MEP: 55 }, 252),
  P(9, "West Bay Corporate HQ", "Commercial Office", "West Bay", "Qatar Capital Partners", "p9", "Developed", 64, "At Risk", "MEP Coordination Model", "17 Oct", 4200000, { Architecture: 70, Structural: 66, MEP: 48, Interior: 40 }, 275),
  P(21, "Lusail Villa 14", "Luxury Residence", "Lusail", "H.E. Al Thani Office", "p1", "Concept", 46, "On Track", "Concept Presentation", "19 Oct", 960000, { Architecture: 52, Interior: 38, Landscape: 44 }, 195),
  P(17, "Marina Retail Pavilion", "Retail", "The Pearl", "UDC Retail", "p9", "Authority", 71, "Review", "Civil Defence Submission", "16 Oct", 1320000, { Architecture: 82, Interior: 70, MEP: 61 }, 160),
  P(5, "Industrial Administration HQ", "Corporate / Industrial", "Industrial Area", "Gulf Steelworks", "p1", "Schematic", 31, "Delayed", "Structural Scheme Approval", "14 Oct", 2650000, { Architecture: 40, Structural: 22, MEP: 18, Civil: 35 }, 25),
  P(3, "Doha Medical Centre", "Healthcare", "Doha", "Ministry of Public Health", "p9", "Detailed", 58, "At Risk", "MEP IFC Package", "28 Oct", 6800000, { Architecture: 66, Structural: 72, MEP: 41, Interior: 50 }, 210),
  P(11, "Crescent International School", "Education", "Al Waab", "Crescent Education Group", "p1", "Supervision", 86, "On Track", "Monthly Site Report", "20 Oct", 3100000, { Architecture: 96, Structural: 100, MEP: 88, Landscape: 70 }, 140),
  P(22, "Pearl Penthouse", "Interior Design", "The Pearl", "Private Client", "p9", "Developed", 54, "On Track", "FF&E Schedule", "24 Oct", 720000, { Interior: 58, MEP: 42 }, 300),
  P(8, "Seafront Restaurant Complex", "Hospitality", "Lusail Marina", "Marina Dining Co.", "p1", "Detailed", 62, "Review", "Kitchen MEP Review", "18 Oct", 1540000, { Architecture: 74, Interior: 66, MEP: 49, Structural: 70 }, 180),
  P(2, "Al Rayyan Residential Compound", "Residential", "Al Rayyan", "Rayyan Developments", "p9", "Supervision", 91, "On Track", "Snag Close-out Phase 2", "30 Oct", 5400000, { Architecture: 100, Structural: 100, MEP: 94, Landscape: 82 }, 120),
  P(25, "Msheireb Gallery Fit-out", "Cultural / Interior", "Msheireb", "Msheireb Properties", "p1", "Brief", 8, "On Track", "Brief Sign-off", "21 Oct", 480000, { Interior: 10 }, 330),
  P(19, "Education City Lab Block", "Research", "Education City", "QF Capital Projects", "p9", "Survey", 14, "At Risk", "Topographic Survey", "15 Oct", 3900000, { Architecture: 12, Civil: 30 }, 230),
  P(12, "Wakra Logistics Depot", "Industrial", "Al Wakra", "Hamad Logistics", "p1", "IFC", 82, "On Track", "IFC Issue — All", "23 Oct", 1150000, { Architecture: 90, Structural: 88, MEP: 76, Civil: 84 }, 60),
  P(7, "Katara Boutique Hotel", "Hospitality", "Katara", "Katara Hospitality", "p9", "Developed", 49, "Delayed", "Client Design Freeze", "13 Oct", 4750000, { Architecture: 58, Interior: 44, Structural: 50, MEP: 36 }, 10),
  P(16, "Old Airport Clinic Refurb", "Healthcare", "Old Airport", "PHCC", "p1", "Handover", 97, "On Track", "As-built Handover", "26 Oct", 640000, { Architecture: 100, MEP: 95 }, 170),
  P(28, "Simaisma Beach Villas", "Residential", "Simaisma", "Coastline Estates", "p9", "Concept", 22, "On Track", "Massing Options", "27 Oct", 2200000, { Architecture: 28, Landscape: 18 }, 200),
];
export const project = (id: string) => PROJECTS.find((p) => p.id === id);

export type Package = { id: string; project: string; discipline: Discipline; name: string; stage: Stage; progress: number; lead: string; status: "In Design" | "Internal Review" | "Client Review" | "Approved" | "Revision" | "Blocked"; due: string; rev: string; drawings: number };
const pkgStatuses: Package["status"][] = ["In Design", "Internal Review", "Client Review", "Approved", "Revision", "Blocked", "In Design", "In Design"];
const leads: Record<Discipline, string> = { Architecture: "p3", Interior: "p5", Structural: "p4", MEP: "p6", Landscape: "p13", Civil: "p12" };
export const PACKAGES: Package[] = PROJECTS.flatMap((p, i) =>
  (Object.entries(p.packages) as [Discipline, number][]).map(([d, prog], j) => ({
    id: `pkg-${i}-${j}`, project: p.id, discipline: d, name: `${d} — ${p.stage} Design`, stage: p.stage, progress: prog,
    lead: d === "Interior" && i % 2 ? "p14" : leads[d], status: prog >= 95 ? "Approved" : pkgStatuses[(i + j * 3) % pkgStatuses.length],
    due: `${10 + ((i * 3 + j * 5) % 20)} Oct`, rev: ["P01", "P02", "P03", "C01", "C02", "T01"][(i + j) % 6], drawings: 8 + ((i * 7 + j * 11) % 60),
  })),
);

export type Drawing = { no: string; title: string; project: string; discipline: Discipline; rev: string; status: "WIP" | "For Review" | "For Approval" | "Approved" | "Superseded" | "IFC"; date: string; by: string; scale: string };
const drawTitles: Record<Discipline, string[]> = {
  Architecture: ["Ground Floor Plan", "First Floor Plan", "Roof Plan", "North & South Elevations", "Section A-A", "Door Schedule", "Façade Details"],
  Interior: ["Reflected Ceiling Plan", "Joinery Details — Kitchen", "Finishes Plan", "Majlis Elevations", "FF&E Layout"],
  Structural: ["Foundation Layout", "Column Schedule", "Slab Reinforcement L1", "Steel Connection Details"],
  MEP: ["HVAC Layout L1", "Drainage Schematic", "Lighting Layout", "Fire Alarm Layout", "Power Single Line Diagram"],
  Landscape: ["Hardscape Plan", "Planting Plan"],
  Civil: ["Site Grading Plan", "External Utilities"],
};
const dStat: Drawing["status"][] = ["WIP", "For Review", "For Approval", "Approved", "IFC", "Superseded", "Approved", "WIP"];
const pre: Record<Discipline, string> = { Architecture: "AR", Interior: "ID", Structural: "ST", MEP: "ME", Landscape: "LA", Civil: "CV" };
export const DRAWINGS: Drawing[] = PROJECTS.slice(0, 10).flatMap((p, i) =>
  (Object.keys(p.packages) as Discipline[]).flatMap((d, j) =>
    drawTitles[d].map((t, k) => ({
      no: `${p.code.slice(-3)}-${pre[d]}-${String(100 + k * 10 + j).padStart(4, "0")}`, title: t, project: p.id, discipline: d,
      rev: ["P01", "P02", "P03", "C01", "C02", "T01"][(i + k) % 6], status: dStat[(i + j + k) % dStat.length],
      date: `${1 + ((i + k * 3) % 28)} Oct 2026`, by: leads[d], scale: ["1:50", "1:100", "1:20", "1:200", "NTS"][(k + j) % 5],
    })),
  ),
);

export type Approval = { id: string; title: string; project: string; type: "Client" | "Internal" | "Authority" | "Consultant"; rev: string; submitted: string; due: string; waiting: number; owner: string; status: "Pending" | "Approved" | "Rejected" | "Comments" };
export const APPROVALS: Approval[] = [
  { id: "APR-311", title: "IFC Architecture Package", project: "prj-14", type: "Client", rev: "C02", submitted: "08 Oct", due: "15 Oct", waiting: 5, owner: "p1", status: "Pending" },
  { id: "APR-309", title: "MEP Coordination Model", project: "prj-9", type: "Internal", rev: "P03", submitted: "10 Oct", due: "14 Oct", waiting: 3, owner: "p2", status: "Pending" },
  { id: "APR-305", title: "Civil Defence Fire Strategy", project: "prj-17", type: "Authority", rev: "C01", submitted: "29 Sep", due: "20 Oct", waiting: 14, owner: "p7", status: "Pending" },
  { id: "APR-302", title: "Structural Scheme Option B", project: "prj-5", type: "Consultant", rev: "P02", submitted: "01 Oct", due: "09 Oct", waiting: 12, owner: "p4", status: "Comments" },
  { id: "APR-298", title: "Interior Material Board", project: "prj-22", type: "Client", rev: "P02", submitted: "06 Oct", due: "16 Oct", waiting: 7, owner: "p5", status: "Pending" },
  { id: "APR-296", title: "Kitchen Exhaust Layout", project: "prj-8", type: "Internal", rev: "P01", submitted: "09 Oct", due: "13 Oct", waiting: 4, owner: "p6", status: "Pending" },
  { id: "APR-291", title: "Planning Permit Drawings", project: "prj-3", type: "Authority", rev: "C01", submitted: "18 Sep", due: "18 Oct", waiting: 25, owner: "p9", status: "Pending" },
  { id: "APR-288", title: "Façade Mock-up Approval", project: "prj-7", type: "Client", rev: "P03", submitted: "02 Oct", due: "08 Oct", waiting: 11, owner: "p3", status: "Rejected" },
  { id: "APR-284", title: "Lighting Concept", project: "prj-21", type: "Client", rev: "P01", submitted: "07 Oct", due: "17 Oct", waiting: 6, owner: "p14", status: "Pending" },
  { id: "APR-280", title: "Drainage Schematic", project: "prj-12", type: "Internal", rev: "C01", submitted: "05 Oct", due: "10 Oct", waiting: 0, owner: "p6", status: "Approved" },
  { id: "APR-276", title: "Landscape Planting Palette", project: "prj-2", type: "Client", rev: "C02", submitted: "28 Sep", due: "05 Oct", waiting: 0, owner: "p13", status: "Approved" },
  { id: "APR-273", title: "Steel Connection Details", project: "prj-3", type: "Consultant", rev: "P02", submitted: "04 Oct", due: "14 Oct", waiting: 9, owner: "p4", status: "Pending" },
];

export type Task = { id: string; title: string; project: string; assignee: string; due: string; priority: "Critical" | "High" | "Medium" | "Low"; status: "To Do" | "In Progress" | "Review" | "Done"; discipline: Discipline };
export const TASKS: Task[] = [
  ["Update façade sections to client markup", "prj-14", "p3", "14 Oct", "High", "In Progress", "Architecture"],
  ["Resolve duct clash at L2 corridor", "prj-9", "p6", "13 Oct", "Critical", "In Progress", "MEP"],
  ["Prepare Civil Defence response letter", "prj-17", "p7", "15 Oct", "High", "To Do", "Architecture"],
  ["Run lateral load check — Option B", "prj-5", "p4", "14 Oct", "Critical", "Review", "Structural"],
  ["Finalise joinery shop drawing comments", "prj-22", "p5", "16 Oct", "Medium", "To Do", "Interior"],
  ["Issue RFI-044 response", "prj-11", "p8", "13 Oct", "High", "In Progress", "Architecture"],
  ["Coordinate kitchen exhaust riser", "prj-8", "p6", "17 Oct", "High", "To Do", "MEP"],
  ["Concept massing — 3 options", "prj-21", "p2", "18 Oct", "Medium", "In Progress", "Architecture"],
  ["Lighting layout — majlis", "prj-21", "p14", "19 Oct", "Low", "To Do", "Interior"],
  ["Survey control points verification", "prj-19", "p12", "15 Oct", "High", "In Progress", "Civil"],
  ["Snag list walk-through Block C", "prj-2", "p8", "20 Oct", "Medium", "To Do", "Architecture"],
  ["Transmittal TR-188 to contractor", "prj-12", "p10", "14 Oct", "Medium", "Done", "Architecture"],
  ["Fee proposal — Msheireb gallery", "prj-25", "p11", "16 Oct", "Medium", "Review", "Interior"],
  ["Slab reinforcement L1 check", "prj-3", "p4", "21 Oct", "High", "To Do", "Structural"],
  ["Medical gas schematic markup", "prj-3", "p6", "22 Oct", "Critical", "In Progress", "MEP"],
  ["Hotel lobby material sample review", "prj-7", "p14", "15 Oct", "High", "Review", "Interior"],
].map((t, i) => ({ id: `T-${1200 + i}`, title: t[0], project: t[1], assignee: t[2], due: t[3], priority: t[4] as Task["priority"], status: t[5] as Task["status"], discipline: t[6] as Discipline }));

export type SiteVisit = { id: string; project: string; date: string; engineer: string; type: string; weather: string; progress: number; observations: number; status: "Scheduled" | "Report Draft" | "Issued" };
export const VISITS: SiteVisit[] = [
  { id: "SV-1042", project: "prj-11", date: "13 Oct · 08:30", engineer: "p8", type: "Weekly Supervision", weather: "34°C Clear", progress: 86, observations: 7, status: "Scheduled" },
  { id: "SV-1041", project: "prj-2", date: "13 Oct · 11:00", engineer: "p8", type: "Snag Inspection", weather: "35°C Clear", progress: 91, observations: 23, status: "Scheduled" },
  { id: "SV-1040", project: "prj-16", date: "12 Oct · 09:00", engineer: "p8", type: "Pre-Handover", weather: "33°C Haze", progress: 97, observations: 4, status: "Report Draft" },
  { id: "SV-1038", project: "prj-12", date: "10 Oct · 07:30", engineer: "p8", type: "Concrete Pour Witness", weather: "32°C Clear", progress: 82, observations: 2, status: "Issued" },
  { id: "SV-1035", project: "prj-11", date: "06 Oct · 08:30", engineer: "p8", type: "Weekly Supervision", weather: "36°C Dust", progress: 84, observations: 9, status: "Issued" },
  { id: "SV-1033", project: "prj-2", date: "03 Oct · 10:00", engineer: "p8", type: "MEP Installation Check", weather: "37°C Clear", progress: 89, observations: 12, status: "Issued" },
];

export type Issue = { id: string; kind: "RFI" | "Snag" | "Observation" | "NCR" | "Clash"; title: string; project: string; severity: "Major" | "Minor" | "Critical"; status: "Open" | "Responded" | "Closed" | "Overdue"; owner: string; raised: string; location: string };
export const ISSUES: Issue[] = [
  { id: "RFI-044", kind: "RFI", title: "Clarify parapet waterproofing upstand height", project: "prj-11", severity: "Major", status: "Overdue", owner: "p3", raised: "02 Oct", location: "Roof · Block A" },
  { id: "RFI-043", kind: "RFI", title: "Alternative tile specification approval", project: "prj-11", severity: "Minor", status: "Responded", owner: "p5", raised: "30 Sep", location: "L1 Classrooms" },
  { id: "SNG-218", kind: "Snag", title: "Door closer misaligned — Villa C12", project: "prj-2", severity: "Minor", status: "Open", owner: "p8", raised: "10 Oct", location: "Block C · Villa 12" },
  { id: "SNG-217", kind: "Snag", title: "Paint touch-up stair core 2", project: "prj-2", severity: "Minor", status: "Open", owner: "p8", raised: "10 Oct", location: "Clubhouse" },
  { id: "OBS-091", kind: "Observation", title: "Rebar cover below spec at grid C/4", project: "prj-12", severity: "Critical", status: "Open", owner: "p4", raised: "10 Oct", location: "Slab L1 · C/4" },
  { id: "NCR-012", kind: "NCR", title: "Fire stopping not installed at riser", project: "prj-16", severity: "Major", status: "Open", owner: "p6", raised: "12 Oct", location: "Riser R2" },
  { id: "CLH-307", kind: "Clash", title: "Duct vs. beam at L2 corridor", project: "prj-9", severity: "Critical", status: "Open", owner: "p6", raised: "08 Oct", location: "L2 · Grid 4–6" },
  { id: "CLH-305", kind: "Clash", title: "Sprinkler vs. bulkhead — lobby", project: "prj-7", severity: "Major", status: "Responded", owner: "p7", raised: "05 Oct", location: "GF Lobby" },
  { id: "RFI-039", kind: "RFI", title: "Confirm generator foundation loads", project: "prj-12", severity: "Major", status: "Closed", owner: "p4", raised: "22 Sep", location: "External Yard" },
  { id: "SNG-209", kind: "Snag", title: "Ceiling access panel missing", project: "prj-16", severity: "Minor", status: "Closed", owner: "p8", raised: "28 Sep", location: "Corridor 1" },
];

export type Survey = { id: string; project: string; type: string; surveyor: string; date: string; status: "Planned" | "In Field" | "Processing" | "Delivered"; points: number };
export const SURVEYS: Survey[] = [
  { id: "SUR-071", project: "prj-19", type: "Topographic Survey", surveyor: "p12", date: "13–15 Oct", status: "In Field", points: 4820 },
  { id: "SUR-070", project: "prj-25", type: "Measured Building Survey", surveyor: "p12", date: "17 Oct", status: "Planned", points: 0 },
  { id: "SUR-069", project: "prj-28", type: "Boundary & Setting-out", surveyor: "p12", date: "08 Oct", status: "Processing", points: 1260 },
  { id: "SUR-066", project: "prj-21", type: "Laser Scan — Existing Villa", surveyor: "p12", date: "29 Sep", status: "Delivered", points: 2100000 },
  { id: "SUR-064", project: "prj-5", type: "Geotechnical Coordination", surveyor: "p12", date: "22 Sep", status: "Delivered", points: 18 },
  { id: "SUR-061", project: "prj-22", type: "Measured Interior Survey", surveyor: "p12", date: "15 Sep", status: "Delivered", points: 640 },
];

export const CLIENTS = Array.from(new Set(PROJECTS.map((p) => p.client))).map((c, i) => {
  const ps = PROJECTS.filter((p) => p.client === c);
  return {
    name: c, sector: ps[0].type.split(" ")[0], contact: ["Mr. Rashid Al-Kuwari", "Ms. Noura Al-Sulaiti", "Eng. Tariq Mahmoud", "Mr. Hassan Al-Emadi", "Ms. Dana Faraj"][i % 5],
    projects: ps.length, value: ps.reduce((a, p) => a + p.fee, 0), pending: APPROVALS.filter((a) => ps.some((p) => p.id === a.project) && a.status === "Pending").length,
    satisfaction: 72 + ((i * 7) % 26),
  };
});

export type Doc = { id: string; name: string; project: string; kind: "Transmittal" | "Report" | "Specification" | "Minutes" | "Contract" | "Model"; version: string; size: string; updated: string; by: string };
export const DOCS: Doc[] = [
  { id: "D-901", name: "TR-188 Transmittal — IFC Issue", project: "prj-12", kind: "Transmittal", version: "v1", size: "220 KB", updated: "12 Oct", by: "p10" },
  { id: "D-899", name: "Architectural Specification Div. 08", project: "prj-14", kind: "Specification", version: "v4", size: "3.1 MB", updated: "11 Oct", by: "p3" },
  { id: "D-897", name: "Site Visit Report SV-1038", project: "prj-12", kind: "Report", version: "v2", size: "8.4 MB", updated: "10 Oct", by: "p8" },
  { id: "D-894", name: "Design Coordination Minutes #17", project: "prj-9", kind: "Minutes", version: "v1", size: "180 KB", updated: "09 Oct", by: "p7" },
  { id: "D-890", name: "Federated BIM Model", project: "prj-3", kind: "Model", version: "v12", size: "412 MB", updated: "09 Oct", by: "p7" },
  { id: "D-887", name: "Consultancy Agreement — Amendment 2", project: "prj-7", kind: "Contract", version: "v2", size: "640 KB", updated: "07 Oct", by: "p11" },
  { id: "D-881", name: "Fire Strategy Report", project: "prj-17", kind: "Report", version: "v3", size: "5.2 MB", updated: "05 Oct", by: "p7" },
  { id: "D-876", name: "MEP Design Basis Report", project: "prj-3", kind: "Specification", version: "v5", size: "2.8 MB", updated: "03 Oct", by: "p6" },
];

export const ACTIVITY = [
  { who: "p3", what: "issued revision C02 of", target: "AR-0110 Ground Floor Plan", project: "prj-14", when: "8 min ago", kind: "rev" },
  { who: "p1", what: "submitted for client approval", target: "IFC Architecture Package", project: "prj-14", when: "34 min ago", kind: "approval" },
  { who: "p6", what: "flagged a critical clash in", target: "L2 corridor ductwork", project: "prj-9", when: "1 h ago", kind: "issue" },
  { who: "p8", what: "started site visit", target: "SV-1042 Weekly Supervision", project: "prj-11", when: "1 h ago", kind: "site" },
  { who: "p2", what: "approved internal review of", target: "Drainage Schematic", project: "prj-12", when: "2 h ago", kind: "ok" },
  { who: "p10", what: "sent transmittal", target: "TR-188 to Al Jaber Contracting", project: "prj-12", when: "3 h ago", kind: "doc" },
  { who: "p11", what: "raised invoice", target: "INV-2026-0412 · QAR 185,000", project: "prj-3", when: "5 h ago", kind: "fee" },
  { who: "p12", what: "uploaded survey data", target: "SUR-069 Boundary points", project: "prj-28", when: "Yesterday", kind: "survey" },
  { who: "p5", what: "commented on", target: "Interior Material Board", project: "prj-22", when: "Yesterday", kind: "comment" },
];

export const MILESTONES = PROJECTS.slice(0, 10).map((p, i) => ({
  id: `MS-${400 + i}`, project: p.id, name: `${p.stage} Stage Fee`, amount: Math.round(p.fee * 0.15), due: p.nextDate,
  status: (["Invoiced", "Paid", "Due", "Overdue", "Upcoming"] as const)[i % 5],
}));

export const VARIATIONS = [
  { id: "VO-021", project: "prj-7", title: "Additional spa wing design", amount: 380000, status: "Awaiting Client" },
  { id: "VO-019", project: "prj-9", title: "Extra basement level redesign", amount: 520000, status: "Approved" },
  { id: "VO-018", project: "prj-14", title: "Guest villa interior scope", amount: 145000, status: "Draft" },
  { id: "VO-016", project: "prj-3", title: "Isolation ward MEP upgrade", amount: 260000, status: "Approved" },
];

export const NOTIFICATIONS = [
  { title: "Client approval overdue", body: "Façade Mock-up — Katara Boutique Hotel was rejected with comments.", when: "10m", tone: "bad" },
  { title: "Critical clash detected", body: "Duct vs. beam at L2 corridor — West Bay Corporate HQ.", when: "1h", tone: "bad" },
  { title: "Review requested", body: "Omar Haddad requested your review of MEP Coordination Model P03.", when: "2h", tone: "review" },
  { title: "Deadline in 2 days", body: "Civil Defence Submission — Marina Retail Pavilion.", when: "3h", tone: "warn" },
  { title: "Revision issued", body: "AR-0110 Ground Floor Plan revised to C02.", when: "5h", tone: "info" },
  { title: "Invoice paid", body: "INV-2026-0398 · QAR 240,000 received from Rayyan Developments.", when: "1d", tone: "ok" },
];

export const fmtQAR = (n: number) => (n >= 1e6 ? `QAR ${(n / 1e6).toFixed(2)}M` : `QAR ${Math.round(n / 1000)}K`);
