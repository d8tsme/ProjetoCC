import React, { useEffect, useState } from 'react';
import apiFetch from '../../utils/apiFetch';
import handleAuthError from '../../utils/authError';

// AddReservaCard
// - shows selects: livros (Disponível) and pessoas and a date input for the reservation
// - creates a reserva via POST /reservas
export default function AddReservaCard({ open, onClose, onCreated }) {
  const [livros, setLivros] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [livroId, setLivroId] = useState('');
  const [pessoaId, setPessoaId] = useState('');
  const [dataReserva, setDataReserva] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const livrosResp = await apiFetch('/livros/listar');
        const pessoasResp = await apiFetch('/pessoas/listar');
        if (canceled) return;
        const disponiveis = Array.isArray(livrosResp) ? livrosResp.filter(l => l.status === 'Disponível' || l.status === 'Disponivel' ) : [];
        setLivros(disponiveis);
        setPessoas(Array.isArray(pessoasResp) ? pessoasResp : []);
      } catch (err) {
        console.error('Erro ao carregar listas para reserva', err);
      }
    }
    if (open) load();
    return () => { canceled = true; };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Você não está autenticado. Faça o login.');
      window.location.href = '/login';
      return;
    }
    try {
      await apiFetch('/reservas/cadastrar', {
        method: 'POST',
        body: JSON.stringify({ dataReserva, livroId: parseInt(livroId, 10), pessoaId: parseInt(pessoaId, 10) }),
        headers: { 'Content-Type': 'application/json' },
      });
      setLivroId(''); setPessoaId(''); setDataReserva('');
      if (typeof onCreated === 'function') onCreated();
      if (typeof onClose === 'function') onClose();
    } catch (err) {
      console.error('Erro ao cadastrar reserva', err);
      if (err && (err.status === 401 || err.status === 403)) {
        handleAuthError();
        return;
      }
      setError(err?.message || 'Erro ao cadastrar reserva');
    }
  }

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <div className="addlivro-header">
          <span className="addlivro-title">Adicionar Reserva</span>
          <button className="close-btn" onClick={() => onClose && onClose()}>&times;</button>
        </div>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Data da reserva
            <input type="date" value={dataReserva} onChange={e => setDataReserva(e.target.value)} required />
          </label>
          <label>
            Livro
            <select value={livroId} onChange={e => setLivroId(e.target.value)} required>
              <option value="">Selecione um livro</option>
              {livros.map(l => (
                <option key={l.id} value={l.id}>{`${l.id} - ${l.titulo}`}</option>
              ))}
            </select>
          </label>
          <label>
            Pessoa
            <select value={pessoaId} onChange={e => setPessoaId(e.target.value)} required>
              <option value="">Selecione uma pessoa</option>
              {pessoas.map(p => (
                <option key={p.id} value={p.id}>{`${p.id} - ${p.nome}`}</option>
              ))}
            </select>
          </label>
          <div className="addlivro-actions">
            <button type="submit" className="btn primary">Salvar</button>
            <button type="button" className="btn secondary" onClick={() => onClose && onClose()}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
