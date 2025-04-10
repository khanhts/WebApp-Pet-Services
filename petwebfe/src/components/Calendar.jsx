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

  useEffect(() => {
    // Fetch disabled dates (e.g., holidays or fully booked days)
    const fetchDisabledDates = async () => {
      const holidays = ["2025-01-01", "2025-04-30", "2025-05-01", "2025-09-02"];
      setDisabledDates(holidays);
      //   try {
      //     const response = await fetch("/appointment/getDisabledDates");
      //     const serverDisabledDates = await response.json();
      //     setDisabledDates([...new Set([...serverDisabledDates, ...holidays])]);
      //   } catch (error) {
      //     console.error("Failed to fetch disabled dates:", error);
      //     setDisabledDates(holidays);
      //   }
    };

    fetchDisabledDates();
  }, []);

  const handleDateClick = async (info) => {
    const selectedDate = info.dateStr;
    const today = new Date().toISOString().split("T")[0];
    const jsDate = new Date(selectedDate);

    if (selectedDate < today) {
      alert("❌ Can't choose days in the past!");
      return;
    }

    const dayOfWeek = jsDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert("❌ Invalid date!");
      return;
    }

    if (disabledDates.includes(selectedDate)) {
      alert("❌ Holiday or fully booked!");
      return;
    }

    setSelectedDate(selectedDate);
    setModalVisible(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newAppointment = {
      pet: formData.get("pet"),
      user_id: formData.get("user_id"),
      date: `${selectedDate} ${formData.get("appointment_time")}:00`,
      reason: formData.get("reason"),
    };

    setAppointments([...appointments, newAppointment]);
    setModalVisible(false);
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

      {/* Modal for Appointment */}
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
                  <input
                    type="hidden"
                    name="appointment_date"
                    value={selectedDate}
                  />
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
                      value="123" // Replace with actual user ID
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
