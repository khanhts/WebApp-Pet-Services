import React, { useState, useEffect } from "react";
import "./ProductCard.css";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProductsAndTags = async () => {
      try {
        const productResponse = await fetch("http://localhost:3000/products");
        if (!productResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productData = await productResponse.json();
        setProducts(productData.data);
        setFilteredProducts(productData.data);

        const initialQuantities = {};
        productData.data.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);

        const tagResponse = await fetch("http://localhost:3000/tags");
        if (!tagResponse.ok) {
          throw new Error("Failed to fetch tags");
        }
        const tagData = await tagResponse.json();
        setTags(tagData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsAndTags();
  }, []);

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

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleTagFilter = (event) => {
    const selectedTagId = event.target.value;
    setSelectedTag(selectedTagId);

    if (selectedTagId === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.tags.some((tag) => tag._id === selectedTagId)
      );
      setFilteredProducts(filtered);
    }

    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item._id === product._id
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantities[product._id];
    } else {
      cart.push({ ...product, quantity: quantities[product._id] });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} has been added to the cart!`);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, parseInt(value) || 1),
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
        <select
          className="tag-filter"
          value={selectedTag}
          onChange={handleTagFilter}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
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
