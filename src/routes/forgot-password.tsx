import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell, Field } from "./login";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Resumai" }, { name: "description", content: "Reset your Resumai password." }] }),
  component: ForgotPage,
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    toast.success("Check your inbox for a reset link");
  };
  return (
    <AuthShell title={sent ? "Check your email" : "Reset your password"} subtitle={sent ? "We sent you a magic reset link." : "Enter your email and we'll send a reset link."}>
      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field icon={<Mail className="h-4 w-4" />} label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@work.com" {...register("email")} />
          </Field>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : <>Send reset link <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>
      ) : (
        <div className="text-sm text-muted-foreground">
          Didn't get it? Check spam, or <button onClick={() => setSent(false)} className="text-primary font-medium hover:underline">try another email</button>.
        </div>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it? <Link to="/login" className="text-primary font-medium hover:underline">Back to log in</Link>
      </p>
    </AuthShell>
  );
}
