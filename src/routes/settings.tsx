import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Resumai" }, { name: "description", content: "Manage your profile and preferences." }] }),
  component: () => <AppShell><Settings /></AppShell>,
});

function Settings() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1.5 text-muted-foreground">Manage your account and preferences.</p>
      <div className="mt-8 rounded-2xl border bg-card p-6 shadow-soft space-y-4">
        <div>
          <Label className="text-xs">Full name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
        </div>
        <Button variant="hero" onClick={() => { login(email, name); toast.success("Profile updated"); }}>
          Save changes
        </Button>
      </div>
      <div className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
        <p className="font-semibold">Subscription</p>
        <p className="text-sm text-muted-foreground mt-1">You're on the <span className="font-medium text-foreground">Free</span> plan.</p>
        <Button variant="hero" className="mt-3">Upgrade to Pro</Button>
      </div>
    </div>
  );
}
