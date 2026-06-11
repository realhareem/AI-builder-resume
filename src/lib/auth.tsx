import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User { name: string; email: string; avatar?: string }
interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthCtx | null>(null);
const KEY = "resumai.user.v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);
  const login = (email: string, name?: string) => {
    const u: User = { email, name: name || email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()) };
    setUser(u);
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch {}
  };
  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(KEY); } catch {}
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
