import React from "react";
import { Link } from "react-router-dom";
import "./AccessDenied.css";

export default function AccessDenied() {
  return (
    <div className="access-denied">
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/" className="back-home-link">
        Go back to Homepage
      </Link>
    </div>
  );
}
