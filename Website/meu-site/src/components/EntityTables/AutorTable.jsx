import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import saveCsv from '../../utils/csv';
import EditAutorCard from '../EntityForms/EditAutorCard';

export default function AutorTable() {
  const [autores, setAutores] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nome');
  const [viewMode, setViewMode] = useState('table');
  const [hasPhotoFilter, setHasPhotoFilter] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editingAutor, setEditingAutor] = useState(null);
  const cols = [{key:'nome', label:'Nome'},{key:'foto',label:'Foto'},{key:'status',label:'Status'}];

  // intentionally call loadAutores when sort or search changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAutores();
  }, [sort, search]);

  async function loadAutores() {
    let url = `/autores/listar`;
    try {
      const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      let arr = Array.isArray(res) ? res : [];
      if (search) arr = arr.filter(a => a.nome && a.nome.toLowerCase().includes(search.toLowerCase()));
      // Sort the array
      if (sort === 'nome') arr.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
      else if (sort === 'foto') arr.sort((a, b) => {
        const aHasFoto = a.foto ? 1 : 0;
        const bHasFoto = b.foto ? 1 : 0;
        return bHasFoto - aHasFoto; // Sort by has foto first
      });
      setAutores(arr);
    } catch (err) {
      console.error('Erro ao carregar autores', err);
      alert(err.message || 'Erro ao carregar autores');
    }
  }

  async function handleDelete(id) {
    try {
      const result = await apiFetch(`/autores/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      console.log('autor delete result:', result);
      await loadAutores();
    } catch (err) {
      console.error('Erro ao excluir autor', err);
      alert(err.message || 'Erro ao excluir autor');
    }
  }

  async function handleBulkDelete() {
    try {
      const results = await Promise.all(selected.map(id => apiFetch(`/autores/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })));
      console.log('autor bulk delete results:', results);
      setSelected([]);
      await loadAutores();
    } catch (err) {
      console.error('Erro ao excluir autores em lote', err);
      alert(err.message || 'Erro ao excluir autores');
    }
  }

  function handleEdit(autor) {
    setEditingAutor(autor);
    setEditOpen(true);
  }

  async function handleEditSave() {
    await loadAutores();
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  const filteredAutores = autores.filter(a => {
    if (search && (!a.nome || !a.nome.toLowerCase().includes(search.toLowerCase()))) return false;
    if (hasPhotoFilter === 'with' && !a.foto) return false;
    if (hasPhotoFilter === 'without' && a.foto) return false;
    return true;
  });

  return (
    <div>
      <h2>Autores</h2>
      <div className="table-controls" style={{display:'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems:'center'}}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={hasPhotoFilter} onChange={e => setHasPhotoFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="with">Com foto</option>
          <option value="without">Sem foto</option>
        </select>
        <button onClick={() => saveCsv('autores.csv', autores, cols)} className="btn">Salvar CSV</button>
        <div style={{ marginLeft:'auto', display:'flex', gap:'0.5rem', alignItems:'center' }}>
          <button className="btn bulk-delete-btn" onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
          <button className="btn" onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}>{viewMode === 'table' ? 'Ver em Cards' : 'Ver em Tabela'}</button>
        </div>
      </div>
      {viewMode === 'table' ? (
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
              <td>{autor.nome}</td>
              <td>{autor.foto ? <img src={autor.foto} alt="Foto" style={{maxWidth:40,maxHeight:40}} /> : null}</td>
              <td>
                <>
                  <button onClick={() => handleEdit(autor)}>Editar</button>
                  <button onClick={() => handleDelete(autor.id)}>Excluir</button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <div className="records-card-view">
          {filteredAutores.map(autor => (
            <div key={autor.id} className="record-card">
              <div className="book-photo-small">{autor.foto ? <img src={autor.foto} alt={autor.nome} /> : 'sem imagem'}</div>
              <div className="card-content">
                <div className="card-title">{autor.nome}</div>
                <div className="card-meta">{autor.email || ''}</div>
                <div className="card-actions">
                  <button className="btn" onClick={() => handleEdit(autor)}>Editar</button>
                  <button className="btn" onClick={() => handleDelete(autor.id)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <EditAutorCard open={editOpen} onClose={() => setEditOpen(false)} onUpdated={handleEditSave} autor={editingAutor} />
    </div>
  );
}
