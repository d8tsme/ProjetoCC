import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import handleAuthError from '../../utils/authError';
import saveCsv from '../../utils/csv';

export default function EmprestimosAtivosTable({ onDevolvido, reloadKey }) {
  useEffect(() => {
    console.log('EmprestimosAtivosTable mounted, reloadKey=', reloadKey);
    return () => { console.log('EmprestimosAtivosTable unmounted'); };
  }, [reloadKey]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('dataEmprestimo');
  const cols = [
    { key: 'dataEmprestimo', label: 'Data Empréstimo' },
    { key: 'pessoa_nome', label: 'Pessoa' },
    { key: 'livro_titulo', label: 'Livro' },
    { key: 'status', label: 'Status' }
  ];

  // avoid exhaustive-deps warning: loader intentionally recreated each render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [search, sort, reloadKey]);

  async function load() {
    try {
      const res = await apiFetch('/emprestimos/listar');
      let arr = Array.isArray(res) ? res : [];
      arr = arr.filter(e => e.status === 'Em andamento');
      if (search) arr = arr.filter(r => (r.pessoa_nome && r.pessoa_nome.toLowerCase().includes(search.toLowerCase())) || (r.livro_titulo && r.livro_titulo.toLowerCase().includes(search.toLowerCase())));
      
      // Sort
      if (sort === 'dataEmprestimo') arr.sort((a, b) => new Date(a.dataEmprestimo) - new Date(b.dataEmprestimo));
      else if (sort === 'pessoa_nome') arr.sort((a, b) => (a.pessoa_nome || '').localeCompare(b.pessoa_nome || ''));
      else if (sort === 'livro_titulo') arr.sort((a, b) => (a.livro_titulo || '').localeCompare(b.livro_titulo || ''));
      
      setData(arr);
    } catch (err) {
      console.error('Erro ao carregar emprestimos ativos', err);
      if (err && (err.status === 401 || err.status === 403)) {
        handleAuthError();
        return;
      }
      setData([]);
    }
  }

  async function handleDevolver(emprestimo) {
    try {
      await apiFetch(`/emprestimos/devolucao/${emprestimo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emprestimo.id, livroId: emprestimo.livroId, pessoaId: emprestimo.pessoaId })
      });
      // update local state optimistically and then refetch
      setData(d => d.filter(item => item.id !== emprestimo.id));
      if (onDevolvido) onDevolvido();
      await load();
    } catch (err) {
      console.error('Erro ao devolver livro', err);
      if (err && (err.status === 401 || err.status === 403)) {
        handleAuthError();
        return;
      }
      alert(err.message || 'Erro ao devolver');
    }
  }

  return (
    <div>
      <h3>Processos ativos</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn" onClick={() => saveCsv('emprestimos_ativos.csv', data, cols)}>Salvar CSV</button>
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
              <td>{r.dataEmprestimo}</td>
              <td>{r.pessoa_nome}</td>
              <td>{r.livro_titulo}</td>
              <td>{r.status}</td>
              <td><button className="btn btn-small" onClick={() => handleDevolver(r)}>Devolver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
