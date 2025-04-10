import styles from "./LoginForm.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(""); // Store a single error message
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Clear previous error message
    setErrorMessage("");

    // Validation
    if (!email) {
      setErrorMessage("Vui lòng nhập email.");
      return;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage("Email không hợp lệ.");
        return;
      }
    }

    if (!password) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Vui lòng nhập username và password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        alert("Login successful!");
        navigate("/");
      } else {
        console.error("Login failed:", data);
        setErrorMessage(data.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["login-form"]}>
      <h2>Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}{" "}
      {/* Display a single error message */}
      {isLoading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link className={styles.goto_register} to="/auth/register">
          Register here
        </Link>
      </p>
    </div>
  );
}
