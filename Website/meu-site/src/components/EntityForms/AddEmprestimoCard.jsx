import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import '../BookFormFolder/AddLivroCard.css';

export default function AddEmprestimoCard({ open, onClose, onCreated }) {
  const [pessoa, setPessoa] = useState('');
  const [livro, setLivro] = useState('');
  const [pessoas, setPessoas] = useState([]);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      try {
        const p = await apiFetch('/pessoas/listar');
        const l = await apiFetch('/livros/listar');
        if (!cancelled) { setPessoas(Array.isArray(p) ? p : []); setLivros(Array.isArray(l) ? l : []); }
      } catch (err) { console.error(err); setError('Erro ao carregar pessoas ou livros'); }
    }
    load();
    return () => { cancelled = true; };
  }, [open]);

  if (!open) return null;

  const reset = () => { setPessoa(''); setLivro(''); setError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const payload = { pessoaId: pessoa, livroId: livro };
      const res = await apiFetch('/emprestimos/inserir', { method: 'POST', body: JSON.stringify(payload) });
      reset(); onCreated && onCreated(res); onClose && onClose();
    } catch (err) { setError(err.message || 'Erro ao criar empréstimo'); } finally { setLoading(false); }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <header className="addlivro-header">
          <h2>Adicionar Empréstimo</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">×</button>
        </header>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>Pessoa
            <select value={pessoa} onChange={e=>setPessoa(e.target.value)} required>
              <option value="">-- selecione --</option>
              {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </label>
          <label>Livro
            <select value={livro} onChange={e=>setLivro(e.target.value)} required>
              <option value="">-- selecione --</option>
              {livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
            </select>
          </label>
          <div className="addlivro-actions">
            <button type="button" className="btn secondary" onClick={() => { reset(); onClose && onClose(); }}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Enviando...' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
