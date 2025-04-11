import { Link, useNavigate } from "react-router-dom";
import style from "./navbar.module.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const role = localStorage.getItem("role");
  console.log("Role from localStorage:", role);
  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={style.navbar}>
      <div className="navbar__logo">PetWeb</div>
      {role === "admin" && (
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/management">Management</Link>
          </li>
        </ul>
      )}
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
