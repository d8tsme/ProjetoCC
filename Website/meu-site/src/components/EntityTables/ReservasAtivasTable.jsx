import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import handleAuthError from '../../utils/authError';
import saveCsv from '../../utils/csv';
import EditReservaCard from '../EntityForms/EditReservaCard';

export default function ReservasAtivasTable({ reloadKey }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('dataValidade');
  const [editOpen, setEditOpen] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const cols = [
    { key: 'livro_foto', label: 'Foto' },
    { key: 'livro_titulo', label: 'Livro' },
    { key: 'pessoa_nome', label: 'Pessoa' },
    { key: 'dataReserva', label: 'Data Reserva' },
    { key: 'dataValidade', label: 'Data Validade' },
    { key: 'confirmarPosse', label: 'Status' },
    { key: 'actions', label: 'Ações' }
  ];

  // avoid exhaustive-deps warning: loader intentionally recreated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [search, sort, reloadKey]);

  async function handleDelete(id) {
    if (!window.confirm('Deseja realmente deletar esta reserva?')) return;
    try {
      await apiFetch(`/reservas/excluir/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      console.error('Erro ao deletar reserva', err);
      alert(err.message || 'Erro ao deletar reserva');
    }
  }

  function handleEdit(reserva) {
    setEditingReserva(reserva);
    setEditOpen(true);
  }

  async function handleEditSave() {
    await load();
  }

  async function handleConfirmPosse(id) {
    try {
      await apiFetch(`/reservas/confirmar-posse/${id}`, { method: 'PUT' });
      alert('Posse confirmada com sucesso!');
      await load();
    } catch (err) {
      console.error('Erro ao confirmar posse', err);
      alert(err.message || 'Erro ao confirmar posse');
    }
  }

  async function load() {
    try {
      const res = await apiFetch('/reservas/listar');
      let arr = Array.isArray(res) ? res : (res && res.content ? res.content : []);
      const today = new Date();
      arr = arr.filter(r => {
        if (!r.dataValidade) return true;
        const val = new Date(r.dataValidade);
        return val >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
      });
      if (search) arr = arr.filter(r => (r.pessoa_nome && r.pessoa_nome.toLowerCase().includes(search.toLowerCase())) || (r.livro_titulo && r.livro_titulo.toLowerCase().includes(search.toLowerCase())));
      
      // Sort
      if (sort === 'dataValidade') arr.sort((a, b) => new Date(a.dataValidade) - new Date(b.dataValidade));
      else if (sort === 'pessoa') arr.sort((a, b) => (a.pessoa_nome || '').localeCompare(b.pessoa_nome || ''));
      else if (sort === 'livro') arr.sort((a, b) => (a.livro_titulo || '').localeCompare(b.livro_titulo || ''));
      
      setData(arr);
    } catch (err) {
      console.error('Erro ao carregar reservas ativas', err);
      if (err && (err.status === 401 || err.status === 403)) {
        handleAuthError();
        return;
      }
      setData([]);
    }
  }

  return (
    <div>
      <h3>Reservas ativas</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn" onClick={() => saveCsv('reservas_ativas.csv', data, cols)}>Salvar CSV</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} onClick={() => c.key !== 'actions' && c.key !== 'livro_foto' && setSort(c.key)} style={{cursor: c.key !== 'actions' && c.key !== 'livro_foto' ? 'pointer' : 'default'}}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id}>
              <td>{r.livro_foto ? <img src={r.livro_foto} alt="Capa" style={{maxWidth:40,maxHeight:60}} /> : 'sem imagem'}</td>
              <td>{r.livro_titulo}</td>
              <td>{r.pessoa_nome}</td>
              <td>{r.dataReserva}</td>
              <td>{r.dataValidade}</td>
              <td>{r.confirmarPosse ? <span style={{color: 'green', fontWeight: 'bold'}}>✓ Confirmada</span> : <span style={{color: 'orange'}}>Pendente</span>}</td>
              <td>
                <button className="btn btn-small" onClick={() => handleEdit(r)}>Editar</button>
                {!r.confirmarPosse && <button className="btn btn-small" onClick={() => handleConfirmPosse(r.id)}>Confirmar</button>}
                <button className="btn btn-small" onClick={() => handleDelete(r.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditReservaCard open={editOpen} onClose={() => setEditOpen(false)} onUpdated={handleEditSave} reserva={editingReserva} />
    </div>
  );
}
