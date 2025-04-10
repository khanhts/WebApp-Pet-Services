import { useNavigate } from "react-router-dom";
import style from "./hero.module.css";

export default function Hero() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/shop");
  };
  return (
    <div className={style.hero}>
      <div className="hero__content">
        <h1>Welcome to PetWeb</h1>
        <p>Your one-stop shop for all pet needs!</p>
        <button className={style.hero_button} onClick={() => handleClick()}>
          Shop Now
        </button>
      </div>
    </div>
  );
}
