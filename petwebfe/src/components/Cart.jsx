import React, { useState, useEffect } from "react";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  // Update cart in localStorage and state
  const updateCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  // Calculate total price
  const calculateTotal = (cart) => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  // Change item quantity
  const changeQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1; // Prevent quantity from going below 1
    updateCart(newCart);
  };

  // Remove item from cart
  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    updateCart(newCart);
  };

  // Clear the entire cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      localStorage.removeItem("cart");
      setCart([]);
      setTotal(0);
    }
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
            <button className="checkout-button">Proceed to Checkout</button>
          </div>
        </footer>
      )}
    </div>
  );
}
