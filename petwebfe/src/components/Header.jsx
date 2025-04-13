import style from "./header.module.css";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className={style.header}>
      <div className={style.header__container}>
        <Navbar />
      </div>
    </header>
  );
}
