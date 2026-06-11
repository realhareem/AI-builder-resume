import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log in — Resumai" }, { name: "description", content: "Log in to your Resumai account." }],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});
type FormData = z.infer<typeof schema>;

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (d: FormData) => {
    await new Promise((r) => setTimeout(r, 600));
    login(d.email);
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  };
  return <AuthShell title="Welcome back" subtitle="Log in to continue building your resume.">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field icon={<Mail className="h-4 w-4" />} label="Email" error={errors.email?.message}>
        <Input type="email" placeholder="you@work.com" {...register("email")} />
      </Field>
      <Field icon={<Lock className="h-4 w-4" />} label="Password" error={errors.password?.message}>
        <Input type="password" placeholder="••••••••" {...register("password")} />
      </Field>
      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : <>Log in <ArrowRight className="h-4 w-4" /></>}
      </Button>
    </form>
    <Divider />
    <SocialButtons onClick={(p) => { login(`demo@${p}.com`, "Demo User"); toast.success(`Logged in with ${p}`); navigate({ to: "/dashboard" }); }} />
    <p className="mt-6 text-center text-sm text-muted-foreground">
      No account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up free</Link>
    </p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="absolute top-6 left-6 z-10"><Logo /></div>
      <div className="relative min-h-screen grid place-items-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-strong rounded-3xl shadow-elegant p-8 ring-gradient"
        >
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ icon, label, error, children }: { icon?: React.ReactNode; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium">{icon}{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function SocialButtons({ onClick }: { onClick: (provider: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {["google", "github", "apple"].map((p) => (
        <button key={p} onClick={() => onClick(p)}
          className="rounded-lg border bg-white/70 hover:bg-white py-2.5 text-xs font-medium capitalize transition-colors flex items-center justify-center gap-1.5">
          <SocialIcon name={p} /> {p}
        </button>
      ))}
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "google") return <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 11v3.2h5.4c-.5 2.4-2.5 4.1-5.4 4.1A5.3 5.3 0 1 1 12 6.7c1.4 0 2.7.5 3.7 1.4l2.4-2.3A8.6 8.6 0 1 0 12 21c5 0 8.5-3.5 8.5-8.4 0-.6 0-1.1-.1-1.6H12z"/></svg>;
  if (name === "github") return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.67-4.57 4.92.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2"/></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.36 12.7c0-2.86 2.34-4.24 2.45-4.31-1.34-1.96-3.42-2.22-4.16-2.25-1.77-.18-3.45 1.04-4.35 1.04-.9 0-2.28-1.02-3.74-.99-1.92.03-3.7 1.12-4.69 2.84-2 3.47-.51 8.6 1.44 11.42.95 1.38 2.08 2.93 3.55 2.87 1.43-.06 1.97-.92 3.69-.92s2.21.92 3.72.89c1.54-.03 2.51-1.4 3.45-2.79 1.09-1.6 1.54-3.15 1.56-3.23-.04-.02-2.98-1.14-3-4.57M13.7 4.43c.78-.95 1.31-2.27 1.16-3.58-1.13.05-2.49.75-3.3 1.69-.72.83-1.36 2.17-1.19 3.46 1.26.1 2.54-.64 3.33-1.57"/></svg>;
}
