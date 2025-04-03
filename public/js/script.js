document.addEventListener("DOMContentLoaded", async function () {
    const calendarEl = document.getElementById("calendar");

    if (calendarEl) {
        await setupCalendar();
    }

    const form = document.getElementById("appointment-form");
    if (form) {
        await setupForm();
    }
});

/**
 * 📅 Khởi tạo FullCalendar & xử lý chọn ngày
 */
async function setupCalendar() {
    const calendarEl = document.getElementById("calendar");
    const disabledDates = await fetchDisabledDates(); // Lấy danh sách ngày bị khóa
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: "vi",
        selectable: true,
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch("http://localhost:3000/appointments");
                const data = await response.json();
                const events = data.map(appt => ({
                    title: `${appt.pet} - ${appt.ownerName}`,
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

            if (selectedDate < today) {
                alert("❌ Không thể đặt lịch vào ngày trong quá khứ!");
                return;
            }

            if (disabledDates.includes(selectedDate)) {
                alert("❌ Ngày này đã đầy lịch hoặc là ngày lễ, vui lòng chọn ngày khác!");
                return;
            }

            window.location.href = `/add-form.html?date=${selectedDate}`;
        }
    });

    calendar.render();
}

/**
 * 🛑 Hàm lấy danh sách ngày không thể đặt lịch (bao gồm ngày lễ)
 */
async function fetchDisabledDates() {
    const holidays = [
        "2025-01-01", // Tết Dương lịch
        "2025-04-30", // Giải phóng miền Nam
        "2025-05-01", // Quốc tế Lao động
        "2025-09-02"  // Quốc khánh
    ];

    try {
        const response = await fetch("http://localhost:3000/appointments/disabled-dates");
        const serverDisabledDates = await response.json();
        return [...new Set([...serverDisabledDates, ...holidays])]; // Hợp nhất danh sách
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách ngày bị chặn:", error);
        return holidays;
    }
}

/**
 * 📝 Xử lý form đặt lịch
 */
async function setupForm() {
    const form = document.getElementById("appointment-form");
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedDate = urlParams.get("date");
    const dateInput = document.getElementById("appointmentDate");
    const timeSelect = document.getElementById("appointmentTime");
    
    const disabledDates = await fetchDisabledDates();
    const today = new Date().toISOString().split("T")[0]; // Ngày hiện tại YYYY-MM-DD
    dateInput.setAttribute("min", today);

    if (preselectedDate) {
        dateInput.value = preselectedDate;
        await loadAvailableTimes(preselectedDate, timeSelect);
    }

    dateInput.addEventListener("change", async function () {
        if (dateInput.value < today) {
            alert("❌ Không thể đặt lịch vào ngày trong quá khứ!");
            dateInput.value = today;
            return;
        }

        if (disabledDates.includes(dateInput.value)) {
            alert("❌ Ngày này là ngày lễ hoặc đã đầy lịch, vui lòng chọn ngày khác!");
            dateInput.value = "";
            return;
        }

        await loadAvailableTimes(dateInput.value, timeSelect);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        data.appointmentDate = `${data.appointmentDate}T${data.appointmentTime}:00`;

        try {
            const response = await fetch("http://localhost:3000/appointments/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("✅ Đặt lịch thành công!");
                window.location.href = "/success.html";
            } else {
                alert("❌ Đặt lịch thất bại!");
            }
        } catch (error) {
            console.error("❌ Lỗi khi gửi yêu cầu:", error);
            alert("❌ Có lỗi xảy ra, vui lòng thử lại!");
        }
    });
}

/**
 * 🕒 Hàm kiểm tra khung giờ đã được đặt và hiển thị trạng thái "Đã đặt"
 */
async function loadAvailableTimes(date, timeSelect) {
    if (!date) return;

    try {
        const response = await fetch(`http://localhost:3000/appointments/booked-hours?date=${date}`);
        const bookedTimes = await response.json();

        timeSelect.innerHTML = "";

        const availableHours = ["08:00", "09:00", "10:00", "14:00", "15:00"];
        availableHours.forEach(time => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });

        // 🎯 Thêm sự kiện khi người dùng chọn giờ
        timeSelect.addEventListener("change", function () {
            if (bookedTimes.includes(timeSelect.value)) {
                alert(`⚠️ Giờ ${timeSelect.value} đã được đặt! Vui lòng chọn giờ khác.`);
                timeSelect.value = ""; // Xóa lựa chọn
            }
        });

    } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu lịch hẹn:", error);
    }
}
