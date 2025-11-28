import React from 'react';
import './Banner.css';

export default function Banner() {
  return (
    <section className="banner">
      <h1 className="banner-title">Livros Populares</h1>
      <div className="banner-date">date</div>
      <div className="banner-users">
        <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user1" />
        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="user2" />
        <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="user3" />
        <button className="banner-add-user">+</button>
      </div>
      <button className="banner-add-book">Adicionar Livro +</button>
    </section>
  );
}
