

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [showDashboard, setShowDashboard] = useState(false);

  const toggleTheme = () => {
    const current = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
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
        <li><NavLink to="/autores" className={({isActive}) => isActive ? 'active' : ''}>Autor</NavLink></li>
        <li><NavLink to="/pessoas" className={({isActive}) => isActive ? 'active' : ''}>Pessoas</NavLink></li>
        <li><NavLink to="/emprestimos" className={({isActive}) => isActive ? 'active' : ''}>Empréstimos</NavLink></li>
        <li><NavLink to="/generos" className={({isActive}) => isActive ? 'active' : ''}>Gêneros</NavLink></li>
      </ul>
      <button className="dashboard-btn" onClick={()=>setShowDashboard(s=>!s)} title="Abrir Dashboard">☰</button>
      {showDashboard && (
        <div className="dashboard-modal">
          <button className="mode-toggle-btn" onClick={toggleTheme}>Alternar modo</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <button className="close-dashboard" onClick={()=>setShowDashboard(false)}>Fechar</button>
        </div>
      )}
    </aside>
  );
}

export default Navbar;

