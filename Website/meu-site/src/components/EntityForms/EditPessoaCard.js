import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function EditPessoaCard({ open, onClose, onUpdated, pessoa }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !pessoa) return;
    setNome(pessoa.nome || '');
    setEmail(pessoa.email || '');
    setTelefone(pessoa.telefone || '');
    setError(null);
  }, [open, pessoa]);

  if (!open || !pessoa) return null;

  const reset = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/pessoas/alterar', {
        method: 'PUT',
        body: JSON.stringify({ id: pessoa.id, nome, email, telefone }),
        headers: { 'Content-Type': 'application/json' },
      });
      reset();
      onUpdated && onUpdated();
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar pessoa');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose && onClose();
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <div className="addlivro-header">
          <span className="addlivro-title">Editar Pessoa</span>
          <button className="close-btn" onClick={handleClose}>&times;</button>
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
            <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} />
          </label>
          <div className="addlivro-actions">
            <button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
