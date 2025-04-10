import React, { useState, useEffect } from "react";
import "./ProductCard.css";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // 3 columns x 3 rows per page

  // Quantity state for all products
  const [quantities, setQuantities] = useState({});

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
        setFilteredProducts(data.data);

        // Initialize quantities for all products
        const initialQuantities = {};
        data.data.forEach((product) => {
          initialQuantities[product._id] = 1; // Default quantity is 1
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search functionality
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Add to Cart functionality
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item._id === product._id
    );

    if (existingProductIndex !== -1) {
      // Update quantity if the product already exists in the cart
      cart[existingProductIndex].quantity += quantities[product._id];
    } else {
      // Add new product to the cart
      cart.push({ ...product, quantity: quantities[product._id] });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} has been added to the cart!`);
  };

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, parseInt(value) || 1), // Ensure quantity is at least 1
    }));
  };

  return (
    <div className="product-page">
      <header className="product-header">
        <h2>Our Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          onChange={handleSearch}
        />
      </header>

      <section className="product-list">
        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-card__image">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                />
              </div>
              <div className="product-card__details">
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__price">
                  {product.price.toLocaleString()} VND
                </p>
                <div className="product-card__actions">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product._id, e.target.value)
                    }
                    className="quantity-input"
                  />
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </section>

      {/* Pagination Section */}
      {filteredProducts.length > productsPerPage && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`pagination-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
