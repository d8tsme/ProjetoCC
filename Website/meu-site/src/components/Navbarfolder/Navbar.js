import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Carrega tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add("darkmode");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("darkmode");
      setDarkMode(false);
    }
  }, []);

  // Alternar Tema
  const toggleTheme = () => {
    const newThemeIsDark = !darkMode;

    setDarkMode(newThemeIsDark);

    if (newThemeIsDark) {
      document.documentElement.classList.add("darkmode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("darkmode");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  };

  const openRepository = () => {
    window.open('https://github.com/d8tsme/ProjetoCC', '_blank');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Biblio.<br/>tech</div>

      <div className="sidebar-user">
        <div className="user-name">Olá, usuário</div>
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

      <button
        className="sidebar-menu-toggle"
        onClick={() => setShowMenu(!showMenu)}
        title="Menu"
      >
        ⋯
      </button>

      {showMenu && (
        <div className="sidebar-menu-popup">
          <button
            className="sidebar-menu-btn"
            onClick={toggleTheme}
            title={darkMode ? "Modo claro" : "Modo escuro"}
          >
            {darkMode ? "Modo Claro" : "Modo Escuro"}
          </button>

          <button
            className="sidebar-menu-btn"
            onClick={openRepository}
            title="Abrir repositório no GitHub"
          >
            Repositório
          </button>

          <button
            className="sidebar-menu-btn logout"
            onClick={handleLogout}
            title="Sair da aplicação"
          >
            Logout
          </button>

          <button
            className="sidebar-menu-close"
            onClick={() => setShowMenu(false)}
          >
            ✕
          </button>
        </div>
      )}
    </aside>
  );
}

export default Navbar;
