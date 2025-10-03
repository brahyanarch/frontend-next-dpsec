import React from "react";
import { useAuth } from "@/context/AuthContext";
// Componente para mostrar condicionalmente elementos según permisos
export const PermissionGuard = ({
  requiredPermission,
  children,
}: {
  requiredPermission: string;
  children: React.ReactNode;
}) => {
  const { hasPermission } = useAuth();
  if (!hasPermission(requiredPermission)) {
    return null;
  }
  return <>{children}</>;
};
