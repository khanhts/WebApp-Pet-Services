import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <nav className="dashboard-nav">
        <Link to="/admin/management/product-manage">Product Management</Link>
        <Link to="/admin/management/order-manage">Order Management</Link>
        <Link to="/admin/management/user-manage">User Management</Link>
      </nav>
      <div className="dashboard-content">
        <p>
          Welcome to the Admin Dashboard. Use the links above to manage the
          application.
        </p>
      </div>
    </div>
  );
}
