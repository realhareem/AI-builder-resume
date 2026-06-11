import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TemplateId =
  | "modern"
  | "corporate"
  | "executive"
  | "creative"
  | "minimal"
  | "ats"
  | "developer"
  | "designer";

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  current?: boolean;
  description: string;
}
export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string;
  start: string;
  end: string;
  description?: string;
}
export interface Project {
  id: string;
  name: string;
  link?: string;
  description: string;
}
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}
export interface Language {
  id: string;
  name: string;
  level: string;
}
export interface Reference {
  id: string;
  name: string;
  role: string;
  contact: string;
}

export interface ResumeData {
  id: string;
  title: string;
  template: TemplateId;
  accentColor: string;
  font: "Inter" | "Sora" | "Georgia" | "JetBrains Mono";
  updatedAt: number;
  personal: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    photo?: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  references: Reference[];
}

const STORAGE_KEY = "resumai.resumes.v1";
const ACTIVE_KEY = "resumai.active.v1";

export const defaultResume = (overrides: Partial<ResumeData> = {}): ResumeData => ({
  id: crypto.randomUUID(),
  title: "Untitled Resume",
  template: "modern",
  accentColor: "#2563EB",
  font: "Inter",
  updatedAt: Date.now(),
  personal: {
    fullName: "hareem fatima",
    role: "Senior Product Designer",
    email: "fati.design",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "fati.design",
    linkedin: "linkedin.com/in/fati",
  },
  summary:
    "Product designer with 8+ years crafting intuitive, business-driving experiences for SaaS and fintech. Led design systems used by 200+ engineers; shipped flagship products to 5M+ users.",
  experience: [
    {
      id: crypto.randomUUID(),
      title: "Senior Product Designer",
      company: "Northwind",
      location: "Remote",
      start: "2022",
      end: "Present",
      current: true,
      description:
        "Led redesign of flagship dashboard, lifting activation by 34%.\nBuilt a cross-platform design system adopted by 12 squads.\nMentored 5 designers; ran weekly critique improving shipped quality.",
    },
    {
      id: crypto.randomUUID(),
      title: "Product Designer",
      company: "Zenith Labs",
      location: "New York, NY",
      start: "2019",
      end: "2022",
      description:
        "Owned end-to-end design for B2B analytics suite ($12M ARR).\nPartnered with PM and eng to ship 30+ features with 95% on-time delivery.",
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      school: "Rhode Island School of Design",
      degree: "BFA",
      field: "Graphic Design",
      start: "2013",
      end: "2017",
    },
  ],
  skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Accessibility", "Motion", "React", "Tailwind CSS"],
  projects: [
    {
      id: crypto.randomUUID(),
      name: "fati Design System",
      link: "fati.design",
      description: "Open-source design system used by 8k+ teams; 1.2k GitHub stars.",
    },
  ],
  certifications: [
    { id: crypto.randomUUID(), name: "NN/g UX Certification", issuer: "Nielsen Norman Group", date: "2021" },
  ],
  languages: [
    { id: crypto.randomUUID(), name: "English", level: "Native" },
    { id: crypto.randomUUID(), name: "Spanish", level: "Professional" },
  ],
  references: [],
  ...overrides,
});

interface ResumeStore {
  resumes: ResumeData[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  create: () => ResumeData;
  update: (id: string, patch: Partial<ResumeData>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  getById: (id: string) => ResumeData | undefined;
}

const ResumeContext = createContext<ResumeStore | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setResumes(JSON.parse(raw));
      else {
        const seed = [defaultResume({ title: "Product Designer Resume" })];
        setResumes(seed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
      const a = localStorage.getItem(ACTIVE_KEY);
      if (a) setActiveId(a);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes)); } catch {}
  }, [resumes]);
  useEffect(() => {
    try {
      if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch {}
  }, [activeId]);

  const create = () => {
    const r = defaultResume({ title: "New Resume" });
    setResumes((p) => [r, ...p]);
    setActiveId(r.id);
    return r;
  };
  const update = (id: string, patch: Partial<ResumeData>) =>
    setResumes((p) => p.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r)));
  const remove = (id: string) => setResumes((p) => p.filter((r) => r.id !== id));
  const duplicate = (id: string) => {
    setResumes((p) => {
      const r = p.find((x) => x.id === id);
      if (!r) return p;
      return [{ ...r, id: crypto.randomUUID(), title: r.title + " (copy)", updatedAt: Date.now() }, ...p];
    });
  };
  const getById = (id: string) => resumes.find((r) => r.id === id);

  return (
    <ResumeContext.Provider value={{ resumes, activeId, setActiveId, create, update, remove, duplicate, getById }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumes() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResumes must be used inside ResumeProvider");
  return ctx;
}
