import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
        <FileText className="h-5 w-5 text-white" />
        <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-primary opacity-30 blur-md group-hover:opacity-60 transition-opacity" />
      </div>
      <span className="font-display text-lg font-bold tracking-tight">
        Resum<span className="text-gradient">ai</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto mt-3 max-w-6xl px-4">
        <div className="glass-strong shadow-soft rounded-2xl px-4 py-2.5 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
            <Button asChild variant="hero" size="sm"><Link to="/register">Get started</Link></Button>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass-strong rounded-2xl mt-2 p-4 flex flex-col gap-1 shadow-soft"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-muted text-sm">{l.label}</a>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button asChild variant="outline" size="sm"><Link to="/login">Log in</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/register">Sign up</Link></Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-gradient-soft mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The AI resume builder for ambitious careers. Beautiful templates, ATS-friendly, ready in minutes.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Product</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#templates" className="hover:text-foreground">Templates</a></li>
            <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Resumai. Crafted with care.</p>
          <p>Made for ambitious professionals.</p>
        </div>
      </div>
    </footer>
  );
}
