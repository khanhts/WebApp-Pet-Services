import React, { useState } from "react";
import axios from "axios";
import "./TagForm.css";

export default function TagForm({ tag, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: tag?.name || "",
    description: tag?.description || "",
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
      if (tag) {
        response = await axios.put(
          `http://localhost:3000/tags/${tag._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post("http://localhost:3000/tags", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      onSubmit(response.data.data);
      alert("Tag saved successfully!");
    } catch (error) {
      console.error("Error saving tag:", error.response?.data || error.message);
      alert("Failed to save tag.");
    }
  };

  return (
    <div className="tag-form">
      <h3>{tag ? "Edit Tag" : "Create Tag"}</h3>
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
