import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function EmprestimoTable() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ livroId: '', pessoaId: '' });

  useEffect(() => {
    loadEmprestimos();
  }, [search, sort, page]);

  async function loadEmprestimos() {
    let url = `/emprestimos/listar`;
    const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    setEmprestimos(Array.isArray(res) ? res : []);
  }

  async function handleDelete(id) {
    await apiFetch(`/emprestimos/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    loadEmprestimos();
  }

  async function handleBulkDelete() {
    await Promise.all(selected.map(id => apiFetch(`/emprestimos/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }))); 
    setSelected([]);
    loadEmprestimos();
  }

  function handleEdit(emp) {
    setEditing(emp.id);
    setEditData({ livroId: emp.livroId, pessoaId: emp.pessoaId });
  }

  async function handleEditSave() {
    await apiFetch(`/emprestimos/alterar`, {
      method: 'PUT',
      body: JSON.stringify({ id: editing, ...editData }),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    });
    setEditing(null);
    loadEmprestimos();
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <h2>Empréstimos</h2>
      <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? emprestimos.map(a => a.id) : [])} checked={selected.length === emprestimos.length && emprestimos.length > 0} /></th>
            <th onClick={() => setSort('id')}>ID</th>
            <th>Livro</th>
            <th>Pessoa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {emprestimos.map(emp => (
            <tr key={emp.id}>
              <td><input type="checkbox" checked={selected.includes(emp.id)} onChange={() => handleSelect(emp.id)} /></td>
              <td>{emp.id}</td>
              <td>{editing === emp.id ? <input value={editData.livroId} onChange={e => setEditData({ ...editData, livroId: e.target.value })} /> : emp.livroId}</td>
              <td>{editing === emp.id ? <input value={editData.pessoaId} onChange={e => setEditData({ ...editData, pessoaId: e.target.value })} /> : emp.pessoaId}</td>
              <td>
                {editing === emp.id ? (
                  <button onClick={handleEditSave}>Salvar</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(emp)}>Editar</button>
                    <button onClick={() => handleDelete(emp.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage(page + 1)}>Próxima</button>
      </div>
    </div>
  );
}
