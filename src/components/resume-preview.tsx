import * as React from "react";
import type { ResumeData, TemplateId } from "@/lib/resume-store";
import { Mail, Phone, Globe, Linkedin, MapPin } from "lucide-react";

interface Props {
  data: ResumeData;
  scale?: number;
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent + "33" }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Bullets({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  return (
    <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[12px] leading-snug text-slate-700">
      {lines.map((l, i) => <li key={i}>{l}</li>)}
    </ul>
  );
}

// ---------- Templates ----------

function ModernTemplate({ data }: { data: ResumeData }) {
  const a = data.accentColor;
  return (
    <div className="h-full w-full p-10 text-slate-900" style={{ fontFamily: data.font }}>
      <header className="flex items-end justify-between border-b pb-4" style={{ borderColor: a }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data.personal.fullName}</h1>
          <p className="text-sm mt-1" style={{ color: a }}>{data.personal.role}</p>
        </div>
        <div className="text-[11px] text-slate-600 text-right space-y-0.5">
          {data.personal.email && <div className="flex items-center gap-1.5 justify-end"><Mail className="h-3 w-3" />{data.personal.email}</div>}
          {data.personal.phone && <div className="flex items-center gap-1.5 justify-end"><Phone className="h-3 w-3" />{data.personal.phone}</div>}
          {data.personal.location && <div className="flex items-center gap-1.5 justify-end"><MapPin className="h-3 w-3" />{data.personal.location}</div>}
          {data.personal.website && <div className="flex items-center gap-1.5 justify-end"><Globe className="h-3 w-3" />{data.personal.website}</div>}
          {data.personal.linkedin && <div className="flex items-center gap-1.5 justify-end"><Linkedin className="h-3 w-3" />{data.personal.linkedin}</div>}
        </div>
      </header>
      <div className="mt-5">
        {data.summary && <Section title="Summary" accent={a}><p className="text-[12px] leading-relaxed text-slate-700">{data.summary}</p></Section>}
        {data.experience.length > 0 && (
          <Section title="Experience" accent={a}>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between text-[12.5px]">
                  <p className="font-semibold">{e.title} <span className="font-normal text-slate-600">· {e.company}</span></p>
                  <p className="text-slate-500 text-[11px]">{e.start} – {e.current ? "Present" : e.end}</p>
                </div>
                {e.location && <p className="text-[11px] text-slate-500">{e.location}</p>}
                <Bullets text={e.description} />
              </div>
            ))}
          </Section>
        )}
        <div className="grid grid-cols-2 gap-6">
          <div>
            {data.education.length > 0 && (
              <Section title="Education" accent={a}>
                {data.education.map((ed) => (
                  <div key={ed.id} className="mb-2 text-[12px]">
                    <p className="font-semibold">{ed.degree}{ed.field && `, ${ed.field}`}</p>
                    <p className="text-slate-600">{ed.school} · {ed.start}–{ed.end}</p>
                  </div>
                ))}
              </Section>
            )}
            {data.projects.length > 0 && (
              <Section title="Projects" accent={a}>
                {data.projects.map((p) => (
                  <div key={p.id} className="mb-2 text-[12px]">
                    <p className="font-semibold">{p.name}{p.link && <span className="font-normal text-slate-500"> · {p.link}</span>}</p>
                    <p className="text-slate-700">{p.description}</p>
                  </div>
                ))}
              </Section>
            )}
          </div>
          <div>
            {data.skills.length > 0 && (
              <Section title="Skills" accent={a}>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: a + "1a", color: a }}>{s}</span>
                  ))}
                </div>
              </Section>
            )}
            {data.certifications.length > 0 && (
              <Section title="Certifications" accent={a}>
                {data.certifications.map((c) => (
                  <p key={c.id} className="text-[12px]"><span className="font-semibold">{c.name}</span> — {c.issuer}, {c.date}</p>
                ))}
              </Section>
            )}
            {data.languages.length > 0 && (
              <Section title="Languages" accent={a}>
                <div className="text-[12px] text-slate-700">
                  {data.languages.map((l) => l.name + " (" + l.level + ")").join(" · ")}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CorporateTemplate({ data }: { data: ResumeData }) {
  const a = data.accentColor;
  return (
    <div className="h-full w-full text-slate-900" style={{ fontFamily: data.font }}>
      <div className="px-10 py-7 text-white" style={{ background: a }}>
        <h1 className="text-2xl font-bold tracking-tight">{data.personal.fullName}</h1>
        <p className="text-sm opacity-90">{data.personal.role}</p>
        <div className="mt-2 text-[11px] flex flex-wrap gap-x-3 gap-y-0.5 opacity-90">
          <span>{data.personal.email}</span><span>{data.personal.phone}</span>
          <span>{data.personal.location}</span><span>{data.personal.linkedin}</span>
        </div>
      </div>
      <div className="p-10">
        {data.summary && <Section title="Profile" accent={a}><p className="text-[12px] leading-relaxed text-slate-700">{data.summary}</p></Section>}
        {data.experience.map((e) => (
          <div key={e.id} className="mb-3">
            <div className="flex justify-between text-[12.5px]">
              <p className="font-semibold">{e.company} — {e.title}</p>
              <p className="text-slate-500 text-[11px]">{e.start} – {e.current ? "Present" : e.end}</p>
            </div>
            <Bullets text={e.description} />
          </div>
        ))}
        {data.education.length > 0 && (
          <Section title="Education" accent={a}>
            {data.education.map((ed) => (
              <p key={ed.id} className="text-[12px]"><span className="font-semibold">{ed.degree}</span>{ed.field && `, ${ed.field}`} — {ed.school} ({ed.start}–{ed.end})</p>
            ))}
          </Section>
        )}
        {data.skills.length > 0 && (
          <Section title="Skills" accent={a}>
            <p className="text-[12px] text-slate-700">{data.skills.join(" · ")}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  const a = data.accentColor;
  return (
    <div className="h-full w-full p-12 text-slate-900" style={{ fontFamily: data.font }}>
      <h1 className="text-4xl font-light tracking-tight">{data.personal.fullName}</h1>
      <p className="text-sm text-slate-500 mt-1">{data.personal.role}</p>
      <p className="text-[11px] text-slate-500 mt-2">{[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join("  ·  ")}</p>
      <div className="h-px my-6 bg-slate-200" />
      {data.summary && <p className="text-[12px] leading-relaxed text-slate-700 mb-6">{data.summary}</p>}
      {data.experience.map((e) => (
        <div key={e.id} className="mb-4">
          <div className="flex justify-between text-[12.5px]">
            <p className="font-medium">{e.title}, {e.company}</p>
            <p className="text-slate-500 text-[11px]">{e.start}–{e.current ? "Now" : e.end}</p>
          </div>
          <Bullets text={e.description} />
        </div>
      ))}
      {data.skills.length > 0 && (
        <>
          <div className="h-px my-4 bg-slate-200" />
          <p className="text-[12px] text-slate-700"><span className="font-medium" style={{ color: a }}>Skills · </span>{data.skills.join(", ")}</p>
        </>
      )}
    </div>
  );
}

function CreativeTemplate({ data }: { data: ResumeData }) {
  const a = data.accentColor;
  return (
    <div className="h-full w-full grid grid-cols-3 text-slate-900" style={{ fontFamily: data.font }}>
      <aside className="col-span-1 p-8 text-white" style={{ background: `linear-gradient(160deg, ${a}, #0F172A)` }}>
        <div className="h-20 w-20 rounded-2xl bg-white/15 grid place-items-center text-2xl font-bold mb-4">
          {data.personal.fullName.split(" ").map(s=>s[0]).slice(0,2).join("")}
        </div>
        <h1 className="text-xl font-bold leading-tight">{data.personal.fullName}</h1>
        <p className="text-[12px] opacity-90 mb-5">{data.personal.role}</p>
        <div className="space-y-1.5 text-[11px] opacity-90">
          <div>{data.personal.email}</div><div>{data.personal.phone}</div>
          <div>{data.personal.location}</div><div>{data.personal.linkedin}</div>
        </div>
        {data.skills.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => <span key={s} className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/15">{s}</span>)}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2">Languages</p>
            {data.languages.map((l) => <p key={l.id} className="text-[11px]">{l.name} <span className="opacity-70">— {l.level}</span></p>)}
          </div>
        )}
      </aside>
      <main className="col-span-2 p-8">
        {data.summary && <Section title="About" accent={a}><p className="text-[12px] leading-relaxed text-slate-700">{data.summary}</p></Section>}
        <Section title="Experience" accent={a}>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between text-[12.5px]">
                <p className="font-semibold">{e.title} · <span className="font-normal">{e.company}</span></p>
                <p className="text-slate-500 text-[11px]">{e.start}–{e.current?"Now":e.end}</p>
              </div>
              <Bullets text={e.description} />
            </div>
          ))}
        </Section>
        {data.projects.length > 0 && (
          <Section title="Projects" accent={a}>
            {data.projects.map((p) => (
              <div key={p.id} className="mb-1.5 text-[12px]">
                <span className="font-semibold">{p.name}</span> — <span className="text-slate-600">{p.description}</span>
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const a = data.accentColor;
  return (
    <div className="h-full w-full p-10 text-slate-900" style={{ fontFamily: "Georgia, serif" }}>
      <div className="text-center border-b-2 pb-4" style={{ borderColor: a }}>
        <h1 className="text-3xl font-bold tracking-wide uppercase">{data.personal.fullName}</h1>
        <p className="text-[13px] mt-1" style={{ color: a }}>{data.personal.role}</p>
        <p className="text-[11px] text-slate-500 mt-1">{[data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin].filter(Boolean).join(" · ")}</p>
      </div>
      {data.summary && <Section title="Executive Summary" accent={a}><p className="text-[12px] leading-relaxed text-slate-700">{data.summary}</p></Section>}
      <Section title="Professional Experience" accent={a}>
        {data.experience.map((e) => (
          <div key={e.id} className="mb-3">
            <div className="flex justify-between text-[12.5px]">
              <p className="font-bold">{e.company}</p>
              <p className="text-slate-500 text-[11px]">{e.start} – {e.current ? "Present" : e.end}</p>
            </div>
            <p className="italic text-[12px]">{e.title}</p>
            <Bullets text={e.description} />
          </div>
        ))}
      </Section>
      <Section title="Education" accent={a}>
        {data.education.map((ed) => (
          <p key={ed.id} className="text-[12px]"><span className="font-semibold">{ed.school}</span> — {ed.degree}{ed.field && `, ${ed.field}`} ({ed.end})</p>
        ))}
      </Section>
    </div>
  );
}

function ATSTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="h-full w-full p-12 text-slate-900" style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 className="text-2xl font-bold">{data.personal.fullName}</h1>
      <p className="text-[12px]">{data.personal.role}</p>
      <p className="text-[11px] mt-1">{[data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin].filter(Boolean).join(" | ")}</p>
      <h2 className="text-[13px] font-bold mt-5 uppercase">Summary</h2>
      <p className="text-[12px]">{data.summary}</p>
      <h2 className="text-[13px] font-bold mt-4 uppercase">Experience</h2>
      {data.experience.map((e) => (
        <div key={e.id} className="mt-2">
          <p className="text-[12px] font-bold">{e.title} — {e.company} ({e.start} - {e.current?"Present":e.end})</p>
          <Bullets text={e.description} />
        </div>
      ))}
      <h2 className="text-[13px] font-bold mt-4 uppercase">Education</h2>
      {data.education.map((ed) => (
        <p key={ed.id} className="text-[12px]">{ed.degree}, {ed.field} — {ed.school} ({ed.end})</p>
      ))}
      <h2 className="text-[13px] font-bold mt-4 uppercase">Skills</h2>
      <p className="text-[12px]">{data.skills.join(", ")}</p>
    </div>
  );
}

function DeveloperTemplate({ data }: { data: ResumeData }) {
  const a = data.accentColor;
  return (
    <div className="h-full w-full p-10 text-slate-900 bg-white" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
      <h1 className="text-2xl font-bold"><span style={{ color: a }}>$</span> {data.personal.fullName}</h1>
      <p className="text-[12px] text-slate-500">// {data.personal.role}</p>
      <p className="text-[11px] mt-1 text-slate-600">{data.personal.email} · {data.personal.linkedin} · {data.personal.website}</p>
      <Section title="// summary" accent={a}><p className="text-[12px] leading-relaxed">{data.summary}</p></Section>
      <Section title="// experience" accent={a}>
        {data.experience.map((e) => (
          <div key={e.id} className="mb-3">
            <p className="text-[12px]"><span style={{ color: a }}>▸</span> <b>{e.title}</b> @ {e.company} <span className="text-slate-500">[{e.start}-{e.current?"now":e.end}]</span></p>
            <Bullets text={e.description} />
          </div>
        ))}
      </Section>
      <Section title="// stack" accent={a}>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((s) => <span key={s} className="text-[11px] px-1.5 py-0.5 border" style={{ borderColor: a, color: a }}>{s}</span>)}
        </div>
      </Section>
      <Section title="// projects" accent={a}>
        {data.projects.map((p) => <p key={p.id} className="text-[12px]"><b>{p.name}</b> — {p.description}</p>)}
      </Section>
    </div>
  );
}

function DesignerTemplate({ data }: { data: ResumeData }) {
  const a = data.accentColor;
  return (
    <div className="h-full w-full p-10 text-slate-900 bg-white" style={{ fontFamily: data.font }}>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full" style={{ background: `conic-gradient(from 180deg, ${a}, #7C3AED, #06B6D4, ${a})` }} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data.personal.fullName}</h1>
          <p className="text-sm text-slate-500">{data.personal.role}</p>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-3">{[data.personal.email, data.personal.phone, data.personal.location, data.personal.website].filter(Boolean).join(" · ")}</p>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {data.summary && <Section title="Story" accent={a}><p className="text-[12px] leading-relaxed text-slate-700">{data.summary}</p></Section>}
          <Section title="Experience" accent={a}>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between text-[12.5px]">
                  <p className="font-semibold">{e.title} <span className="text-slate-500 font-normal">/ {e.company}</span></p>
                  <p className="text-slate-500 text-[11px]">{e.start}–{e.current?"Now":e.end}</p>
                </div>
                <Bullets text={e.description} />
              </div>
            ))}
          </Section>
        </div>
        <aside>
          <Section title="Toolkit" accent={a}>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: a + "1a", color: a }}>{s}</span>)}
            </div>
          </Section>
          {data.certifications.length > 0 && (
            <Section title="Awards" accent={a}>
              {data.certifications.map((c) => <p key={c.id} className="text-[12px]"><b>{c.name}</b><br /><span className="text-slate-500">{c.issuer} · {c.date}</span></p>)}
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}

const REGISTRY: Record<TemplateId, (p: { data: ResumeData }) => React.ReactElement> = {
  modern: ModernTemplate,
  corporate: CorporateTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  ats: ATSTemplate,
  developer: DeveloperTemplate,
  designer: DesignerTemplate,
};

export function ResumePreview({ data, scale = 1 }: Props) {
  const Tpl = REGISTRY[data.template] || ModernTemplate;
  // 8.5x11 in at 96dpi => 816x1056 px
  return (
    <div
      className="bg-white shadow-card overflow-hidden origin-top mx-auto"
      style={{ width: 816, height: 1056, transform: `scale(${scale})` }}
    >
      <Tpl data={data} />
    </div>
  );
}

export const TEMPLATE_OPTIONS: { id: TemplateId; name: string; description: string }[] = [
  { id: "modern", name: "Modern", description: "Clean two-column with accent header" },
  { id: "corporate", name: "Corporate", description: "Bold header band, professional" },
  { id: "executive", name: "Executive", description: "Serif, centered, distinguished" },
  { id: "creative", name: "Creative", description: "Gradient sidebar with personality" },
  { id: "minimal", name: "Minimal", description: "Light, elegant, lots of breathing room" },
  { id: "ats", name: "ATS Friendly", description: "Plain, parser-safe layout" },
  { id: "developer", name: "Developer", description: "Mono font, terminal-inspired" },
  { id: "designer", name: "Designer", description: "Bold gradient avatar, layout-rich" },
];
