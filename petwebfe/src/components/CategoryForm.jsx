import React, { useState } from "react";
import axios from "axios";
import "./CategoryForm.css";

export default function CategoryForm({ category, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let response;
      if (category) {
        response = await axios.put(
          `http://localhost:3000/categories/${category._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/categories",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      onSubmit(response.data.data);
      alert("Category saved successfully!");
    } catch (error) {
      console.error(
        "Error saving category:",
        error.response?.data || error.message
      );
      alert("Failed to save category.");
    }
  };

  return (
    <div className="category-form">
      <h3>{category ? "Edit Category" : "Create Category"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
