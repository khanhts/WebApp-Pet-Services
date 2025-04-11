import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./InvoicePage.css";

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/invoices/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInvoice(response.data.data.invoice);
        setItems(response.data.data.items);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
        setError("Failed to fetch invoice details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  const handleCancelInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/invoices/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Invoice has been successfully canceled.");
      navigate("/invoices");
    } catch (error) {
      console.error("Error canceling invoice:", error);
      alert("Failed to cancel the invoice.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!invoice) {
    return <div>Invoice not found.</div>;
  }

  return (
    <div className="invoice-page">
      <h2>Invoice Details</h2>
      <div className="invoice-summary">
        <p>
          <strong>Invoice ID: </strong> {invoice._id}
        </p>
        <p>
          <strong>Customer: </strong> {invoice.customerId.fullName}
        </p>
        <p>
          <strong>Total Amount: </strong>
          {invoice.totalAmount.toLocaleString()} VND
        </p>
        <p>
          <strong>Status:</strong> {invoice.status}
        </p>
      </div>
      {invoice.status !== "Cancelled" && (
        <button
          onClick={handleCancelInvoice}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Cancel Invoice
        </button>
      )}
      <h3>Items</h3>
      <table className="invoice-items">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price.toLocaleString()} VND</td>
              <td>{(item.quantity * item.price).toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
