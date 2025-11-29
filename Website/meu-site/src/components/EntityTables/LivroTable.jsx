import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function LivroTable() {
  const [livros, setLivros] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('titulo');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ titulo: '', paginas: '', autorId: '', generoId: '', isbn: '', anoPublicacao: '', foto: '' });

  useEffect(() => {
    loadLivros();
  }, [sort, page]);

  async function loadLivros() {
    let url = `/livros/listar`;
    const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    let arr = Array.isArray(res) ? res : [];
    if (search) arr = arr.filter(l => l.titulo && l.titulo.toLowerCase().includes(search.toLowerCase()));
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
    setEditing(livro.id);
    setEditData({
      titulo: livro.titulo,
      paginas: livro.paginas,
      autorId: livro.autorId,
      generoId: livro.generoId,
      isbn: livro.isbn,
      anoPublicacao: livro.anoPublicacao,
      foto: livro.foto
    });
  }

  async function handleEditSave() {
    try {
      await apiFetch(`/livros/alterar`, {
        method: 'PUT',
        body: JSON.stringify({ id: editing, ...editData }),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setEditing(null);
      await loadLivros();
    } catch (err) {
      console.error('Erro ao salvar alterações do livro', err);
      alert(err.message || 'Erro ao salvar');
    }
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <h2>Livros</h2>
      <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? livros.map(a => a.id) : [])} checked={selected.length === livros.length && livros.length > 0} /></th>
            <th onClick={() => setSort('titulo')}>Título</th>
            <th>Páginas</th>
            <th>Autor</th>
            <th>Gênero</th>
            <th>ISBN</th>
            <th>Ano</th>
            <th>Foto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map(livro => (
            <tr key={livro.id}>
              <td><input type="checkbox" checked={selected.includes(livro.id)} onChange={() => handleSelect(livro.id)} /></td>
              <td>{editing === livro.id ? <input value={editData.titulo} onChange={e => setEditData({ ...editData, titulo: e.target.value })} /> : livro.titulo}</td>
              <td>{editing === livro.id ? <input value={editData.paginas} onChange={e => setEditData({ ...editData, paginas: e.target.value })} /> : livro.paginas}</td>
              <td>{editing === livro.id ? <input value={editData.autorId} onChange={e => setEditData({ ...editData, autorId: e.target.value })} /> : livro.autorId}</td>
              <td>{editing === livro.id ? <input value={editData.generoId} onChange={e => setEditData({ ...editData, generoId: e.target.value })} /> : livro.generoId}</td>
              <td>{editing === livro.id ? <input value={editData.isbn} onChange={e => setEditData({ ...editData, isbn: e.target.value })} /> : livro.isbn}</td>
              <td>{editing === livro.id ? <input value={editData.anoPublicacao} onChange={e => setEditData({ ...editData, anoPublicacao: e.target.value })} /> : livro.anoPublicacao}</td>
              <td>{editing === livro.id ? <input value={editData.foto} onChange={e => setEditData({ ...editData, foto: e.target.value })} /> : livro.foto ? <img src={livro.foto} alt="Foto" style={{maxWidth:40,maxHeight:40}} /> : null}</td>
              <td>
                {editing === livro.id ? (
                  <button onClick={handleEditSave}>Salvar</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(livro)}>Editar</button>
                    <button onClick={() => handleDelete(livro.id)}>Excluir</button>
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
