import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function AddEmprestimoCard({ open, onClose, onCreated }) {
  const [livroId, setLivroId] = useState('');
  const [pessoaId, setPessoaId] = useState('');
  const [dataEmprestimo, setDataEmprestimo] = useState('');
  const [dataDevolucao, setDataDevolucao] = useState('');
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ...existing code...
    setError(null);
    try {
      await apiFetch('/emprestimos/cadastrar', {
        method: 'POST',
        body: JSON.stringify({ livroId, pessoaId, dataEmprestimo, dataDevolucao }),
        headers: { 'Content-Type': 'application/json' },
      });
      setLivroId('');
      setPessoaId('');
      setDataEmprestimo('');
      setDataDevolucao('');
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError('Erro ao cadastrar empréstimo');
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
          <label>
            Data do Empréstimo
            <input type="date" value={dataEmprestimo} onChange={e => setDataEmprestimo(e.target.value)} required />
          </label>
          <label>
            Data de Devolução
            <input type="date" value={dataDevolucao} onChange={e => setDataDevolucao(e.target.value)} />
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
