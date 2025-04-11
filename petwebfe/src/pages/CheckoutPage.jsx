import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const fetchCustomerInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Customer info response:", response.data);
        if (response.data.user) {
          setCustomerId(response.data.user._id);
          setCustomerInfo(response.data.user);
        } else {
          throw new Error("Failed to fetch customer details");
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        alert("Unable to fetch your details. Please log in again.");
        window.location.href = "/auth/login";
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerInfo();
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!customerId || !customerInfo) {
      alert("Customer details are missing. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const invoiceData = {
        customerId: customerId,
        totalAmount: cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await axios.post(
        "http://localhost:3000/invoices",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Invoice created successfully!");
        localStorage.removeItem("cart");
        setCart([]);
        window.location.href = `/invoice/${response.data.data._id}`;
      } else {
        alert("Failed to create invoice: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while creating the invoice. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="checkout-page">Loading customer information...</div>;
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {customerInfo && (
        <section className="customer-info">
          <h3>Customer Information</h3>
          <div className="customer-details">
            <p>
              <strong>Name:</strong> {customerInfo.fullName}
            </p>
            <p>
              <strong>Email:</strong> {customerInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {customerInfo.phone}
            </p>
            <p>
              <strong>Address:</strong> {customerInfo.address}
            </p>
          </div>
        </section>
      )}

      <section className="cart-summary">
        <h3>Cart Summary</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                <span>{item.name}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Price: {item.price.toLocaleString()} VND</span>
              </li>
            ))}
          </ul>
        )}
        <p className="total">
          Total:{" "}
          {cart
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toLocaleString()}{" "}
          VND
        </p>
      </section>

      <button
        className="checkout-button"
        onClick={handleCheckout}
        disabled={isSubmitting || !customerId || !customerInfo}
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
