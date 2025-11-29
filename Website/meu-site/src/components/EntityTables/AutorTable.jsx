import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function AutorTable() {
  const [autores, setAutores] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nome');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ nome: '', foto: '' });

  useEffect(() => {
    loadAutores();
  }, [sort, page]);

  async function loadAutores() {
    let url = `/autores/listar`;
    try {
      const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      let arr = Array.isArray(res) ? res : [];
      if (search) arr = arr.filter(a => a.nome && a.nome.toLowerCase().includes(search.toLowerCase()));
      setAutores(arr);
    } catch (err) {
      console.error('Erro ao carregar autores', err);
      alert(err.message || 'Erro ao carregar autores');
    }
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/autores/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      await loadAutores();
    } catch (err) {
      console.error('Erro ao excluir autor', err);
      alert(err.message || 'Erro ao excluir autor');
    }
  }

  async function handleBulkDelete() {
    try {
      await Promise.all(selected.map(id => apiFetch(`/autores/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }))); 
      setSelected([]);
      await loadAutores();
    } catch (err) {
      console.error('Erro ao excluir autores em lote', err);
      alert(err.message || 'Erro ao excluir autores');
    }
  }

  function handleEdit(autor) {
    setEditing(autor.id);
    setEditData({ nome: autor.nome, foto: autor.foto });
  }

  async function handleEditSave() {
    try {
      await apiFetch(`/autores/alterar`, {
        method: 'PUT',
        body: JSON.stringify({ id: editing, ...editData }),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setEditing(null);
      await loadAutores();
    } catch (err) {
      console.error('Erro ao salvar autor', err);
      alert(err.message || 'Erro ao salvar autor');
    }
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <h2>Autores</h2>
      <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? autores.map(a => a.id) : [])} checked={selected.length === autores.length && autores.length > 0} /></th>
            <th onClick={() => setSort('nome')}>Nome</th>
            <th>Foto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {autores.map(autor => (
            <tr key={autor.id}>
              <td><input type="checkbox" checked={selected.includes(autor.id)} onChange={() => handleSelect(autor.id)} /></td>
              <td>{editing === autor.id ? <input value={editData.nome} onChange={e => setEditData({ ...editData, nome: e.target.value })} /> : autor.nome}</td>
              <td>{editing === autor.id ? <input value={editData.foto} onChange={e => setEditData({ ...editData, foto: e.target.value })} /> : autor.foto ? <img src={autor.foto} alt="Foto" style={{maxWidth:40,maxHeight:40}} /> : null}</td>
              <td>
                {editing === autor.id ? (
                  <button onClick={handleEditSave}>Salvar</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(autor)}>Editar</button>
                    <button onClick={() => handleDelete(autor.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginação simplificada */}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage(page + 1)}>Próxima</button>
      </div>
    </div>
  );
}
