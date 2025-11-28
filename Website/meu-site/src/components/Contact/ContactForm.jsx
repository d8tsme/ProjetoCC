import React, { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    alert('Mensagem enviada!');
    setForm({ name: '', email: '', message: '' });
  };
  return (
    <section className="contact-form-section">
      <h2>Contato</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Mensagem" value={form.message} onChange={handleChange} required />
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}
