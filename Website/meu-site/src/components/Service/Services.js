import React from 'react';
import './Services.css';

const services = [
  {
    title: 'Book Title',
    author: 'Author',
    date: 'Publish date',
    genre: 'Genre',
    pages: 'Pages',
    isbn: 'ISBN',
    status: 'Status',
    photo: 'book photo',
  },
  // Adicione mais objetos conforme necessário
];

export default function Services() {
  return (
    <section className="services">
      {services.map((service, idx) => (
        <div className="service-card" key={idx}>
          <div className="service-photo">{service.photo}</div>
          <div className="service-info">
            <div className="service-title">{service.title}</div>
            <div className="service-author">{service.author} <span>{service.date}</span></div>
            <div className="service-genre">{service.genre} <span>{service.pages}</span></div>
          </div>
          <div className="service-actions">
            <button className="service-edit" aria-label="Editar">✏️</button>
            <button className="service-delete" aria-label="Excluir">🗑️</button>
            <span className="service-status">{service.status}</span>
          </div>
          <div className="service-isbn">{service.isbn}</div>
        </div>
      ))}
    </section>
  );
}
