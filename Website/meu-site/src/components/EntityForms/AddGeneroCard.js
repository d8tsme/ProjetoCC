import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';
// import '../../index.css';

export default function AddGeneroCard({ open, onClose, onCreated }) {
  const [nome, setNome] = useState('');
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { nome };
      console.log('POST /generos/cadastrar', payload);
      await apiFetch('/generos/cadastrar', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      setNome('');
      onCreated && onCreated();
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar gênero:', err);
      setError('Erro ao cadastrar gênero: ' + (err?.message || ''));
    }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <div className="addlivro-header">
          <span className="addlivro-title">Adicionar Gênero</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Nome
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
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
