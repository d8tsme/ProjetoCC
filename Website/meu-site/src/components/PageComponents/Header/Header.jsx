import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">Biblio.<br />tech</div>
      <nav className="header-nav">
        <a href="#home">Home</a>
        <a href="#livros">Livros</a>
        <a href="#autores">Autores</a>
        <a href="#generos">Gêneros</a>
        <a href="#usuarios">Usuários</a>
        <a href="#emprestimos">Empréstimos</a>
      </nav>
      <div className="header-user">
        <span className="user-name">user</span>
        <span className="user-email">user@email.com</span>
      </div>
    </header>
  );
}
