import { Link, useNavigate } from "react-router-dom";
import style from "./navbar.module.css";
import LoginForm from "./LoginForm";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">PetWeb</div>
      <ul className="navbar__links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <a href="/calendar">Calendar</a>
        </li>
      </ul>
      <div className="navbar__buttons">
        <button className={style.login_button} onClick={() => handleLogin()}>
          Login
        </button>
      </div>
    </nav>
  );
}
