import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function AddEmprestimoCard({ open, onClose, onCreated }) {
  const [livroId, setLivroId] = useState('');
  const [pessoaId, setPessoaId] = useState('');
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        livroId: parseInt(livroId, 10),
        pessoaId: parseInt(pessoaId, 10)
      };
      console.log('POST /emprestimos/cadastrar', payload);
      await apiFetch('/emprestimos/cadastrar', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      setLivroId('');
      setPessoaId('');
      onCreated && onCreated();
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar empréstimo:', err);
      setError('Erro ao cadastrar empréstimo: ' + (err?.message || ''));
    }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <div className="addlivro-header">
          <span className="addlivro-title">Adicionar Empréstimo</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Livro ID
            <input type="text" value={livroId} onChange={e => setLivroId(e.target.value)} required />
          </label>
          <label>
            Pessoa ID
            <input type="text" value={pessoaId} onChange={e => setPessoaId(e.target.value)} required />
          </label>
          {/* Campos removidos conforme modelo do backend */}
          <div className="addlivro-actions">
            <button type="submit" className="btn primary">Salvar</button>
            <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
