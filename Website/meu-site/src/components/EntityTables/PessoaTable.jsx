import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function PessoaTable() {
  const [pessoas, setPessoas] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nome');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ nome: '', email: '', telefone: '' });

  useEffect(() => {
    loadPessoas();
  }, [sort, page]);

  async function loadPessoas() {
    let url = `/pessoas/listar`;
    const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    let arr = Array.isArray(res) ? res : [];
    if (search) arr = arr.filter(p => p.nome && p.nome.toLowerCase().includes(search.toLowerCase()));
    setPessoas(arr);
  }

  async function handleDelete(id) {
    await apiFetch(`/pessoas/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    loadPessoas();
  }

  async function handleBulkDelete() {
    await Promise.all(selected.map(id => apiFetch(`/pessoas/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }))); 
    setSelected([]);
    loadPessoas();
  }

  function handleEdit(pessoa) {
    setEditing(pessoa.id);
    setEditData({ nome: pessoa.nome, email: pessoa.email, telefone: pessoa.telefone });
  }

  async function handleEditSave() {
    await apiFetch(`/pessoas/alterar`, {
      method: 'PUT',
      body: JSON.stringify({ id: editing, ...editData }),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    });
    setEditing(null);
    loadPessoas();
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <h2>Pessoas</h2>
      <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? pessoas.map(a => a.id) : [])} checked={selected.length === pessoas.length && pessoas.length > 0} /></th>
            <th onClick={() => setSort('nome')}>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map(pessoa => (
            <tr key={pessoa.id}>
              <td><input type="checkbox" checked={selected.includes(pessoa.id)} onChange={() => handleSelect(pessoa.id)} /></td>
              <td>{editing === pessoa.id ? <input value={editData.nome} onChange={e => setEditData({ ...editData, nome: e.target.value })} /> : pessoa.nome}</td>
              <td>{editing === pessoa.id ? <input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /> : pessoa.email}</td>
              <td>{editing === pessoa.id ? <input value={editData.telefone} onChange={e => setEditData({ ...editData, telefone: e.target.value })} /> : pessoa.telefone}</td>
              <td>
                {editing === pessoa.id ? (
                  <button onClick={handleEditSave}>Salvar</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(pessoa)}>Editar</button>
                    <button onClick={() => handleDelete(pessoa.id)}>Excluir</button>
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
