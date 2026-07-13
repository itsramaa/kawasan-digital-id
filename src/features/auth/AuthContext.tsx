"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type AppRole = "super_admin" | "sales" | "project_manager" | "developer" | "finance" | "support" | "infra" | "client_admin" | "client_contact";

interface User {
  id: string;
  email: string;
}

interface Session {
  user: User;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  client_id: string | null;
  is_active: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  isLoading: boolean;
  isInternal: boolean;
  isClient: boolean;
  hasRole: (role: AppRole) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session] = useState<Session | null>(null);
  const [user] = useState<User | null>(null);
  const [profile] = useState<Profile | null>(null);
  const [roles] = useState<AppRole[]>([]);
  const isLoading = false;

  const isInternal = roles.some((r) =>
    ["super_admin", "sales", "project_manager", "developer", "finance", "support", "infra"].includes(r)
  );
  const isClient = roles.some((r) => ["client_admin", "client_contact"].includes(r));

  const hasRole = (role: AppRole) => roles.includes(role);

  const signOut = async () => {
    // stub
  };

  return (
    <AuthContext.Provider
      value={{ session, user, profile, roles, isLoading, isInternal, isClient, hasRole, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
