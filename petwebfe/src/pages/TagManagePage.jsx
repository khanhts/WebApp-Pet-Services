import React, { useState, useEffect } from "react";
import axios from "axios";
import TagForm from "../components/TagForm";
import "./TagManagePage.css";

export default function TagManagePage() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tags", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTags(response.data.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleDelete = async (tagId) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/tags/${tagId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setTags(tags.filter((tag) => tag._id !== tagId));
          alert("Tag deleted successfully!");
        } else {
          alert("Failed to delete tag.");
        }
      } catch (error) {
        console.error("Error deleting tag:", error);
        alert("Failed to delete tag.");
      }
    }
  };

  const handleFormSubmit = (newTag) => {
    if (selectedTag) {
      setTags(tags.map((tag) => (tag._id === newTag._id ? newTag : tag)));
    } else {
      setTags([...tags, newTag]);
    }
    setIsFormVisible(false);
    setSelectedTag(null);
  };

  return (
    <div className="tag-manage-page">
      <h2>Tag Management</h2>
      <button
        className="create-button"
        onClick={() => {
          setSelectedTag(null);
          setIsFormVisible(true);
        }}
      >
        Create Tag
      </button>

      <table className="tag-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag._id}>
              <td>{tag.name}</td>
              <td>{tag.description}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => {
                    setSelectedTag(tag);
                    setIsFormVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(tag._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && (
        <TagForm
          tag={selectedTag}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
