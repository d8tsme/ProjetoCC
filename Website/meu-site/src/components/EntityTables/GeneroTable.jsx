import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import saveCsv from '../../utils/csv';
import EditGeneroCard from '../EntityForms/EditGeneroCard';

export default function GeneroTable() {
  const [generos, setGeneros] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nome');
  const [editOpen, setEditOpen] = useState(false);
  const [editingGenero, setEditingGenero] = useState(null);
  const cols = [{key:'nome', label:'Nome'}];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadGeneros();
  }, [sort, /*page omitted*/ search]);

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
    setEditingGenero(genero);
    setEditOpen(true);
  }

  async function handleEditSave() {
    loadGeneros();
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <h2>Gêneros</h2>
      <div className="table-controls" style={{display:'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems:'center'}}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn" onClick={() => saveCsv('generos.csv', generos, cols)}>Salvar CSV</button>
        <div style={{marginLeft:'auto'}}>
          <button className="btn bulk-delete-btn" onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
        </div>
      </div>
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
              <td>{genero.nome}</td>
              <td>
                <>
                  <button onClick={() => handleEdit(genero)}>Editar</button>
                  <button onClick={() => handleDelete(genero.id)}>Excluir</button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination removed - we show all rows */}
      <EditGeneroCard open={editOpen} onClose={() => setEditOpen(false)} onUpdated={handleEditSave} genero={editingGenero} />
    </div>
  );
}
