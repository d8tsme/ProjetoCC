import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';
// import '../../index.css';

export default function AddPessoaCard({ open, onClose, onCreated }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/pessoas/cadastrar', {
        method: 'POST',
        body: JSON.stringify({ nome, email }),
        headers: { 'Content-Type': 'application/json' },
      });
      setNome('');
      setEmail('');
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError('Erro ao cadastrar pessoa');
    }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <div className="addlivro-header">
          <span className="addlivro-title">Adicionar Pessoa</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Nome
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <div className="addlivro-actions">
            <button type="submit" className="btn primary">Salvar</button>
            <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
} 
