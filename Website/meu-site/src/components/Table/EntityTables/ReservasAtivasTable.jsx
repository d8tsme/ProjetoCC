import React, { useState, useEffect } from 'react';
import apiFetch from '../../../IndexApputils/Utils/utils/apiFetch';
import handleAuthError from '../../../IndexApputils/Utils/utils/authError';
import saveCsv from '../../../IndexApputils/Utils/utils/csv';

export default function ReservasAtivasTable({ onConfirmada, reloadKey }) {
  useEffect(() => {
    console.log('ReservasAtivasTable mounted, reloadKey=', reloadKey);
    return () => { console.log('ReservasAtivasTable unmounted'); };
  }, [reloadKey]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('dataReserva');
  const cols = [
    { key: 'dataReserva', label: 'Data Reserva' },
    { key: 'pessoa_nome', label: 'Pessoa' },
    { key: 'livro_titulo', label: 'Livro' },
    { key: 'status', label: 'Status' }
  ];

  // avoid exhaustive-deps warning: loader intentionally recreated each render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [search, sort, reloadKey]);

  async function load() {
    try {
      const res = await apiFetch('/reservas/listar');
      let arr = Array.isArray(res) ? res : [];
      
      // Debug: mostrar primeiro item e seus status
      if (arr.length > 0) {
        console.log('Primeiro item:', arr[0]);
        console.log('Propriedades do primeiro item:', Object.keys(arr[0]));
        console.log('Status do primeiro item:', arr[0].status);
      }
      
      const beforeFilter = arr.length;
      arr = arr.filter(r => {
        const statusNormalizado = r.status ? r.status.trim().toLowerCase() : '';
        const match = statusNormalizado === 'em andamento';
        if (!match && arr.length <= 10) console.log(`Status "${r.status}" → normalizado "${statusNormalizado}" → match: ${match}`);
        return match;
      });
      console.log(`Filtradas ${beforeFilter} → ${arr.length} (status === 'em andamento' - case insensitive)`);
      
      if (search) arr = arr.filter(r => (r.pessoa_nome && r.pessoa_nome.toLowerCase().includes(search.toLowerCase())) || (r.livro_titulo && r.livro_titulo.toLowerCase().includes(search.toLowerCase())));
      
      // Sort
      if (sort === 'dataReserva') arr.sort((a, b) => new Date(a.dataReserva) - new Date(b.dataReserva));
      else if (sort === 'pessoa_nome') arr.sort((a, b) => (a.pessoa_nome || '').localeCompare(b.pessoa_nome || ''));
      else if (sort === 'livro_titulo') arr.sort((a, b) => (a.livro_titulo || '').localeCompare(b.livro_titulo || ''));
      
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

  async function handleConfirmar(reserva) {
    try {
      await apiFetch(`/reservas/confirmar-posse/${reserva.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      // update local state optimistically and then refetch
      setData(d => d.filter(item => item.id !== reserva.id));
      if (onConfirmada) onConfirmada();
      await load();
    } catch (err) {
      console.error('Erro ao confirmar reserva', err);
      if (err && (err.status === 401 || err.status === 403)) {
        handleAuthError();
        return;
      }
      alert(err.message || 'Erro ao confirmar');
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
              <th key={c.key} onClick={() => setSort(c.key)} style={{cursor: 'pointer'}}>
                {c.label}
              </th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id}>
              <td>{r.dataReserva}</td>
              <td>{r.pessoa_nome}</td>
              <td>{r.livro_titulo}</td>
              <td>{r.status}</td>
              <td><button className="btn btn-small" onClick={() => handleConfirmar(r)}>Confirmar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
