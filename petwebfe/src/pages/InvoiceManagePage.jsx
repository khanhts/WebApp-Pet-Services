import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InvoiceManagePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/invoices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInvoices(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoices.");
    } finally {
      setLoading(false);
    }
  };

  const changeInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/invoices/${invoiceId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchInvoices();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update invoice status."
      );
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>Invoice Management</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Invoice ID
            </th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Customer
            </th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Amount
            </th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Status
            </th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {invoice._id}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {invoice.customerId.fullName}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {invoice.totalAmount} VND
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {invoice.status}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {invoice.status === "Pending" && (
                  <button
                    onClick={() =>
                      changeInvoiceStatus(
                        invoice._id,
                        invoice.status === "Pending" ? "Paid" : "Pending"
                      )
                    }
                    style={{
                      padding: "5px 10px",
                      backgroundColor:
                        invoice.status === "Pending" ? "green" : "red",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {invoice.status === "Pending"
                      ? "Mark as Paid"
                      : "Mark as Pending"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
