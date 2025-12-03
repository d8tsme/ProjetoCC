import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function EditAutorCard({ open, onClose, onUpdated, autor }) {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !autor) return;
    setNome(autor.nome || '');
    setFoto(autor.foto || '');
    setError(null);
  }, [open, autor]);

  if (!open || !autor) return null;

  const reset = () => {
    setNome('');
    setFoto('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/autores/alterar', {
        method: 'PUT',
        body: JSON.stringify({ id: autor.id, nome, foto }),
        headers: { 'Content-Type': 'application/json' },
      });
      reset();
      onUpdated && onUpdated();
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar autor');
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
          <span className="addlivro-title">Editar Autor</span>
          <button className="close-btn" onClick={handleClose}>&times;</button>
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
            <button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
