import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role"); // Get the role from localStorage

  if (userRole !== role) {
    // Redirect to Access Denied page if the role doesn't match
    return <Navigate to="/access-denied" replace />;
  }

  return children; // Render the protected content if the role matches
}
