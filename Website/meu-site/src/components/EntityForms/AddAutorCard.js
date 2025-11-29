import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';
// import '../../index.css';

export default function AddAutorCard({ open, onClose, onCreated }) {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { nome, foto };
      console.log('POST /autores/cadastrar', payload);
      await apiFetch('/autores/cadastrar', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      setNome('');
      setFoto('');
      onCreated && onCreated();
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar autor:', err);
      setError('Erro ao cadastrar autor: ' + (err?.message || '')); 
    }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <div className="addlivro-header">
          <span className="addlivro-title">Adicionar Autor</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Nome
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
          </label>
          <label>
            Foto (URL)
            <input type="text" value={foto} onChange={e => setFoto(e.target.value)} />
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
