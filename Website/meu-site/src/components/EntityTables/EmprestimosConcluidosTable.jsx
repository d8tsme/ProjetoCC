import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import handleAuthError from '../../utils/authError';
import saveCsv from '../../utils/csv';

export default function EmprestimosConcluidosTable({ reloadKey }) {
  useEffect(()=>{
    console.log('EmprestimosConcluidosTable mounted reloadKey=', reloadKey);
    return ()=>{ console.log('EmprestimosConcluidosTable unmounted'); }
  }, [reloadKey]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('dataDevolucao');
  const cols = [
    { key: 'pessoa_nome', label: 'Pessoa' },
    { key: 'livro_titulo', label: 'Livro' },
    { key: 'status', label: 'Status' },
    { key: 'dataDevolucao', label: 'Data devolução' }
  ];

  // avoid exhaustive-deps warning: loader intentionally recreated each render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [search, sort, reloadKey]);

  async function load() {
    try {
      const res = await apiFetch('/emprestimos/listar');
      let arr = Array.isArray(res) ? res : [];
      arr = arr.filter(e => e.status === 'Devolvido' || e.status === 'Finalizado');
      if (search) arr = arr.filter(r => (r.pessoa_nome && r.pessoa_nome.toLowerCase().includes(search.toLowerCase())) || (r.livro_titulo && r.livro_titulo.toLowerCase().includes(search.toLowerCase())));
      
      // Sort
      if (sort === 'dataDevolucao') arr.sort((a, b) => new Date(a.dataDevolucao) - new Date(b.dataDevolucao));
      else if (sort === 'pessoa_nome') arr.sort((a, b) => (a.pessoa_nome || '').localeCompare(b.pessoa_nome || ''));
      else if (sort === 'livro_titulo') arr.sort((a, b) => (a.livro_titulo || '').localeCompare(b.livro_titulo || ''));
      
      setData(arr);
    } catch (err) {
      console.error('Erro ao carregar emprestimos concluidos', err);
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
    if (!window.confirm(`Tem certeza que deseja deletar todos os ${data.length} registro(s)?`)) {
      return;
    }
    try {
      let deletedCount = 0;
      for (const item of data) {
        try {
          await apiFetch(`/emprestimos/excluir/${item.id}`, { method: 'DELETE' });
          deletedCount++;
        } catch (err) {
          console.error(`Erro ao deletar item ${item.id}:`, err);
        }
      }
      await load();
      alert(`${deletedCount} registro(s) deletado(s) com sucesso`);
    } catch (err) {
      console.error('Erro ao deletar registros', err);
      alert(err.message || 'Erro ao deletar');
    }
  }

  return (
    <div>
      <h3>Processos concluídos</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn" onClick={() => saveCsv('emprestimos_concluidos.csv', data, cols)}>Salvar CSV</button>
        <button className="btn" onClick={handleDeleteAll} style={{marginLeft: 'auto', backgroundColor: '#dc3545', color: 'white'}} disabled={!data.length}>Limpar Processos</button>
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
              <td>{r.dataDevolucao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
