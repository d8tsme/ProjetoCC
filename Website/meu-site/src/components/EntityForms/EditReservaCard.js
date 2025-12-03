import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import handleAuthError from '../../utils/authError';

export default function EditReservaCard({ open, onClose, onUpdated, reserva }) {
  const [livros, setLivros] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [dataReserva, setDataReserva] = useState('');
  const [livroId, setLivroId] = useState('');
  const [pessoaId, setPessoaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !reserva) return;
    let cancelled = false;
    async function load() {
      try {
        const livrosResp = await apiFetch('/livros/listar');
        const pessoasResp = await apiFetch('/pessoas/listar');
        if (cancelled) return;
        setLivros(Array.isArray(livrosResp) ? livrosResp : []);
        setPessoas(Array.isArray(pessoasResp) ? pessoasResp : []);
        // Populate form with reserva data
        setDataReserva(reserva.dataReserva || '');
        setLivroId(reserva.livroId || '');
        setPessoaId(reserva.pessoaId || '');
      } catch (err) {
        console.error('Erro ao carregar dados para edição de reserva', err);
        setError('Erro ao carregar livros ou pessoas');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [open, reserva]);

  if (!open || !reserva) return null;

  const reset = () => {
    setDataReserva('');
    setLivroId('');
    setPessoaId('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/reservas/${reserva.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: reserva.id,
          dataReserva,
          livroId: parseInt(livroId, 10),
          pessoaId: parseInt(pessoaId, 10)
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      reset();
      onUpdated && onUpdated();
      onClose && onClose();
    } catch (err) {
      console.error('Erro ao atualizar reserva', err);
      if (err && (err.status === 401 || err.status === 403)) {
        handleAuthError();
        return;
      }
      setError(err?.message || 'Erro ao atualizar reserva');
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
          <span className="addlivro-title">Editar Reserva</span>
          <button className="close-btn" onClick={handleClose}>&times;</button>
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
            <button type="button" className="btn secondary" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
