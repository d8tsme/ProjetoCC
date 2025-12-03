import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import saveCsv from '../../utils/csv';

export default function EmprestimoTable() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id');
  const [statusFilter, setStatusFilter] = useState('');
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ livroId: '', pessoaId: '' });
  const cols = [{key:'pessoa_nome', label:'Pessoa'},{key:'livro_titulo', label:'Livro'},{key:'status', label:'Status'}];

  useEffect(() => {
    loadEmprestimos();
  }, [search, sort]);

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

  const filteredEmprestimos = emprestimos.filter(e => {
    if (search && (!e.livro_titulo || !e.livro_titulo.toLowerCase().includes(search.toLowerCase())) && !String(e.id).includes(search)) return false;
    if (statusFilter && String(e.status) !== String(statusFilter)) return false;
    return true;
  });

  // Sort the filtered array
  if (sort === 'id') filteredEmprestimos.sort((a, b) => (a.id || 0) - (b.id || 0));
  else if (sort === 'livro') filteredEmprestimos.sort((a, b) => (a.livro_titulo || '').localeCompare(b.livro_titulo || ''));
  else if (sort === 'pessoa') filteredEmprestimos.sort((a, b) => (a.pessoa_nome || '').localeCompare(b.pessoa_nome || ''));

  return (
    <div>
      <h2>Empréstimos</h2>
      <div className="table-controls table-toolbar" style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'center'}}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Todos status</option>
          <option value="Disponível">Disponível</option>
          <option value="Emprestado">Emprestado</option>
        </select>
        <button className="btn" onClick={() => saveCsv('emprestimos.csv', filteredEmprestimos.length ? filteredEmprestimos : emprestimos, cols)}>Salvar CSV</button>
        <div style={{marginLeft:'auto'}}>
          <button className="btn bulk-delete-btn" onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? emprestimos.map(a => a.id) : [])} checked={selected.length === emprestimos.length && emprestimos.length > 0} /></th>
            <th onClick={() => setSort('id')} style={{cursor: 'pointer'}}>ID</th>
            <th onClick={() => setSort('livro')} style={{cursor: 'pointer'}}>Livro</th>
            <th onClick={() => setSort('pessoa')} style={{cursor: 'pointer'}}>Pessoa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {(filteredEmprestimos.length ? filteredEmprestimos : emprestimos).map(emp => (
            <tr key={emp.id}>
              <td><input type="checkbox" checked={selected.includes(emp.id)} onChange={() => handleSelect(emp.id)} /></td>
              <td>{emp.id}</td>
              <td>{editing === emp.id ? <input value={editData.livroId} onChange={e => setEditData({ ...editData, livroId: e.target.value })} /> : emp.livroId}</td>
              <td>{editing === emp.id ? <input value={editData.pessoaId} onChange={e => setEditData({ ...editData, pessoaId: e.target.value })} /> : emp.pessoaId}</td>
              <td>
                {editing === emp.id ? (
                  <button className="btn btn-small" onClick={handleEditSave}>Salvar</button>
                ) : (
                  <>
                    <button className="btn btn-small" onClick={() => handleEdit(emp)}>Editar</button>
                    <button className="btn btn-small" onClick={() => handleDelete(emp.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination removed */}
    </div>
  );
}
