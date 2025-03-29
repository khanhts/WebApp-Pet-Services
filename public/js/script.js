document.addEventListener("DOMContentLoaded", async function () {
    const calendarEl = document.getElementById("calendar");

    if (calendarEl) {
        const disabledDates = await fetchDisabledDates(); // 🔥 Lấy danh sách ngày không thể đặt lịch

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            locale: "vi",
            selectable: true,
            events: async function (fetchInfo, successCallback, failureCallback) {
                try {
                    const response = await fetch("/appointments");
                    const data = await response.json();
                    const events = data.map(appt => ({
                        title: appt.pet + " - " + appt.ownerName,
                        start: appt.appointmentDate,
                        extendedProps: { id: appt._id }
                    }));
                    successCallback(events);
                } catch (error) {
                    failureCallback(error);
                }
            },
            dateClick: function (info) {
                const selectedDate = info.dateStr; 

                if (disabledDates.includes(selectedDate)) {
                    alert("❌ Ngày này đã đủ 5 lịch hẹn, vui lòng chọn ngày khác!");
                    return;
                }

                window.location.href = `/add-form.html?date=${selectedDate}`;
            }
        });

        calendar.render();
    }

    // Xử lý form đặt lịch
    const form = document.getElementById("appointment-form");
    if (form) {
        const urlParams = new URLSearchParams(window.location.search);
        const preselectedDate = urlParams.get("date"); 
        const timeSelect = document.getElementById("appointmentTime");

        if (preselectedDate) {
            form.elements["appointmentDate"].value = preselectedDate;
            await loadAvailableTimes(preselectedDate, timeSelect);
        }

        form.elements["appointmentDate"].addEventListener("change", async function () {
            await loadAvailableTimes(form.elements["appointmentDate"].value, timeSelect);
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Kết hợp ngày & giờ thành `appointmentDate`
            data.appointmentDate = `${data.appointmentDate}T${data.appointmentTime}:00`;

            const response = await fetch("/appointments/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = "/success.html";
            } else {
                const errorData = await response.json();
                alert(`❌ Đặt lịch thất bại! ${errorData.message}`);
            }
        });
    }

    // 🛑 Hàm lấy danh sách ngày không thể đặt lịch
    async function fetchDisabledDates() {
        try {
            const response = await fetch("/appointments/disabled-dates");
            return await response.json();
        } catch (error) {
            console.error("❌ Lỗi khi tải danh sách ngày bị chặn:", error);
            return [];
        }
    }

    // 🕒 Hàm kiểm tra khung giờ đã được đặt và khóa lại
    async function loadAvailableTimes(date, timeSelect) {
        if (!date) return;

        try {
            const response = await fetch(`/appointments/booked-hours?date=${date}`);
            const bookedTimes = await response.json();

            // Reset danh sách giờ
            timeSelect.innerHTML = "";

            const availableHours = [];
            for (let hour = 8; hour <= 17; hour++) {
                const timeString = `${String(hour).padStart(2, "0")}:00`;
                if (!bookedTimes.includes(timeString)) {
                    availableHours.push(timeString);
                }
            }

            if (availableHours.length === 0) {
                alert("❌ Ngày này đã đầy lịch!");
            } else {
                availableHours.forEach(time => {
                    const option = document.createElement("option");
                    option.value = time;
                    option.textContent = time;
                    timeSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("❌ Lỗi khi tải dữ liệu lịch hẹn:", error);
        }
    }
});
