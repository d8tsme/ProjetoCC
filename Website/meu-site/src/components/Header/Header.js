import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <aside className="navbar">
      <div className="navbar-logo">
        <span>Biblio.<br />tech</span>
        <div className="navbar-user">
          <span className="user-name">user</span>
          <span className="user-email">user@email.com</span>
        </div>
      </div>
      <nav className="navbar-menu">
        <a href="#home">Home</a>
        <a href="#livros" className="active">Livros</a>
        <a href="#autores">Autores</a>
        <a href="#generos">Gêneros</a>
        <a href="#usuarios">Usuários</a>
        <a href="#emprestimos">Empréstimos</a>
      </nav>
    </aside>
  );
}
