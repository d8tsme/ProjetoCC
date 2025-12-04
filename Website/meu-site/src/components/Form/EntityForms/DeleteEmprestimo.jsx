import React, { useState, useEffect } from 'react';
import apiFetch from '../../../IndexApputils/Utils/utils/apiFetch';
import '../BookFormFolder/AddLivroCard.css';

export default function DeleteEmprestimoCard({ open, onClose, onCreated }) {
  const [emprestimoId, setEmprestimoId] = useState('');
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    async function load() {
      try {
        const lista = await apiFetch('/emprestimos/listar');
        if (!cancelled) {
          setEmprestimos(Array.isArray(lista) ? lista : []);
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar empréstimos');
      }
    }
    load();

    return () => { cancelled = true };
  }, [open]);

  if (!open) return null;

  const reset = () => {
    setEmprestimoId('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/emprestimos/devolucao/${emprestimoId}`, {
        method: 'PUT'
      });

      reset();
      onCreated && onCreated(res);
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao devolver empréstimo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <header className="addlivro-header">
          <h2>Devolver Empréstimo</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">×</button>
        </header>

        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          <label>Selecione o empréstimo</label>
          <select 
            value={emprestimoId}
            onChange={e => setEmprestimoId(e.target.value)}
            required
          >
            <option value="">-- selecione --</option>

            {emprestimos.map(emp =>
              !emp.devolvido && (
                <option key={emp.id} value={emp.id}>
                  {emp.livroTitulo} — {emp.pessoaNome}
                </option>
              )
            )}
          </select>

          <div className="addlivro-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                reset();
                onClose && onClose();
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Devolver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
