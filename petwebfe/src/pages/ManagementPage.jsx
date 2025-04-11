import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./ManagementPage.css";

export default function ManagementPage() {
  return (
    <div className="management-page">
      <h1>Admin Management</h1>
      <nav className="management-nav">
        <Link to="product-manage">Product Management</Link>
        <Link to="category-manage">Category Management</Link>
        <Link to="tag-manage">Tag Management</Link>
        <Link to="service-manage">Service Management</Link>
      </nav>
      <div className="management-content">
        <Outlet />
      </div>
    </div>
  );
}
