import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryForm from "../components/CategoryForm";
import "./CategoryManagePage.css";

export default function CategoryManagePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle delete category
  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/categories/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setCategories(
            categories.filter((category) => category._id !== categoryId)
          );
          alert("Category deleted successfully!");
        } else {
          alert("Failed to delete category.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category.");
      }
    }
  };

  // Handle create or update category
  const handleFormSubmit = (newCategory) => {
    if (selectedCategory) {
      // Update category
      setCategories(
        categories.map((category) =>
          category._id === newCategory._id ? newCategory : category
        )
      );
    } else {
      // Create category
      setCategories([...categories, newCategory]);
    }
    setIsFormVisible(false);
    setSelectedCategory(null);
  };

  return (
    <div className="category-manage-page">
      <h2>Category Management</h2>
      <button
        className="create-button"
        onClick={() => {
          setSelectedCategory(null);
          setIsFormVisible(true);
        }}
      >
        Create Category
      </button>

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsFormVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(category._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
