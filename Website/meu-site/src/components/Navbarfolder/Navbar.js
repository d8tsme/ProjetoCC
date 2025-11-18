import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Bibliotech</div>

      <ul className="sidebar-links">
        <li><NavLink to="/Main" className={({isActive}) => isActive ? 'active' : ''}>Livros</NavLink></li>
        <li><NavLink to="/autores" className={({isActive}) => isActive ? 'active' : ''}>Autor</NavLink></li>
        <li><NavLink to="/pessoas" className={({isActive}) => isActive ? 'active' : ''}>Pessoas</NavLink></li>
        <li><NavLink to="/emprestimos" className={({isActive}) => isActive ? 'active' : ''}>Empréstimos</NavLink></li>
        <li><NavLink to="/generos" className={({isActive}) => isActive ? 'active' : ''}>Gêneros</NavLink></li>
      </ul>
    </aside>
  );
}

export default Navbar;

