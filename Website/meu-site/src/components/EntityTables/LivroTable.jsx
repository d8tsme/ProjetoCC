import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import saveCsv from '../../utils/csv';
import EditLivroCard from '../AddLivroCard/EditLivroCard';

export default function LivroTable() {
  const [livros, setLivros] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('titulo');
  const [editOpen, setEditOpen] = useState(false);
  const [editingLivro, setEditingLivro] = useState(null);
  // filter and view states
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authorFilter, setAuthorFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const cols = [{key:'titulo', label:'Título'},{key:'autorNome', label:'Autor'},{key:'generoNome', label:'Gênero'},{key:'isbn', label:'ISBN'},{key:'status', label:'Status'}];

  useEffect(() => {
    loadLivros();
  }, [sort]);

  useEffect(() => {
    // load authors and genres for filters
    let cancelled = false;
    async function loadMeta() {
      try {
        const a = await apiFetch('/autores/listar');
        const g = await apiFetch('/generos/listar');
        if (!cancelled) {
          setAuthors(Array.isArray(a) ? a : []);
          setGenres(Array.isArray(g) ? g : []);
        }
      } catch (err) {
        console.error('Erro ao carregar metadados para filtro', err);
      }
    }
    loadMeta();
    return () => { cancelled = true; }
  }, []);

  async function loadLivros() {
    let url = `/livros/listar`;
    const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    let arr = Array.isArray(res) ? res : [];
    setLivros(arr);
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/livros/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      await loadLivros();
    } catch (err) {
      console.error('Erro ao excluir livro', err);
      alert(err.message || 'Erro ao excluir livro');
    }
  }

  async function handleBulkDelete() {
    try {
      await Promise.all(selected.map(id => apiFetch(`/livros/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }))); 
      setSelected([]);
      await loadLivros();
    } catch (err) {
      console.error('Erro ao excluir livros em lote', err);
      alert(err.message || 'Erro ao excluir livros');
    }
  }

  function handleEdit(livro) {
    setEditingLivro(livro);
    setEditOpen(true);
  }

  async function handleEditSave() {
    await loadLivros();
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  // derived filtered and sorted array
  let filteredLivros = livros.filter(l => {
    if (search && (!l.titulo || !l.titulo.toLowerCase().includes(search.toLowerCase()))) return false;
    if (authorFilter && String(l.autorId) !== String(authorFilter) && String(l.autor) !== String(authorFilter) && String(l.autorNome) !== String(authorFilter)) return false;
    if (genreFilter && String(l.generoId) !== String(genreFilter) && String(l.generoNome) !== String(genreFilter)) return false;
    if (statusFilter && String(l.status) !== String(statusFilter)) return false;
    return true;
  });

  // Sort the filtered array
  if (sort === 'titulo') filteredLivros.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
  else if (sort === 'paginas') filteredLivros.sort((a, b) => (a.paginas || 0) - (b.paginas || 0));
  else if (sort === 'autor') filteredLivros.sort((a, b) => (a.autorNome || '').localeCompare(b.autorNome || ''));
  else if (sort === 'genero') filteredLivros.sort((a, b) => (a.generoNome || '').localeCompare(b.generoNome || ''));
  else if (sort === 'isbn') filteredLivros.sort((a, b) => (a.isbn || '').localeCompare(b.isbn || ''));
  else if (sort === 'ano') filteredLivros.sort((a, b) => (a.anoPublicacao || '').localeCompare(b.anoPublicacao || ''));

  return (
    <div>
      <h2>Livros</h2>
      <div className="table-controls" style={{display:'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems:'center'}}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={authorFilter} onChange={e => setAuthorFilter(e.target.value)}>
          <option value="">Todos autores</option>
          {authors.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">Todos gêneros</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Todos status</option>
          <option value="Disponível">Disponível</option>
          <option value="Emprestado">Emprestado</option>
          <option value="Reservado">Reservado</option>
        </select>
        <button className="btn" onClick={() => saveCsv('livros.csv', (filteredLivros.length ? filteredLivros : livros), cols)}>Salvar CSV</button>
        <div style={{marginLeft:'auto', display:'flex', gap:'0.5rem', alignItems:'center'}}>
          <button className="btn bulk-delete-btn" onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
          <button className="btn" onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}>{viewMode === 'table' ? 'Ver em Cards' : 'Ver em Tabela'}</button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? livros.map(a => a.id) : [])} checked={selected.length === livros.length && livros.length > 0} /></th>
            <th onClick={() => setSort('titulo')} style={{cursor: 'pointer'}}>Título</th>
            <th onClick={() => setSort('paginas')} style={{cursor: 'pointer'}}>Páginas</th>
            <th onClick={() => setSort('autor')} style={{cursor: 'pointer'}}>Autor</th>
            <th onClick={() => setSort('genero')} style={{cursor: 'pointer'}}>Gênero</th>
            <th onClick={() => setSort('isbn')} style={{cursor: 'pointer'}}>ISBN</th>
            <th onClick={() => setSort('ano')} style={{cursor: 'pointer'}}>Ano</th>
            <th>Status</th>
            <th>Foto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {(filteredLivros.length ? filteredLivros : livros).map(livro => (
            <tr key={livro.id}>
              <td><input type="checkbox" checked={selected.includes(livro.id)} onChange={() => handleSelect(livro.id)} /></td>
              <td>{livro.titulo}</td>
              <td>{livro.paginas}</td>
              <td>{livro.autorId}</td>
              <td>{livro.generoId}</td>
              <td>{livro.isbn}</td>
              <td>{livro.anoPublicacao}</td>
              <td><span style={{
                backgroundColor: livro.status === 'Disponível' ? 'green' : livro.status === 'Emprestado' ? 'red' : 'blue',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>{livro.status}</span></td>
              <td>{livro.foto ? <img src={livro.foto} alt="Foto" style={{maxWidth:40,maxHeight:40}} /> : null}</td>
              <td>
                <>
                  <button className="btn btn-small" onClick={() => handleEdit(livro)}>Editar</button>
                  <button className="btn btn-small" onClick={() => handleDelete(livro.id)}>Excluir</button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <div className="records-card-view">
          {filteredLivros.map(livro => (
            <div key={livro.id} className="record-card">
              <div className="card-left">
                <div className="book-photo-small">{livro.foto ? <img src={livro.foto} alt="Capa" /> : 'sem imagem'}</div>
              </div>
              <div className="card-content">
                <div className="card-title">{livro.titulo}</div>
                <div className="card-meta">{livro.autorNome || livro.autorId} • {livro.generoNome || livro.generoId}</div>
                <div className="card-status">
                  <span style={{
                    backgroundColor: livro.status === 'Disponível' ? 'green' : livro.status === 'Emprestado' ? 'red' : 'blue',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>{livro.status}</span>
                </div>
                <div className="card-actions">
                  <button className="btn" onClick={() => handleEdit(livro)}>Editar</button>
                  <button className="btn" onClick={() => handleDelete(livro.id)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <EditLivroCard open={editOpen} onClose={() => setEditOpen(false)} onUpdated={handleEditSave} livro={editingLivro} />
    </div>
  );
}
