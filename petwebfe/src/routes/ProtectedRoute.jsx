import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
