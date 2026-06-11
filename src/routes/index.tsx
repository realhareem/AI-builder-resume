import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Zap, FileText, Shield, Wand2, Layout, Download, ArrowRight,
  Check, Star, Brain, Layers, Target, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { useState } from "react";
import { ResumePreview } from "@/components/resume-preview";
import { defaultResume, type TemplateId } from "@/lib/resume-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resumai — AI Resume Builder for ambitious careers" },
      { name: "description", content: "Build a stunning, ATS-optimized resume in minutes. AI-powered suggestions, premium templates, live preview, and one-click export." },
      { property: "og:title", content: "Resumai — AI Resume Builder" },
      { property: "og:description", content: "Premium AI resume builder. Land more interviews." },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader />
      <Hero />
      <LogoCloud />
      <Features />
      <TemplatesShowcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial" />
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <FloatingShapes />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            New · AI rewrites tailored to any job description
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto mt-6 max-w-4xl text-center text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          The AI resume builder for{" "}
          <span className="text-gradient">ambitious careers</span>
        </motion.h1>

        <motion.p {...fadeUp} transition={{ duration: 0.7, delay: 0.12 }} className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground">
          Craft an interview-winning resume in minutes. Premium templates, ATS-friendly,
          and an AI assistant that writes alongside you.
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="hero" size="xl">
            <Link to="/register">Build my resume <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/templates">Browse templates</Link>
          </Button>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.28 }} className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> No credit card</span>
          <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Free forever plan</span>
          <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> ATS-tested</span>
        </motion.div>

        <HeroMockup />
      </div>
    </section>
  );
}

