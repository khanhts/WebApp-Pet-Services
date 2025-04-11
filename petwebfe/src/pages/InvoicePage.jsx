import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./InvoicePage.css";

export default function InvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        alert("Failed to fetch invoice details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found.</div>;
  }

  return (
    <div className="invoice-page">
      <h2>Invoice Details</h2>
      {console.log(invoice)}
      <div className="invoice-summary">
        <p>
          <strong>Invoice ID:</strong> {invoice._id}
        </p>
        <p>
          <strong>Customer:</strong> {invoice.customerId.fullName}
        </p>
        <p>
          <strong>Total Amount:</strong> ${invoice.totalAmount.toFixed(2)}
        </p>
        <p>
          <strong>Status:</strong> {invoice.status}
        </p>
      </div>
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
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
