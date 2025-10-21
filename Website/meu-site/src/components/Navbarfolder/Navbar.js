// src/components/Navbar.jsx
import "./Navbar.css";

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Bibliotech</div>

      <ul className="sidebar-links">
        <li><a href="#">Autor</a></li>
        <li><a href="#">Pessoa</a></li>
        <li><a href="#">Reservas</a></li>
        <li><a href="#">Gêneros</a></li>
        <li><a href="#">Livros</a></li>
      </ul>
    </aside>
  );
}

export default Navbar;

