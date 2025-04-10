document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Clear any previous error messages
    document.getElementById('error-message').textContent = '';

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Example of basic validation
    if (!email || !password) {
        document.getElementById('error-message').textContent = 'Please fill in both fields.';
        return;
    }

    // Prepare the data to be sent to the API
    const data = {
        email: email,
        password: password
    };

    // Call the login API using fetch
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        if (data.success) {
            // Handle successful login (e.g., redirect to another page)
            alert('Login successful!');
            window.location.href = '../home/index.html';
        } else {
            // Display error message from API
            document.getElementById('error-message').textContent = data.data || 'Invalid email or password.';
        }
    })
    .catch(error => {
        // Handle errors (e.g., network errors)
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred, please try again later.';
    });
});
