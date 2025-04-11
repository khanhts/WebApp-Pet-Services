import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "../components/ProductForm";
import "./ProductManagePage.css";

export default function ProductManagePage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setProducts(products.filter((product) => product._id !== productId));
          alert("Product deleted successfully!");
        } else {
          alert("Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleFormSubmit = (newProduct) => {
    if (selectedProduct) {
      setProducts(
        products.map((product) =>
          product._id === newProduct._id ? newProduct : product
        )
      );
    } else {
      setProducts([...products, newProduct]);
    }
    setIsFormVisible(false);
    setSelectedProduct(null);
  };

  return (
    <div className="product-manage-page">
      <h2>Product Management</h2>
      <button
        className="create-button"
        onClick={() => {
          setSelectedProduct(null);
          setIsFormVisible(true);
        }}
      >
        Create Product
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()} VND</td>
              <td>{product.quantity}</td>
              <td>
                {product.tags && product.tags.length > 0
                  ? product.tags.map((tag) => tag.name).join(", ")
                  : "No Tags"}
              </td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsFormVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
