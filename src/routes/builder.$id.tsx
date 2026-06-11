import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useResumes, type ResumeData, type Experience, type Education, type Project, type Certification, type Language, type Reference, type TemplateId } from "@/lib/resume-store";
import { TEMPLATE_OPTIONS, ResumePreview } from "@/components/resume-preview";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Download, Eye, Maximize2, Minimize2,
  Palette, Plus, Printer, Save, Share2, Sparkles, Trash2, Type, User, Briefcase, GraduationCap,
  Award, Globe, FolderKanban, Languages as LangIcon, Users, FileText, Wand2, ZoomIn, ZoomOut, X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/builder/$id")({
  head: () => ({ meta: [{ title: "Editor — Resumai" }, { name: "description", content: "Build your resume with AI assistance." }] }),
  component: () => <AppShell><Builder /></AppShell>,
});

const STEPS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: LangIcon },
  { id: "references", label: "References", icon: Users },
] as const;

const COLORS = ["#2563EB", "#7C3AED", "#06B6D4", "#22C55E", "#F59E0B", "#EF4444", "#0F172A", "#EC4899"];
const FONTS: ResumeData["font"][] = ["Inter", "Sora", "Georgia", "JetBrains Mono"];

function Builder() {
  const { id } = Route.useParams();
  const { getById, update } = useResumes();
  const navigate = useNavigate();
  const data = getById(id);
  const [step, setStep] = useState(0);
  const [zoom, setZoom] = useState(0.6);
  const [previewFull, setPreviewFull] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const lastSave = useRef<number>(Date.now());

  useEffect(() => {
    if (!data) navigate({ to: "/dashboard" });
  }, [data, navigate]);

  // Autosave indicator
  useEffect(() => {
    if (!data) return;
    setSaving(true);
    const t = setTimeout(() => {
      setSaving(false);
      lastSave.current = Date.now();
    }, 400);
    return () => clearTimeout(t);
  }, [data]);

  if (!data) return null;

  const patch = (p: Partial<ResumeData>) => update(id, p);
  const stepKey = STEPS[step].id;

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b bg-card px-4 md:px-6 py-2.5 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/dashboard" })}>
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Dashboard</span>
        </Button>
        <div className="h-5 w-px bg-border" />
        <Input value={data.title} onChange={(e) => patch({ title: e.target.value })}
          className="max-w-[260px] h-8 border-none focus-visible:ring-1 font-semibold" />
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
          <Save className={`h-3.5 w-3.5 ${saving ? "animate-pulse text-primary" : ""}`} />
          {saving ? "Saving…" : "Saved"}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ColorAndFont data={data} patch={patch} />
          <TemplatePicker data={data} patch={patch} />
          <Button variant="outline" size="sm" onClick={() => setShowAI((s) => !s)}>
            <Sparkles className="h-4 w-4 text-secondary" /> <span className="hidden md:inline">AI Assistant</span>
          </Button>
          <ExportMenu data={data} />
        </div>
      </header>

      <div className="flex-1 min-h-0 grid md:grid-cols-[280px_1fr_minmax(0,1fr)] grid-cols-1">
        {/* Steps sidebar */}
        <aside className="hidden md:block border-r bg-card overflow-y-auto p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-2">Sections</p>
          <nav className="space-y-1">
            {STEPS.map((s, i) => {
              const completed = isComplete(data, s.id);
              const active = step === i;
              return (
                <button key={s.id} onClick={() => setStep(i)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    active ? "bg-gradient-primary text-white shadow-glow" : "hover:bg-muted text-foreground"
                  }`}>
                  <s.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{s.label}</span>
                  {completed && <Check className={`h-3.5 w-3.5 ${active ? "text-white" : "text-success"}`} />}
                </button>
              );
            })}
          </nav>
          <ProgressBar value={completionPct(data)} className="mt-5" />
        </aside>

        {/* Editor */}
        <section className="overflow-y-auto bg-muted/30 p-5 md:p-8">
          {/* Step indicator (mobile) */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}><ChevronLeft className="h-4 w-4" /></Button>
            <select value={step} onChange={(e) => setStep(Number(e.target.value))} className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium">
              {STEPS.map((s, i) => <option key={s.id} value={i}>{i + 1}. {s.label}</option>)}
            </select>
            <Button variant="ghost" size="sm" onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={stepKey}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl mx-auto"
            >
              <StepHeader step={step} />
              {stepKey === "personal" && <PersonalForm data={data} patch={patch} />}
              {stepKey === "summary" && <SummaryForm data={data} patch={patch} />}
              {stepKey === "experience" && <ExperienceForm data={data} patch={patch} />}
              {stepKey === "education" && <EducationForm data={data} patch={patch} />}
              {stepKey === "skills" && <SkillsForm data={data} patch={patch} />}
              {stepKey === "projects" && <ProjectsForm data={data} patch={patch} />}
              {stepKey === "certifications" && <CertificationsForm data={data} patch={patch} />}
              {stepKey === "languages" && <LanguagesForm data={data} patch={patch} />}
              {stepKey === "references" && <ReferencesForm data={data} patch={patch} />}
            </motion.div>
          </AnimatePresence>

          {/* Step nav */}
          <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="hero" onClick={() => setStep(step + 1)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={() => toast.success("Resume ready! 🎉")}>
                Finish <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </section>

        {/* Live preview */}
        <section className="hidden md:flex flex-col bg-muted/40 border-l">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> Live preview
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))} className="p-1.5 rounded hover:bg-muted"><ZoomOut className="h-4 w-4" /></button>
              <span className="text-xs tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))} className="p-1.5 rounded hover:bg-muted"><ZoomIn className="h-4 w-4" /></button>
              <div className="h-4 w-px bg-border mx-1" />
              <button onClick={() => setPreviewFull(true)} className="p-1.5 rounded hover:bg-muted" title="Full screen"><Maximize2 className="h-4 w-4" /></button>
              <button onClick={() => window.print()} className="p-1.5 rounded hover:bg-muted" title="Print"><Printer className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6 grid place-items-start">
            <div style={{ width: 816 * zoom, height: 1056 * zoom }} className="relative">
              <div className="absolute inset-0 origin-top-left" style={{ transform: `scale(${zoom})` }}>
                <ResumePreview data={data} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {showAI && <AIAssistant data={data} patch={patch} onClose={() => setShowAI(false)} stepKey={stepKey} />}
      </AnimatePresence>

      {/* Full screen preview */}
      <AnimatePresence>
        {previewFull && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm grid place-items-center p-6 overflow-auto"
            onClick={() => setPreviewFull(false)}
          >
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white" onClick={() => setPreviewFull(false)}><X className="h-5 w-5" /></button>
            <div onClick={(e) => e.stopPropagation()}>
              <ResumePreview data={data} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepHeader({ step }: { step: number }) {
  const s = STEPS[step];
  return (
    <div className="mb-6">
      <p className="text-xs font-medium text-primary">Step {step + 1} of {STEPS.length}</p>
      <h2 className="text-2xl font-bold tracking-tight mt-1">{s.label}</h2>
    </div>
  );
}

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={className}>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5"><span>Completion</span><span>{value}%</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full bg-gradient-primary" initial={{ width: 0 }} animate={{ width: value + "%" }} transition={{ duration: 0.6 }} />
      </div>
    </div>
  );
}

function completionPct(d: ResumeData) {
  const total = STEPS.length;
  const done = STEPS.filter((s) => isComplete(d, s.id)).length;
  return Math.round((done / total) * 100);
}
function isComplete(d: ResumeData, key: string) {
  switch (key) {
    case "personal": return !!(d.personal.fullName && d.personal.email);
    case "summary": return d.summary.length > 20;
    case "experience": return d.experience.length > 0;
    case "education": return d.education.length > 0;
    case "skills": return d.skills.length > 0;
    case "projects": return d.projects.length > 0;
    case "certifications": return d.certifications.length > 0;
    case "languages": return d.languages.length > 0;
    case "references": return d.references.length > 0;
  }
  return false;
}

// ------------ Forms ------------

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card p-5 md:p-6 shadow-soft ${className}`}>{children}</div>;
}

function PersonalForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const p = data.personal;
  const set = (k: keyof typeof p, v: string) => patch({ personal: { ...p, [k]: v } });
  return (
    <Card>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Full name"><Input value={p.fullName} onChange={(e) => set("fullName", e.target.value)} /></FormField>
        <FormField label="Role"><Input value={p.role} onChange={(e) => set("role", e.target.value)} /></FormField>
        <FormField label="Email"><Input type="email" value={p.email} onChange={(e) => set("email", e.target.value)} /></FormField>
        <FormField label="Phone"><Input value={p.phone} onChange={(e) => set("phone", e.target.value)} /></FormField>
        <FormField label="Location"><Input value={p.location} onChange={(e) => set("location", e.target.value)} /></FormField>
        <FormField label="Website"><Input value={p.website} onChange={(e) => set("website", e.target.value)} /></FormField>
        <FormField label="LinkedIn" className="sm:col-span-2"><Input value={p.linkedin} onChange={(e) => set("linkedin", e.target.value)} /></FormField>
      </div>
    </Card>
  );
}

function SummaryForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  return (
    <Card>
      <FormField label="Professional summary" hint="3-5 sentences. Lead with your strongest impact.">
        <Textarea rows={6} value={data.summary} onChange={(e) => patch({ summary: e.target.value })} placeholder="Senior engineer with 8+ years building..." />
      </FormField>
      <Button variant="outline" size="sm" className="mt-3" onClick={() => {
        const generated = generateSummary(data);
        patch({ summary: generated });
        toast.success("AI summary generated");
      }}>
        <Wand2 className="h-4 w-4 text-secondary" /> Generate with AI
      </Button>
    </Card>
  );
}

function ExperienceForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const add = () => patch({ experience: [...data.experience, { id: crypto.randomUUID(), title: "", company: "", start: "", end: "", description: "" }] });
  const upd = (id: string, p: Partial<Experience>) => patch({ experience: data.experience.map((e) => (e.id === id ? { ...e, ...p } : e)) });
  const rm = (id: string) => patch({ experience: data.experience.filter((e) => e.id !== id) });
  return (
    <div className="space-y-4">
      {data.experience.map((e) => (
        <Card key={e.id}>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Title"><Input value={e.title} onChange={(ev) => upd(e.id, { title: ev.target.value })} /></FormField>
            <FormField label="Company"><Input value={e.company} onChange={(ev) => upd(e.id, { company: ev.target.value })} /></FormField>
            <FormField label="Location"><Input value={e.location ?? ""} onChange={(ev) => upd(e.id, { location: ev.target.value })} /></FormField>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Start"><Input value={e.start} onChange={(ev) => upd(e.id, { start: ev.target.value })} /></FormField>
              <FormField label="End"><Input value={e.end} onChange={(ev) => upd(e.id, { end: ev.target.value })} disabled={e.current} /></FormField>
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={!!e.current} onChange={(ev) => upd(e.id, { current: ev.target.checked, end: ev.target.checked ? "Present" : "" })} />
              I currently work here
            </label>
            <FormField label="Description" hint="One bullet per line. Quantify impact." className="sm:col-span-2">
              <Textarea rows={4} value={e.description} onChange={(ev) => upd(e.id, { description: ev.target.value })} />
            </FormField>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Button size="sm" variant="outline" onClick={() => upd(e.id, { description: improveBullets(e.description || "Built and shipped product features for a fast-growing startup.") })}>
              <Wand2 className="h-4 w-4 text-secondary" /> Improve bullets
            </Button>
            <Button size="sm" variant="ghost" onClick={() => rm(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add experience</Button>
    </div>
  );
}

function EducationForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const add = () => patch({ education: [...data.education, { id: crypto.randomUUID(), school: "", degree: "", start: "", end: "" }] });
  const upd = (id: string, p: Partial<Education>) => patch({ education: data.education.map((e) => (e.id === id ? { ...e, ...p } : e)) });
  const rm = (id: string) => patch({ education: data.education.filter((e) => e.id !== id) });
  return (
    <div className="space-y-4">
      {data.education.map((e) => (
        <Card key={e.id}>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="School"><Input value={e.school} onChange={(ev) => upd(e.id, { school: ev.target.value })} /></FormField>
            <FormField label="Degree"><Input value={e.degree} onChange={(ev) => upd(e.id, { degree: ev.target.value })} /></FormField>
            <FormField label="Field of study"><Input value={e.field ?? ""} onChange={(ev) => upd(e.id, { field: ev.target.value })} /></FormField>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Start"><Input value={e.start} onChange={(ev) => upd(e.id, { start: ev.target.value })} /></FormField>
              <FormField label="End"><Input value={e.end} onChange={(ev) => upd(e.id, { end: ev.target.value })} /></FormField>
            </div>
          </div>
          <div className="mt-3 flex justify-end"><Button size="sm" variant="ghost" onClick={() => rm(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add education</Button>
    </div>
  );
}

function SkillsForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const [input, setInput] = useState("");
  const add = (v: string) => {
    const s = v.trim();
    if (!s || data.skills.includes(s)) return;
    patch({ skills: [...data.skills, s] });
    setInput("");
  };
  return (
    <Card>
      <FormField label="Skills" hint="Press Enter to add. Keep them specific.">
        <Input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. TypeScript"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(input); } }} />
      </FormField>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.skills.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-soft border px-3 py-1 text-xs font-medium">
            {s}
            <button onClick={() => patch({ skills: data.skills.filter((x) => x !== s) })} className="text-muted-foreground hover:text-destructive">×</button>
          </span>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-4" onClick={() => {
        const suggestions = suggestSkills(data);
        const merged = Array.from(new Set([...data.skills, ...suggestions]));
        patch({ skills: merged });
        toast.success("AI added " + suggestions.length + " skills");
      }}>
        <Wand2 className="h-4 w-4 text-secondary" /> Suggest with AI
      </Button>
    </Card>
  );
}

function ProjectsForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const add = () => patch({ projects: [...data.projects, { id: crypto.randomUUID(), name: "", description: "" }] });
  const upd = (id: string, p: Partial<Project>) => patch({ projects: data.projects.map((e) => (e.id === id ? { ...e, ...p } : e)) });
  const rm = (id: string) => patch({ projects: data.projects.filter((e) => e.id !== id) });
  return (
    <div className="space-y-4">
      {data.projects.map((p) => (
        <Card key={p.id}>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Name"><Input value={p.name} onChange={(e) => upd(p.id, { name: e.target.value })} /></FormField>
            <FormField label="Link"><Input value={p.link ?? ""} onChange={(e) => upd(p.id, { link: e.target.value })} /></FormField>
            <FormField label="Description" className="sm:col-span-2"><Textarea rows={3} value={p.description} onChange={(e) => upd(p.id, { description: e.target.value })} /></FormField>
          </div>
          <div className="mt-3 flex justify-end"><Button size="sm" variant="ghost" onClick={() => rm(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add project</Button>
    </div>
  );
}

function CertificationsForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const add = () => patch({ certifications: [...data.certifications, { id: crypto.randomUUID(), name: "", issuer: "", date: "" }] });
  const upd = (id: string, p: Partial<Certification>) => patch({ certifications: data.certifications.map((e) => (e.id === id ? { ...e, ...p } : e)) });
  const rm = (id: string) => patch({ certifications: data.certifications.filter((e) => e.id !== id) });
  return (
    <div className="space-y-4">
      {data.certifications.map((c) => (
        <Card key={c.id}>
          <div className="grid sm:grid-cols-3 gap-3">
            <FormField label="Name"><Input value={c.name} onChange={(e) => upd(c.id, { name: e.target.value })} /></FormField>
            <FormField label="Issuer"><Input value={c.issuer} onChange={(e) => upd(c.id, { issuer: e.target.value })} /></FormField>
            <FormField label="Date"><Input value={c.date} onChange={(e) => upd(c.id, { date: e.target.value })} /></FormField>
          </div>
          <div className="mt-3 flex justify-end"><Button size="sm" variant="ghost" onClick={() => rm(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add certification</Button>
    </div>
  );
}

function LanguagesForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const add = () => patch({ languages: [...data.languages, { id: crypto.randomUUID(), name: "", level: "Professional" }] });
  const upd = (id: string, p: Partial<Language>) => patch({ languages: data.languages.map((e) => (e.id === id ? { ...e, ...p } : e)) });
  const rm = (id: string) => patch({ languages: data.languages.filter((e) => e.id !== id) });
  return (
    <div className="space-y-4">
      {data.languages.map((l) => (
        <Card key={l.id}>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Language"><Input value={l.name} onChange={(e) => upd(l.id, { name: e.target.value })} /></FormField>
            <FormField label="Level">
              <select value={l.level} onChange={(e) => upd(l.id, { level: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                {["Native", "Fluent", "Professional", "Conversational", "Basic"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </FormField>
          </div>
          <div className="mt-3 flex justify-end"><Button size="sm" variant="ghost" onClick={() => rm(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add language</Button>
    </div>
  );
}

function ReferencesForm({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const add = () => patch({ references: [...data.references, { id: crypto.randomUUID(), name: "", role: "", contact: "" }] });
  const upd = (id: string, p: Partial<Reference>) => patch({ references: data.references.map((e) => (e.id === id ? { ...e, ...p } : e)) });
  const rm = (id: string) => patch({ references: data.references.filter((e) => e.id !== id) });
  return (
    <div className="space-y-4">
      {data.references.map((r) => (
        <Card key={r.id}>
          <div className="grid sm:grid-cols-3 gap-3">
            <FormField label="Name"><Input value={r.name} onChange={(e) => upd(r.id, { name: e.target.value })} /></FormField>
            <FormField label="Role"><Input value={r.role} onChange={(e) => upd(r.id, { role: e.target.value })} /></FormField>
            <FormField label="Contact"><Input value={r.contact} onChange={(e) => upd(r.id, { contact: e.target.value })} /></FormField>
          </div>
          <div className="mt-3 flex justify-end"><Button size="sm" variant="ghost" onClick={() => rm(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add reference</Button>
    </div>
  );
}

function FormField({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label className="text-xs font-medium">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ------- Top bar bits -------

function ColorAndFont({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
        <Palette className="h-4 w-4" /> <span className="hidden md:inline">Style</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-64 rounded-xl border bg-card shadow-elegant p-4">
          <p className="text-xs font-semibold mb-2">Accent color</p>
          <div className="grid grid-cols-8 gap-2">
            {COLORS.map((c) => (
              <button key={c} onClick={() => patch({ accentColor: c })}
                className={`h-7 w-7 rounded-full border-2 transition-all ${data.accentColor === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "border-white"}`}
                style={{ background: c }} aria-label={c} />
            ))}
          </div>
          <p className="text-xs font-semibold mt-4 mb-2">Font</p>
          <div className="grid grid-cols-2 gap-2">
            {FONTS.map((f) => (
              <button key={f} onClick={() => patch({ font: f })}
                className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all ${data.font === f ? "bg-gradient-primary text-white border-transparent" : "hover:border-primary/40"}`}
                style={{ fontFamily: f }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TemplatePicker({ data, patch }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
        <Type className="h-4 w-4" /> <span className="hidden md:inline">{TEMPLATE_OPTIONS.find((t) => t.id === data.template)?.name}</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-56 rounded-xl border bg-card shadow-elegant p-2">
          {TEMPLATE_OPTIONS.map((t) => (
            <button key={t.id} onClick={() => { patch({ template: t.id as TemplateId }); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${data.template === t.id ? "bg-gradient-primary text-white" : "hover:bg-muted"}`}>
              {data.template === t.id && <Check className="h-3.5 w-3.5" />} {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportMenu({ data }: { data: ResumeData }) {
  const [open, setOpen] = useState(false);
  const share = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied to clipboard"));
  };
  return (
    <div className="relative">
      <Button variant="hero" size="sm" onClick={() => setOpen((o) => !o)}>
        <Download className="h-4 w-4" /> <span className="hidden md:inline">Export</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-52 rounded-xl border bg-card shadow-elegant p-1.5">
          {[
            { label: "Download PDF", icon: Download, onClick: () => { window.print(); setOpen(false); } },
            { label: "Download DOCX", icon: FileText, onClick: () => { exportDocx(data); setOpen(false); } },
            { label: "Print", icon: Printer, onClick: () => { window.print(); setOpen(false); } },
            { label: "Share link", icon: Share2, onClick: () => { share(); setOpen(false); } },
          ].map((a) => (
            <button key={a.label} onClick={a.onClick}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted">
              <a.icon className="h-4 w-4" /> {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ------- AI Assistant -------

function AIAssistant({ data, patch, onClose, stepKey }: { data: ResumeData; patch: (p: Partial<ResumeData>) => void; onClose: () => void; stepKey: string }) {
  const [jd, setJd] = useState("");
  const actions = [
    { icon: Sparkles, label: "Generate professional summary", run: () => patch({ summary: generateSummary(data) }) },
    { icon: Wand2, label: "Improve experience bullets", run: () => patch({ experience: data.experience.map((e) => ({ ...e, description: improveBullets(e.description) })) }) },
    { icon: Plus, label: "Suggest skills", run: () => patch({ skills: Array.from(new Set([...data.skills, ...suggestSkills(data)])) }) },
    { icon: Check, label: "ATS optimization tips", run: () => toast.message("Use exact keywords from the JD, avoid columns/images for ATS template.") },
    { icon: Type, label: "Grammar polish", run: () => patch({ summary: data.summary.replace(/\s+/g, " ").trim() }) },
  ];
  const matchJD = () => {
    if (!jd.trim()) return toast.error("Paste a job description first");
    const keywords = extractKeywords(jd);
    const newSkills = keywords.filter((k) => !data.skills.includes(k));
    patch({ skills: [...data.skills, ...newSkills] });
    toast.success(`Matched ${newSkills.length} keywords to your resume`);
  };
  return (
    <motion.aside
      initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
      className="fixed top-0 right-0 bottom-0 z-40 w-full sm:w-96 bg-card border-l shadow-elegant flex flex-col"
    >
      <div className="p-5 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-sm">AI Assistant</p>
            <p className="text-[11px] text-muted-foreground">Editing: {stepKey}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold mb-2">Quick actions</p>
          <div className="space-y-2">
            {actions.map((a) => (
              <button key={a.label} onClick={() => { a.run(); toast.success(a.label); }}
                className="w-full text-left flex items-center gap-3 rounded-xl border bg-card hover:border-primary/50 hover:bg-muted/50 px-3.5 py-3 text-sm transition-all">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-soft">
                  <a.icon className="h-4 w-4 text-secondary" />
                </div>
                <span className="flex-1">{a.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-gradient-soft p-4">
          <p className="text-xs font-semibold mb-1.5">Match job description</p>
          <p className="text-[11px] text-muted-foreground mb-2">Paste a JD and we'll add missing keywords as skills.</p>
          <Textarea rows={5} placeholder="Paste job description..." value={jd} onChange={(e) => setJd(e.target.value)} />
          <Button variant="hero" size="sm" className="mt-3 w-full" onClick={matchJD}>
            <Wand2 className="h-4 w-4" /> Match keywords
          </Button>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs font-semibold mb-1.5">Resume health</p>
          <ProgressBar value={completionPct(data)} />
          <ul className="mt-3 space-y-1.5 text-xs">
            <Health ok={!!data.summary} label="Has summary" />
            <Health ok={data.experience.length > 0} label="Has experience" />
            <Health ok={data.skills.length >= 5} label="5+ skills listed" />
            <Health ok={data.experience.some((e) => /\d/.test(e.description))} label="Bullets include numbers" />
          </ul>
        </div>
      </div>
    </motion.aside>
  );
}
function Health({ ok, label }: { ok: boolean; label: string }) {
  return <li className="flex items-center gap-2"><Check className={`h-3.5 w-3.5 ${ok ? "text-success" : "text-muted-foreground/40"}`} /> {label}</li>;
}

// ------- Heuristic "AI" helpers (client-side, no API needed) -------

function generateSummary(d: ResumeData) {
  const role = d.personal.role || "professional";
  const years = d.experience.length ? d.experience.length * 3 + "+" : "5+";
  const top = d.skills.slice(0, 4).join(", ") || "modern technologies";
  return `${role} with ${years} years driving measurable impact across high-growth teams. Expertise in ${top}. Known for shipping with speed, clear written communication, and a relentless focus on user outcomes.`;
}
function improveBullets(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.map((l) => {
    if (!l) return l;
    let out = l.replace(/^(worked on|helped|was responsible for|did)/i, "Led");
    if (!/^[A-Z]/.test(out)) out = out[0].toUpperCase() + out.slice(1);
    if (!/[.!]$/.test(out)) out += ".";
    if (!/\d/.test(out)) out = out.replace(/\.$/, ", driving 20%+ improvement.");
    return out;
  }).join("\n");
}
function suggestSkills(d: ResumeData) {
  const role = (d.personal.role || "").toLowerCase();
  const base = ["Communication", "Leadership", "Problem solving", "Project management"];
  if (role.includes("engineer") || role.includes("developer")) return ["TypeScript", "React", "Node.js", "AWS", "CI/CD", "Testing"];
  if (role.includes("design")) return ["Figma", "Prototyping", "Design Systems", "User Research"];
  if (role.includes("product")) return ["Roadmapping", "OKRs", "A/B Testing", "Analytics", "Stakeholder Management"];
  if (role.includes("market")) return ["SEO", "Content Strategy", "Analytics", "HubSpot", "Brand"];
  return base;
}
function extractKeywords(text: string) {
  const stop = new Set(["the","and","for","with","you","your","our","are","will","that","this","from","have","experience","work"]);
  const counts = new Map<string, number>();
  text.toLowerCase().match(/\b[a-z][a-z+#.]{2,}\b/g)?.forEach((w) => { if (!stop.has(w)) counts.set(w, (counts.get(w) || 0) + 1); });
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0, 8).map(([w]) => w[0].toUpperCase() + w.slice(1));
}

function exportDocx(data: ResumeData) {
  // Lightweight HTML-based docx (Word opens .doc HTML)
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${data.title}</title></head><body>
    <h1>${data.personal.fullName}</h1><p><b>${data.personal.role}</b></p>
    <p>${[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(" · ")}</p>
    <h2>Summary</h2><p>${data.summary}</p>
    <h2>Experience</h2>${data.experience.map(e => `<p><b>${e.title}</b> — ${e.company} (${e.start}–${e.current?"Present":e.end})</p><ul>${e.description.split("\n").filter(Boolean).map(b => `<li>${b}</li>`).join("")}</ul>`).join("")}
    <h2>Education</h2>${data.education.map(e => `<p><b>${e.degree}</b>, ${e.field ?? ""} — ${e.school} (${e.end})</p>`).join("")}
    <h2>Skills</h2><p>${data.skills.join(", ")}</p>
  </body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${data.title.replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast.success("Downloaded DOCX");
}
