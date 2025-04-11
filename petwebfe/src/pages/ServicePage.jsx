import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServicePage.css";

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="service-page">
      <h2>Our Services</h2>
      <div className="service-list">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>
              <strong>Price:</strong> ${service.price}
            </p>
            <p>
              <strong>Duration:</strong> {service.duration} minutes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
