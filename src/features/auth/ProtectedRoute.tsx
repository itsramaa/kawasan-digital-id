import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireInternal?: boolean;
  requireClient?: boolean;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, requireInternal, requireClient, allowedRoles }: ProtectedRouteProps) {
  const { session, isLoading, isInternal, isClient, roles } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requireInternal && !isInternal) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireClient && !isClient && !isInternal) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some((r) => roles.includes(r as any));
    if (!hasAccess && !roles.includes("super_admin" as any)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
