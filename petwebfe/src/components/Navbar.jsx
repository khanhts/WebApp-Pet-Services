import { Link, useNavigate } from "react-router-dom";
import style from "./navbar.module.css";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

export default function Navbar() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth(); // Access token and setToken from AuthProvider

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleLogout = () => {
    setToken(null); // Clear the token on logout
    navigate("/"); // Redirect to the homepage after logout
  };

  return (
    <nav className={style.navbar}>
      <div className="navbar__logo">PetWeb</div>
      <div className="navbar__buttons">
        {token ? (
          <button className={style.logout_button} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className={style.login_button} onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
