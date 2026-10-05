import { Link, NavLink } from "react-router";

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="logo" to="/" aria-label="Think First — главная">
          <span className="logo-mark" aria-hidden="true">
            tf.
          </span>
          Think First
        </Link>

        <nav className="navigation" aria-label="Основная навигация">
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/library">Библиотека</NavLink>
          <NavLink to="/builder">Создать методику</NavLink>
          <NavLink to="/learn">Основы ИИ</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
