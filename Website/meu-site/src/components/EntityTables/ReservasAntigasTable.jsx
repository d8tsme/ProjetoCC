import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import handleAuthError from '../../utils/authError';
import saveCsv from '../../utils/csv';

export default function ReservasAntigasTable({ reloadKey }) {
  useEffect(()=>{
    console.log('ReservasAntigasTable mounted reloadKey=', reloadKey);
    return ()=>{ console.log('ReservasAntigasTable unmounted'); }
  }, [reloadKey]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('dataValidade');
  const cols = [
    { key: 'pessoa_nome', label: 'Pessoa' },
    { key: 'livro_titulo', label: 'Livro' },
    { key: 'status', label: 'Status' },
    { key: 'dataValidade', label: 'Data Validade' }
  ];

  // avoid exhaustive-deps warning: loader intentionally recreated each render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [search, sort, reloadKey]);

  async function load() {
    try {
      const res = await apiFetch('/reservas/listar');
      let arr = Array.isArray(res) ? res : [];
      arr = arr.filter(r => r.status === 'Finalizada');
      if (search) arr = arr.filter(r => (r.pessoa_nome && r.pessoa_nome.toLowerCase().includes(search.toLowerCase())) || (r.livro_titulo && r.livro_titulo.toLowerCase().includes(search.toLowerCase())));
      
      // Sort
      if (sort === 'dataValidade') arr.sort((a, b) => new Date(a.dataValidade) - new Date(b.dataValidade));
      else if (sort === 'pessoa_nome') arr.sort((a, b) => (a.pessoa_nome || '').localeCompare(b.pessoa_nome || ''));
      else if (sort === 'livro_titulo') arr.sort((a, b) => (a.livro_titulo || '').localeCompare(b.livro_titulo || ''));
      
      setData(arr);
    } catch (err) {
      console.error('Erro ao carregar reservas confirmadas', err);
      if (err && (err.status === 401 || err.status === 403)) {
        handleAuthError();
        return;
      }
      setData([]);
    }
  }

  async function handleDeleteAll() {
    if (!data.length) {
      alert('Nenhum registro para deletar');
      return;
    }
    if (!window.confirm(`Tem certeza que deseja deletar todas as ${data.length} reserva(s)?`)) {
      return;
    }
    try {
      let deletedCount = 0;
      for (const item of data) {
        try {
          await apiFetch(`/reservas/excluir/${item.id}`, { method: 'DELETE' });
          deletedCount++;
        } catch (err) {
          console.error(`Erro ao deletar item ${item.id}:`, err);
        }
      }
      await load();
      alert(`${deletedCount} reserva(s) deletada(s) com sucesso`);
    } catch (err) {
      console.error('Erro ao deletar reservas', err);
      alert(err.message || 'Erro ao deletar');
    }
  }

  return (
    <div>
      <h3>Reservas confirmadas</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn" onClick={() => saveCsv('reservas_confirmadas.csv', data, cols)}>Salvar CSV</button>
        <button className="btn" onClick={handleDeleteAll} style={{marginLeft: 'auto', backgroundColor: '#dc3545', color: 'white'}} disabled={!data.length}>Limpar Reservas</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} onClick={() => setSort(c.key)} style={{cursor: 'pointer'}}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id}>
              <td>{r.pessoa_nome}</td>
              <td>{r.livro_titulo}</td>
              <td>{r.status}</td>
              <td>{r.dataValidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
