import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Sparkles, Settings, LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useResumes } from "@/lib/resume-store";
import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/templates", label: "Templates", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { resumes, create } = useResumes();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const onNew = () => {
    const r = create();
    navigate({ to: "/builder/$id", params: { id: r.id } });
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar">
        <div className="p-5"><Logo /></div>
        <div className="px-3">
          <Button variant="hero" className="w-full" onClick={onNew}>
            <Plus className="h-4 w-4" /> New resume
          </Button>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {NAV.map((n) => {
            const active = pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <Link key={n.to} to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? "bg-gradient-primary text-white shadow-glow" : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 px-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Recent</p>
          <div className="space-y-1">
            {resumes.slice(0, 4).map((r) => (
              <Link key={r.id} to="/builder/$id" params={{ id: r.id }}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-sidebar-accent truncate">
                <FileText className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-white text-xs font-bold">
              {user?.name?.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button onClick={() => { logout(); navigate({ to: "/" }); }} className="p-2 rounded-md hover:bg-muted" aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-w-0"
      >
        {children}
      </motion.main>
    </div>
  );
}