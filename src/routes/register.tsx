import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useResumes } from "@/lib/resume-store";
import { toast } from "sonner";
import { AuthShell, Field, Divider, SocialButtons } from "./login";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign up — Resumai" }, { name: "description", content: "Create your free Resumai account." }] }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});
type FormData = z.infer<typeof schema>;

function RegisterPage() {
  const { login } = useAuth();
  const { create } = useResumes();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: FormData) => {
    await new Promise((r) => setTimeout(r, 700));
    login(d.email, d.name);
    const r = create();
    toast.success("Account created — let's build your resume");
    navigate({ to: "/builder/$id", params: { id: r.id } });
  };
  return (
    <AuthShell title="Create your account" subtitle="Free forever plan. No credit card required.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field icon={<User className="h-4 w-4" />} label="Full name" error={errors.name?.message}>
          <Input placeholder="Alex Morgan" {...register("name")} />
        </Field>
        <Field icon={<Mail className="h-4 w-4" />} label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@work.com" {...register("email")} />
        </Field>
        <Field icon={<Lock className="h-4 w-4" />} label="Password" error={errors.password?.message}>
          <Input type="password" placeholder="At least 6 characters" {...register("password")} />
        </Field>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>
      <Divider />
      <SocialButtons onClick={(p) => { login(`demo@${p}.com`, "Demo User"); toast.success(`Signed up with ${p}`); navigate({ to: "/dashboard" }); }} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
      </p>
    </AuthShell>
  );
}
