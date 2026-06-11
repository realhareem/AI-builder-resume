import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ResumePreview, TEMPLATE_OPTIONS } from "@/components/resume-preview";
import { defaultResume, useResumes, type TemplateId } from "@/lib/resume-store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates — Resumai" }, { name: "description", content: "Browse premium resume templates." }] }),
  component: () => <AppShell><Templates /></AppShell>,
});

function Templates() {
  const { create, update } = useResumes();
  const navigate = useNavigate();
  const sample = defaultResume();

  const onUse = (id: TemplateId) => {
    const r = create();
    update(r.id, { template: id });
    toast.success("Template applied");
    navigate({ to: "/builder/$id", params: { id: r.id } });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Templates</h1>
        <p className="mt-1.5 text-muted-foreground">Pick a starting point. You can switch anytime without losing your content.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_OPTIONS.map((t, i) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group rounded-2xl border bg-card overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="aspect-[8.5/11] bg-gradient-soft relative overflow-hidden">
              <div className="absolute inset-0 origin-top-left scale-[0.34]">
                <ResumePreview data={{ ...sample, template: t.id }} />
              </div>
            </div>
            <div className="p-5 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
                <Button size="sm" variant="hero" onClick={() => onUse(t.id)}>
                  <Check className="h-3.5 w-3.5" /> Use
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
