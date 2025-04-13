document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', 
        locale: 'vi', 
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                let response = await fetch('http://localhost:3000/api/appointments');
                let appointments = await response.json();
                console.log("Appointment lấy được: ",appointments)
                let events = appointments.map(appt => ({
                    id: appt._id,
                    title: `${appt.pet} - ${appt.ownerName}`,
                    start: appt.appointmentDate,
                    extendedProps: {
                        phone: appt.phone,
                        email: appt.email,
                        reason: appt.reason
                    }
                }));

                successCallback(events);
            } catch (error) {
                console.error("Lỗi khi tải lịch hẹn:", error);
                failureCallback(error);
            }
        },
        eventClick: function (info) {
            alert(`📅 Chi tiết lịch hẹn:\n🐾 Thú cưng: ${info.event.title}\n📞 SĐT: ${info.event.extendedProps.phone}\n📧 Email: ${info.event.extendedProps.email}\n📝 Lý do: ${info.event.extendedProps.reason}`);
        },
        dateClick: function (info) {
            // Chuyển hướng sang add-form.html với ngày đã chọn
            window.location.href = `./add-form.html?date=${info.dateStr}`;
        }
    });

    calendar.render();
});
