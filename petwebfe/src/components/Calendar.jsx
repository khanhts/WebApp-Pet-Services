import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Calendar.css";

export default function Calendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const holidays = [
      { month: 1, day: 1 },
      { month: 4, day: 30 },
      { month: 5, day: 1 },
      { month: 9, day: 2 },
    ];

    const currentYear = new Date().getFullYear();
    const formattedHolidays = holidays.map(
      (holiday) =>
        `${currentYear}-${String(holiday.month).padStart(2, "0")}-${String(
          holiday.day
        ).padStart(2, "0")}`
    );

    setDisabledDates(formattedHolidays);
  }, []);

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    const today = new Date();
    const jsDate = new Date(selectedDate);

    const gmt7Today = new Date(today.getTime() + 7 * 60 * 60 * 1000);
    gmt7Today.setHours(0, 0, 0, 0);
    if (jsDate < gmt7Today) {
      alert("❌ Can't choose days in the past!");
      return;
    }

    const dayOfWeek = jsDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert("❌ Invalid date!");
      return;
    }

    if (disabledDates.includes(selectedDate)) {
      alert("❌ Holiday or fully booked!");
      return;
    }

    const gmt7Date = new Date(jsDate.getTime() + 7 * 60 * 60 * 1000);
    setSelectedDate(gmt7Date.toISOString().split("T")[0]);
    setModalVisible(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
      alert("You must be logged in to make an appointment.");
      window.location.href = "/auth/login";
      return;
    }

    const formData = new FormData(event.target);
    const newAppointment = {
      pet: formData.get("pet"),
      user_id: userId,
      date: selectedDate,
      appointment_time: formData.get("appointment_time"),
      reason: formData.get("reason"),
    };

    try {
      const response = await fetch("http://localhost:3000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create appointment");
      }

      const createdAppointment = await response.json();
      alert("Appointment created successfully!");
      setAppointments([...appointments, createdAppointment.data]);
      setModalVisible(false);
    } catch (error) {
      console.error("Error creating appointment:", error.message);
      alert("Failed to create appointment. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">📅 Make an Appointment</h2>
      <a href="/">Return</a>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={appointments.map((appointment) => ({
          title: `${appointment.pet} - ${appointment.reason}`,
          start: appointment.date,
        }))}
      />

      {modalVisible && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label>Appointment Date:</label>
                    <input
                      type="text"
                      name="appointment_date"
                      className="form-control"
                      value={selectedDate}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label>Pet Info:</label>
                    <input
                      type="text"
                      name="pet"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="user_id"
                      className="form-control"
                      hidden
                      value={userId}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label>Appointment Time:</label>
                    <select
                      name="appointment_time"
                      className="form-control"
                      required
                    >
                      <option value="">-- Choose Time --</option>
                      <option value="08:00">08:00</option>
                      <option value="08:30">08:30</option>
                      <option value="09:00">09:00</option>
                      <option value="09:30">09:30</option>
                      <option value="10:00">10:00</option>
                      <option value="10:30">10:30</option>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="13:30">13:30</option>
                      <option value="14:00">14:00</option>
                      <option value="14:30">14:30</option>
                      <option value="15:00">15:00</option>
                      <option value="15:30">15:30</option>
                      <option value="16:00">16:00</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Context:</label>
                    <textarea name="reason" className="form-control"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Apply
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
