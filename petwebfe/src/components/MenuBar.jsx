import React, { useState, useEffect } from "react";
import "./MenuBar.css";

export default function MenuBar() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menu items from the backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data.data); // Assuming the menu hierarchy is in `data.data`
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Recursive function to render menu items and submenus
  const renderMenuItems = (items) => {
    return (
      <ul className="menu">
        {items.map((item) => (
          <li key={item._id} className="menu-item">
            <a href={item.url}>{item.text}</a>
            {item.children && item.children.length > 0 && (
              <div className="submenu">{renderMenuItems(item.children)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav className="menu-bar">
      {isLoading ? (
        <p>Loading menu...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        renderMenuItems(menuItems)
      )}
    </nav>
  );
}
