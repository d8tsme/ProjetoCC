import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';
// import '../../index.css';

export default function AddPessoaCard({ open, onClose, onCreated }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { nome, email, telefone: parseInt(telefone, 10) };
      console.log('POST /pessoas/cadastrar', payload);
      await apiFetch('/pessoas/cadastrar', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      setNome('');
      setEmail('');
      setTelefone('');
      onCreated && onCreated();
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar pessoa:', err);
      setError('Erro ao cadastrar pessoa: ' + (err?.message || ''));
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
          <label>
            Telefone
            <input type="number" value={telefone} onChange={e => setTelefone(e.target.value)} required />
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
