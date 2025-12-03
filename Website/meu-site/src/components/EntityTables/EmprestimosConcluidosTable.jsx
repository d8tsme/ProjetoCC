import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import saveCsv from '../../utils/csv';

export default function EmprestimosConcluidosTable({ reloadKey }) {
  useEffect(()=>{
    console.log('EmprestimosConcluidosTable mounted reloadKey=', reloadKey);
    return ()=>{ console.log('EmprestimosConcluidosTable unmounted'); }
  }, [reloadKey]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const cols = [
    { key: 'pessoa_nome', label: 'Pessoa' },
    { key: 'livro_titulo', label: 'Livro' },
    { key: 'status', label: 'Status' },
    { key: 'dataDevolucao', label: 'Data devolução' }
  ];

  // avoid exhaustive-deps warning: loader intentionally recreated each render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [search, reloadKey]);

  async function load() {
    try {
      const res = await apiFetch('/emprestimos/listar');
      let arr = Array.isArray(res) ? res : [];
      arr = arr.filter(e => e.status === 'Finalizado');
      if (search) arr = arr.filter(r => (r.pessoa_nome && r.pessoa_nome.toLowerCase().includes(search.toLowerCase())) || (r.livro_titulo && r.livro_titulo.toLowerCase().includes(search.toLowerCase())));
      setData(arr);
    } catch (err) {
      console.error('Erro ao carregar emprestimos concluidos', err);
      if (err && (err.status === 401 || err.status === 403)) {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setData([]);
    }
  }

  return (
    <div>
      <h3>Processos concluídos</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn" onClick={() => saveCsv('emprestimos_concluidos.csv', data, cols)}>Salvar CSV</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            {cols.map(c => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id}>
              <td>{r.pessoa_nome}</td>
              <td>{r.livro_titulo}</td>
              <td>{r.status}</td>
              <td>{r.dataDevolucao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
