import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function GeneroTable() {
  const [generos, setGeneros] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nome');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ nome: '' });

  useEffect(() => {
    loadGeneros();
  }, [sort, page]);

  async function loadGeneros() {
    let url = `/generos/listar`;
    const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    let arr = Array.isArray(res) ? res : [];
    if (search) arr = arr.filter(g => g.nome && g.nome.toLowerCase().includes(search.toLowerCase()));
    setGeneros(arr);
  }

  async function handleDelete(id) {
    await apiFetch(`/generos/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    loadGeneros();
  }

  async function handleBulkDelete() {
    await Promise.all(selected.map(id => apiFetch(`/generos/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }))); 
    setSelected([]);
    loadGeneros();
  }

  function handleEdit(genero) {
    setEditing(genero.id);
    setEditData({ nome: genero.nome });
  }

  async function handleEditSave() {
    await apiFetch(`/generos/alterar`, {
      method: 'PUT',
      body: JSON.stringify({ id: editing, ...editData }),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    });
    setEditing(null);
    loadGeneros();
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <h2>Gêneros</h2>
      <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? generos.map(a => a.id) : [])} checked={selected.length === generos.length && generos.length > 0} /></th>
            <th onClick={() => setSort('nome')}>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {generos.map(genero => (
            <tr key={genero.id}>
              <td><input type="checkbox" checked={selected.includes(genero.id)} onChange={() => handleSelect(genero.id)} /></td>
              <td>{editing === genero.id ? <input value={editData.nome} onChange={e => setEditData({ ...editData, nome: e.target.value })} /> : genero.nome}</td>
              <td>
                {editing === genero.id ? (
                  <button onClick={handleEditSave}>Salvar</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(genero)}>Editar</button>
                    <button onClick={() => handleDelete(genero.id)}>Excluir</button>
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
