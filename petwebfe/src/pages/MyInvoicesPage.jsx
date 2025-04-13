import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MyInvoicesPage.css";

export default function MyInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/invoices/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(response.data.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        alert("Failed to fetch invoices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (invoices.length === 0) {
    return <div>No invoices found.</div>;
  }

  return (
    <div className="my-invoices-page">
      <h2>My Invoices</h2>
      <table className="invoices-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice._id}</td>
              <td>${invoice.totalAmount.toFixed(2)}</td>
              <td>{invoice.status}</td>
              <td>
                <Link to={`/invoice/${invoice._id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
