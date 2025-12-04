import React, { useState, useEffect } from 'react';
import apiFetch from '../../../IndexApputils/Utils/utils/apiFetch';

export default function EditGeneroCard({ open, onClose, onUpdated, genero }) {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !genero) return;
    setNome(genero.nome || '');
    setError(null);
  }, [open, genero]);

  if (!open || !genero) return null;

  const reset = () => {
    setNome('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/generos/alterar', {
        method: 'PUT',
        body: JSON.stringify({ id: genero.id, nome }),
        headers: { 'Content-Type': 'application/json' },
      });
      reset();
      onUpdated && onUpdated();
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar gênero');
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
          <span className="addlivro-title">Editar Gênero</span>
          <button className="close-btn" onClick={handleClose}>&times;</button>
        </div>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Nome
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
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
