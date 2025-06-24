import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth() || {};
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}
