import React, { useState } from "react";
import "./SearchProduct.css";

export default function SearchProduct() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Store the full list of products
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSearch = async (event) => {
    const input = event.target.value;
    setSearchTerm(input);

    // Hide dropdown if input is empty
    if (!input) {
      setDropdownVisible(false);
      return;
    }

    // Check for forbidden characters
    const forbiddenChars = /[\/\\|@=<>]/;
    if (forbiddenChars.test(input)) {
      alert(
        "Search input contains invalid characters (/, \\, |, @, =, <, >). Please remove them and try again."
      );
      setDropdownVisible(false);
      return;
    }

    // Fetch filtered products from the API
    try {
      const response = await fetch("http://localhost:3000/products/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: input }),
      });

      const data = await response.json();
      const products = data.data;

      if (products.length === 0) {
        setAllProducts([{ name: "No products found", isPlaceholder: true }]);
      } else {
        setAllProducts(products); // Store the full list of products
      }

      setDropdownVisible(true);
    } catch (error) {
      console.error("Error searching products:", error);
      setDropdownVisible(false);
    }
  };

  const handleProductClick = (productName) => {
    setSearchTerm(productName);
    setDropdownVisible(false); // Hide dropdown after selection
  };

  return (
    <div className="search-product">
      <div className="search-input-container">
        <input
          type="text"
          id="search-input"
          maxLength="40"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {dropdownVisible && (
          <div id="search-dropdown" className="dropdown-box">
            <ul id="dropdown-list">
              {allProducts.slice(0, 5).map((product, index) => (
                <li
                  key={index}
                  className={product.isPlaceholder ? "placeholder" : ""}
                  onClick={
                    !product.isPlaceholder
                      ? () => handleProductClick(product.name)
                      : undefined
                  }
                >
                  {product.name}
                </li>
              ))}
              {allProducts.length > 5 && (
                <li className="more-products">
                  {allProducts.length - 5} more products
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
