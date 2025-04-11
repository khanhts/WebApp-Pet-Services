import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { token } = useAuth();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const calculateTotal = (cart) => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  const changeQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    updateCart(newCart);
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      localStorage.removeItem("cart");
      setCart([]);
      setTotal(0);
    }
  };

  const handleCheckout = () => {
    if (!token) {
      alert("You must be logged in to proceed to checkout.");
      navigate("/auth/login");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h2>Your Shopping Cart</h2>
      </header>

      <section className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item__details">
                <h3>{item.name}</h3>
                <p>Price: {item.price.toLocaleString()} VND</p>
                <p>
                  Total: {(item.price * item.quantity).toLocaleString()} VND
                </p>
              </div>
              <div className="cart-item__actions">
                <button onClick={() => changeQuantity(index, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQuantity(index, 1)}>+</button>
                <button
                  onClick={() => removeItem(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {cart.length > 0 && (
        <footer className="cart-footer">
          <div className="cart-total">
            <h3>Total: {total.toLocaleString()} VND</h3>
          </div>
          <div className="cart-actions">
            <button onClick={clearCart} className="clear-cart-button">
              Clear Cart
            </button>
            <button onClick={handleCheckout} className="checkout-button">
              Proceed to Checkout
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