function FloatingShapes() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute left-[8%] top-32 hidden lg:block"
        animate={{ y: [0, -18, 0], rotate: [-6, -3, -6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <MiniCard accent="#2563EB" name="Sarah K." role="Software Engineer" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute right-[6%] top-48 hidden lg:block"
        animate={{ y: [0, -22, 0], rotate: [5, 2, 5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <MiniCard accent="#7C3AED" name="James P." role="Product Manager" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute left-[14%] bottom-10 hidden lg:block"
        animate={{ y: [0, -14, 0], rotate: [3, -1, 3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <MiniCard accent="#06B6D4" name="Mei L." role="UX Designer" />
      </motion.div>
    </>
  );
}

function MiniCard({ accent, name, role }: { accent: string; name: string; role: string }) {
  return (
    <div className="w-52 rounded-2xl bg-white shadow-card p-4 border">
      <div className="h-1.5 w-12 rounded-full" style={{ background: accent }} />
      <p className="mt-3 text-sm font-semibold">{name}</p>
      <p className="text-[11px] text-slate-500">{role}</p>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-slate-100" />
        <div className="h-1.5 w-5/6 rounded bg-slate-100" />
        <div className="h-1.5 w-3/4 rounded bg-slate-100" />
      </div>
      <div className="mt-3 flex gap-1">
        <span className="h-4 w-10 rounded-full" style={{ background: accent + "22" }} />
        <span className="h-4 w-8 rounded-full" style={{ background: accent + "22" }} />
        <span className="h-4 w-12 rounded-full" style={{ background: accent + "22" }} />
      </div>
    </div>
  );
}

function HeroMockup() {
  const sample = defaultResume();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
      className="mt-16 mx-auto max-w-5xl"
    >
      <div className="relative rounded-3xl border bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-xl shadow-elegant overflow-hidden">
        <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-primary opacity-30 blur-2xl" />
        <div className="grid md:grid-cols-[1fr_1.2fr]">
          {/* Editor panel */}
          <div className="p-6 border-r bg-white/60">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-3">
              <Field label="Full name" value="Alex Morgan" />
              <Field label="Role" value="Senior Product Designer" />
              <Field label="Summary" value="Product designer with 8+ years..." />
              <div className="rounded-xl border bg-gradient-soft p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                  <Sparkles className="h-3.5 w-3.5" /> AI assistant
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Tip: quantify your impact — "Lifted activation by 34%" reads stronger.
                </p>
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="p-6 bg-gradient-soft">
            <div className="origin-top-left scale-[0.48] md:scale-[0.52] -mb-[460px]">
              <ResumePreview data={sample} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <div className="rounded-lg border bg-white px-3 py-2 text-sm">{value}</div>
    </div>
  );
}

function LogoCloud() {
  const names = ["Northwind", "Acme Inc.", "Zenith", "Lumen", "Vertex", "Helix"];
  return (
    <section className="py-10 border-y bg-muted/40">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Trusted by candidates hired at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {names.map((n) => (
            <span key={n} className="font-display text-lg font-semibold text-foreground/60">{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Brain, title: "AI that writes with you", desc: "Generate summaries, rewrite bullet points, and match job descriptions in one click." },
    { icon: Layout, title: "8 premium templates", desc: "Polished, recruiter-tested layouts for every industry and seniority level." },
    { icon: Shield, title: "ATS-friendly", desc: "Parser-safe structure ensures your resume gets past automated screening." },
    { icon: Wand2, title: "Real-time preview", desc: "See changes the moment you make them — no refresh, no friction." },
    { icon: Layers, title: "Multiple resumes", desc: "Tailor versions per role and switch templates without losing content." },
    { icon: Download, title: "One-click export", desc: "Download as PDF or share a live link with a recruiter." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Everything you need to land the interview</h2>
          <p className="mt-4 text-muted-foreground">A studio-grade editor with an AI co-pilot, designed for recruiters and people who hate writing about themselves.</p>
        </motion.div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
              className="group relative rounded-2xl border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TemplatesShowcase() {
  const sample = defaultResume();
  const [active, setActive] = useState<TemplateId>("modern");
  const tabs: { id: TemplateId; name: string }[] = [
    { id: "modern", name: "Modern" }, { id: "corporate", name: "Corporate" },
    { id: "executive", name: "Executive" }, { id: "creative", name: "Creative" },
    { id: "minimal", name: "Minimal" }, { id: "ats", name: "ATS" },
    { id: "developer", name: "Developer" }, { id: "designer", name: "Designer" },
  ];
  return (
    <section id="templates" className="py-24 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Templates</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Designs that get noticed</h2>
          <p className="mt-4 text-muted-foreground">Switch templates instantly. Your content stays intact.</p>
        </motion.div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === t.id ? "bg-gradient-primary text-white shadow-glow" : "bg-white border hover:border-primary/40"
              }`}>
              {t.name}
            </button>
          ))}
        </div>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 rounded-3xl border bg-white p-6 md:p-10 shadow-elegant flex justify-center overflow-hidden"
        >
          <div className="origin-top scale-[0.55] md:scale-[0.78] -mb-[460px] md:-mb-[230px]">
            <ResumePreview data={{ ...sample, template: active }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const list = [
    { name: "Priya R.", role: "Hired at Google", quote: "I rewrote my resume in 20 minutes with Resumai and landed three interviews the same week." },
    { name: "Marcus T.", role: "Senior PM at Stripe", quote: "The AI rewrites are uncannily good. It made my bullets sound like the senior I am." },
    { name: "Elena S.", role: "Designer · ex-Airbnb", quote: "Beautiful templates, finally. No more wrestling with Word margins." },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Loved by candidates</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">From draft to job offer</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {list.map((t, i) => (
            <motion.figure key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-2xl border bg-card p-6 shadow-soft"
            >
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground">"{t.quote}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-white text-xs font-bold">
                  {t.name.split(" ").map(s=>s[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For getting started", features: ["1 resume", "3 templates", "PDF export", "Basic AI suggestions"], cta: "Start free" },
    { name: "Pro", price: "$12", desc: "Per month, billed yearly", features: ["Unlimited resumes", "All 8 templates", "Full AI assistant", "ATS optimization", "Custom colors & fonts", "Priority support"], cta: "Go Pro", featured: true },
    { name: "Teams", price: "$29", desc: "Per seat, per month", features: ["Everything in Pro", "Shared workspace", "Team templates", "Admin controls", "SSO"], cta: "Contact sales" },
  ];
  return (
    <section id="pricing" className="py-24 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Simple, honest pricing</h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready to stand out.</p>
        </motion.div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative rounded-3xl border p-7 shadow-soft ${t.featured ? "bg-card ring-2 ring-primary shadow-elegant scale-[1.02]" : "bg-card/80"}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary text-white text-[11px] font-semibold px-3 py-1 shadow-glow">
                  Most popular
                </span>
              )}
              <p className="text-sm font-semibold">{t.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{t.price}</span>
                {t.price !== "$0" && <span className="text-sm text-muted-foreground">/mo</span>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant={t.featured ? "hero" : "outline"} size="lg" className="mt-6 w-full">
                <Link to="/register">{t.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is my resume ATS-compatible?", a: "Yes. Every template — and especially the ATS template — is structured to be parsed correctly by major applicant tracking systems." },
    { q: "Can I cancel anytime?", a: "Absolutely. Cancel in one click from your account settings. You'll keep access until the end of your billing period." },
    { q: "Do you store my data?", a: "Your resumes are stored locally in your browser by default. With an account, we sync securely so you can access them anywhere." },
    { q: "Which file formats can I export?", a: "PDF and DOCX, plus a shareable web link with each resume." },
    { q: "How good is the AI assistant?", a: "Powered by frontier models, the assistant rewrites bullets with measurable impact, tailors to job descriptions, and proposes ATS keywords." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div {...fadeUp} className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Questions, answered</h2>
        </motion.div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border bg-card overflow-hidden shadow-soft">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold">{f.q}</span>
                <span className={`grid h-7 w-7 place-items-center rounded-full bg-muted transition-transform ${open === i ? "rotate-45" : ""}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero animate-gradient p-12 md:p-16 text-center text-white shadow-elegant">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Your next role starts here</h2>
            <p className="mt-3 text-white/90 max-w-xl mx-auto">Join thousands building standout resumes with Resumai. Free to start.</p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Button asChild size="xl" variant="glass" className="bg-white text-foreground hover:bg-white">
                <Link to="/register">Get started — it's free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
