document.addEventListener("DOMContentLoaded", async function () {
    await init();
});

async function init() {
    await fetchAppointments();
    await setupCalendar();
    setupForm();
}

// 🗂️ Lấy danh sách lịch hẹn và hiển thị vào bảng
async function fetchAppointments() {
    try {
        const response = await fetch("/appointments");
        const appointments = await response.json();
        const tableBody = document.getElementById("appointment-list");
        
        if (!appointments.length) {
            tableBody.innerHTML = `<tr><td colspan="11" class="text-center">Không có lịch hẹn nào.</td></tr>`;
            return;
        }
        
        tableBody.innerHTML = appointments.map(appt => `
            <tr>
                <td>${appt._id}</td>
                <td>${new Date(appt.createdAt).toLocaleDateString()}</td>
                <td>${new Date(appt.appointmentDate).toLocaleDateString()}</td>
                <td>${appt.appointmentTime}</td>
                <td>${appt.ownerName}</td>
                <td>${appt.pet}</td>
                <td>${appt.phone}</td>
                <td>${appt.email}</td>
                <td>${appt.doctor ? appt.doctor.name : 'Chưa phân công'}</td>
                <td>${appt.reason || 'Không có lý do'}</td>
                <td><span class="badge ${getStatusClass(appt.status)}">${appt.status || 'Đang xử lý'}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách lịch hẹn:", error);
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'Đã xác nhận': return 'bg-success';
        case 'Đang xử lý': return 'bg-warning';
        case 'Đã hủy': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// 📅 Cấu hình FullCalendar
async function setupCalendar() {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;
    
    const disabledDates = await fetchDisabledDates();
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: "vi",
        selectable: true,
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch("/appointments");
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
            const selectedDate = new Date(info.dateStr).toISOString().split('T')[0];
            if (disabledDates.includes(selectedDate)) {
                alert("❌ Ngày này đã đủ 5 lịch hẹn, vui lòng chọn ngày khác!");
                return;
            }
            window.location.href = `/add-form.html?date=${selectedDate}`;
        }
    });
    calendar.render();
}

// 📌 Lấy danh sách ngày không thể đặt lịch
async function fetchDisabledDates() {
    try {
        const response = await fetch("/appointments/disabled-dates");
        return await response.json();
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách ngày bị chặn:", error);
        return [];
    }
}

// 📋 Xử lý form đặt lịch
function setupForm() {
    const form = document.getElementById("appointment-form");
    if (!form) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedDate = urlParams.get("date"); 
    const timeSelect = document.getElementById("appointmentTime");
    
    if (preselectedDate) {
        form.elements["appointmentDate"].value = preselectedDate;
        loadAvailableTimes(preselectedDate, timeSelect);
    }

    form.elements["appointmentDate"].addEventListener("change", async function () {
        await loadAvailableTimes(form.elements["appointmentDate"].value, timeSelect);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        data.appointmentDate = `${data.appointmentDate}T${data.appointmentTime}:00`;

        try {
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
        } catch (error) {
            console.error("❌ Lỗi khi gửi dữ liệu đặt lịch:", error);
        }
    });
}

// 🕒 Kiểm tra khung giờ đã được đặt
async function loadAvailableTimes(date, timeSelect) {
    if (!date) return;
    
    try {
        const response = await fetch(`/appointments/booked-hours?date=${date}`);
        const bookedTimes = await response.json();
        
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
        timeSelect.innerHTML = "<option>Không thể tải dữ liệu</option>";
    }
}
