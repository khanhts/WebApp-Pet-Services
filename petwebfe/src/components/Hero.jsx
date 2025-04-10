import style from "./hero.module.css";

export default function Hero() {
  return (
    <div className={style.hero}>
      <div className="hero__content">
        <h1>Welcome to PetWeb</h1>
        <p>Your one-stop shop for all pet needs!</p>
        <button className={style.hero_button}>Shop Now</button>
      </div>
    </div>
  );
}
