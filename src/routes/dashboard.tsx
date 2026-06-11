import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Sparkles, Plus, Clock, MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useResumes, type ResumeData } from "@/lib/resume-store";
import { ResumePreview } from "@/components/resume-preview";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Resumai" }, { name: "description", content: "Your resumes, stats, and quick actions." }] }),
  component: () => <AppShell><Dashboard /></AppShell>,
});

function profileCompletion(r: ResumeData) {
  const checks = [
    r.personal.fullName, r.personal.role, r.personal.email, r.summary,
    r.experience.length > 0, r.education.length > 0, r.skills.length > 0, r.projects.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function Dashboard() {
  const { user } = useAuth();
  const { resumes, create, remove, duplicate } = useResumes();
  const navigate = useNavigate();
  const avgCompletion = resumes.length ? Math.round(resumes.reduce((a, r) => a + profileCompletion(r), 0) / resumes.length) : 0;

  const stats = [
    { label: "Resumes", value: resumes.length, icon: FileText, gradient: "from-blue-500 to-indigo-500" },
    { label: "Downloads", value: 12, icon: Download, gradient: "from-violet-500 to-fuchsia-500" },
    { label: "AI rewrites", value: 47, icon: Sparkles, gradient: "from-cyan-500 to-teal-500" },
    { label: "Profile completion", value: avgCompletion + "%", icon: TrendingUp, gradient: "from-emerald-500 to-lime-500" },
  ];

  const onNew = () => {
    const r = create();
    navigate({ to: "/builder/$id", params: { id: r.id } });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">Hello, {user?.name?.split(" ")[0]} 👋</h1>
        </div>
        <Button variant="hero" size="lg" onClick={onNew}><Plus className="h-4 w-4" /> New resume</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
            <div className="flex items-center justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-glow`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Plus, label: "Create resume", desc: "Start from scratch", onClick: onNew },
            { icon: Sparkles, label: "Browse templates", desc: "8 premium designs", onClick: () => navigate({ to: "/templates" }) },
            { icon: Download, label: "Export latest", desc: "Download as PDF", onClick: () => { if (resumes[0]) navigate({ to: "/builder/$id", params: { id: resumes[0].id } }); else toast("No resume yet"); } },
          ].map((a) => (
            <button key={a.label} onClick={a.onClick}
              className="group text-left rounded-2xl border bg-card p-5 shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
                <a.icon className="h-4 w-4" />
              </div>
              <p className="mt-3 font-semibold">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent resumes */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recently edited</h2>
          <Link to="/templates" className="text-xs text-primary hover:underline">Browse templates →</Link>
        </div>
        {resumes.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <p className="text-muted-foreground">No resumes yet. Create your first one.</p>
            <Button onClick={onNew} variant="hero" className="mt-4"><Plus className="h-4 w-4" /> New resume</Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative rounded-2xl border bg-card overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <Link to="/builder/$id" params={{ id: r.id }} className="block">
                  <div className="aspect-[8.5/11] bg-gradient-soft overflow-hidden relative">
                    <div className="absolute inset-0 origin-top-left scale-[0.28] [transform-origin:top_left]">
                      <ResumePreview data={r} />
                    </div>
                  </div>
                </Link>
                <div className="p-4 border-t flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{r.title}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(r.updatedAt).toLocaleDateString()} · {profileCompletion(r)}% complete
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { duplicate(r.id); toast.success("Duplicated"); }} className="p-2 rounded-md hover:bg-muted" title="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete this resume?")) { remove(r.id); toast.success("Deleted"); } }} className="p-2 rounded-md hover:bg-muted text-destructive" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="h-1 bg-muted">
                  <div className="h-full bg-gradient-primary transition-all" style={{ width: profileCompletion(r) + "%" }} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
