import React, { useState, useEffect } from "react";
import SearchProduct from "./SearchProduct";
import "./TableProduct.css";

export default function TableProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="table-product">
      {/* Main Content - Product List */}
      <section className="products">
        <div className="container">
          <div className="page-title">
            <h2>Our Products</h2>
          </div>

          {/* Search Bar Section */}
          <SearchProduct
            products={products}
            setFilteredProducts={setFilteredProducts}
          />

          {/* Product List Section */}
          <div className="product-list">
            {isLoading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : filteredProducts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
