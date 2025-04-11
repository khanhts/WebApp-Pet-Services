import styles from "./RegisterForm.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function RegisterForm() {
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fullName = event.target.fullName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const phone = event.target.phone.value;
    const address = event.target.address.value;

    // Validate password match
    if (password !== confirmPassword) {
      setErrorMessages(["Passwords do not match!"]);
      return;
    }

    // Clear previous errors and set loading state
    setErrorMessages([]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful registration
        console.log("Registration successful:", data);
        alert("Registration successful! Please log in.");
      } else {
        // Handle registration failure
        setErrorMessages([data.message || "Registration failed."]);
      }
    } catch (error) {
      // Handle network or server errors
      setErrorMessages(["An error occurred. Please try again later."]);
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles["register-form"]}>
      <h2>Create Account</h2>
      {errorMessages &&
        errorMessages.map((error, index) => (
          <p key={index} className={styles.error}>
            {error}
          </p>
        ))}
      {isLoading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="phone">Phone</label>
          <input type="text" id="phone" name="phone" />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link className={styles.goto_login} to="/auth/login">
          Login here
        </Link>
      </p>
    </div>
  );
}
