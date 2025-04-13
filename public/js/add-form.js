document.addEventListener('DOMContentLoaded', function () {
    let urlParams = new URLSearchParams(window.location.search);
    let selectedDate = urlParams.get('date');

    if (selectedDate) {
        document.getElementById('appointmentDate').value = selectedDate;
    }
});


window.onload = function() {
    const appointmentDateInput = document.getElementById('appointmentDate');
    
    // Get the query parameter 'date' from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDate = urlParams.get('date');
    
    if (selectedDate) {
        // Format the selectedDate to match the input's required format (YYYY-MM-DD)
        const date = new Date(selectedDate);
        
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
        const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
        
        const formattedDate = `${year}-${month}-${day}`;
        
        // Set the value of the appointmentDate input field to the formatted date
        appointmentDateInput.value = formattedDate;
    }
};
