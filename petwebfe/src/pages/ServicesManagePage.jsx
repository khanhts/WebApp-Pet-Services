import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServicesManagePage.css";

export default function ServicesManagePage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    duration: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      alert("Failed to fetch services.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(
          `http://localhost:3000/services/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Service updated successfully!");
      } else {
        await axios.post("http://localhost:3000/services", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Service created successfully!");
      }
      setFormData({ name: "", price: "", description: "", duration: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service.");
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      price: service.price,
      description: service.description,
      duration: service.duration,
    });
    setIsEditing(true);
    setEditingId(service._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service.");
    }
  };

  return (
    <div className="services-manage-page">
      <h2>Manage Services</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <input
          type="text"
          name="name"
          placeholder="Service Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleInputChange}
        />
        <button type="submit">
          {isEditing ? "Update Service" : "Create Service"}
        </button>
      </form>
      <div className="service-list">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>
              <strong>Price:</strong> {service.price} VND
            </p>
            <p>
              <strong>Duration:</strong> {service.duration} minutes
            </p>
            <button onClick={() => handleEdit(service)}>Edit</button>
            <button onClick={() => handleDelete(service._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
