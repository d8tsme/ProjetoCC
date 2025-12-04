import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [usuario, setUsuario] = useState('usuário');

  // Carrega tema salvo e nome do usuário
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add("darkmode");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("darkmode");
      setDarkMode(false);
    }

    // Carregar nome do usuário
    const usuarioSalvo = sessionStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(usuarioSalvo);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const handleLogoClick = () => {
    navigate('/bibliotech');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        Biblio.<br/>tech
      </div>

      <div className="sidebar-user">
        <div className="user-name">Olá, {usuario} :)</div>
        <div className="user-role">Administrador</div>
      </div>

      <ul className="sidebar-links">
        <li><NavLink to="/Main" className={({isActive}) => isActive ? 'active' : ''}>Livros</NavLink></li>
        <li><NavLink to="/autores" className={({isActive}) => isActive ? 'active' : ''}>Autores</NavLink></li>
        <li><NavLink to="/pessoas" className={({isActive}) => isActive ? 'active' : ''}>Pessoas</NavLink></li>
        <li><NavLink to="/emprestimos" className={({isActive}) => isActive ? 'active' : ''}>Empréstimos</NavLink></li>
        <li><NavLink to="/generos" className={({isActive}) => isActive ? 'active' : ''}>Gêneros</NavLink></li>
        <li><NavLink to="/reservas" className={({isActive}) => isActive ? 'active' : ''}>Reservas</NavLink></li>
      </ul>

      <div className="sidebar-footer">
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Sair da aplicação"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
