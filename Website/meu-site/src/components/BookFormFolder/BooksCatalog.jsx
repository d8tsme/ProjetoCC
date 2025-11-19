import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiFetch from '../../utils/apiFetch';
import BookCard from './BookCard';
import EditLivroCard from './EditLivroCard';

function parseQuery(qs) {
  const params = new URLSearchParams(qs);
  return { search: params.get('search') || '' };
}

export default function BooksCatalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [selected, setSelected] = useState({});
  const [sort, setSort] = useState('titulo-asc');
  const location = useLocation();
  const navigate = useNavigate();

  const q = useMemo(() => parseQuery(location.search), [location.search]);
  const [searchTerm, setSearchTerm] = useState(q.search || '');

  async function load() {
    setLoading(true);
    try {
      const json = await apiFetch('/livros/listar');
      const items = Array.isArray(json) ? json : json?.data ?? json?.books ?? [];
      setBooks(items);
    } catch (e) { setError(e.message || 'Erro'); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    // if URL search changed externally, update local input
    setSearchTerm(q.search || '');
  }, [q.search]);

  async function remove(book) {
    if (!window.confirm(`Remover o livro "${book.titulo}"? Esta ação marca como removido.`)) return;
    try {
      const payload = { id: book.id, status: 'Removido' };
      await apiFetch(`/livros/atualizar/${book.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      await load();
    } catch (e) { alert('Erro ao remover: ' + (e.message || e)); }
  }

  function onSelect(book, isSelected) {
    setSelected(s => ({ ...s, [book.id || book.isbn]: isSelected }));
  }

  function selectAll(checked) {
    const map = {};
    filtered.forEach(b => { map[b.id || b.isbn] = checked; });
    setSelected(map);
  }

  async function bulkRemove() {
    const ids = Object.entries(selected).filter(([k,v]) => v).map(([k]) => k);
    if (ids.length === 0) return alert('Nenhum livro selecionado');
    if (!window.confirm(`Marcar ${ids.length} livros como removidos?`)) return;
    try {
      await Promise.all(ids.map(id => apiFetch(`/livros/atualizar/${id}`, { method: 'PUT', body: JSON.stringify({ id, status: 'Removido' }) })));
      await load();
      setSelected({});
    } catch (e) { alert('Erro no bulk: ' + (e.message || e)); }
  }

  function downloadCSV(useSelected = false) {
    const rows = useSelected ? books.filter(b => selected[b.id || b.isbn]) : books;
    if (rows.length === 0) { alert('Nenhum registro para exportar'); return; }
    const header = ['id','titulo','autor','genero','isbn','paginas','anoPublicacao','status'];
    const csv = [header.join(',')].concat(rows.map(r => [r.id,`"${(r.titulo||'').replace(/"/g,'""') }"`,r.autorNome||r.autor,r.generoNome||r.genero,r.isbn,r.paginas,r.anoPublicacao,r.status].join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bibliotech_books_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  // computed filtered + sorted
  const filtered = useMemo(() => {
    const st = (searchTerm || '').toLowerCase().trim();
    let out = books.slice();
    if (st) {
      out = out.filter(b => (b.titulo||'').toLowerCase().includes(st) || (b.autorNome||b.autor||'').toLowerCase().includes(st) || (b.generoNome||b.genero||'').toLowerCase().includes(st) || (b.isbn||'').toLowerCase().includes(st));
    }
    if (sort === 'titulo-asc') out.sort((a,b)=> (a.titulo||'').localeCompare(b.titulo||''));
    else if (sort === 'titulo-desc') out.sort((a,b)=> (b.titulo||'').localeCompare(a.titulo||''));
    else if (sort === 'ano-desc') out.sort((a,b)=> (b.anoPublicacao||0) - (a.anoPublicacao||0));
    else if (sort === 'paginas-desc') out.sort((a,b)=> (b.paginas||0) - (a.paginas||0));
    return out;
  }, [books, searchTerm, sort]);

  function onSearchSubmit(e) {
    e.preventDefault();
    // update URL param
    const params = new URLSearchParams(location.search);
    if (searchTerm) params.set('search', searchTerm); else params.delete('search');
    navigate({ pathname: location.pathname, search: params.toString() });
  }

  const errorText = typeof error === 'string' ? error : (error && (error.message || (error.code ? `Erro ${error.code}` : String(error)))) || null;
  if (loading) return <div>Carregando catálogo...</div>;
  if (error) return <div className="error-message">Erro: {errorText}</div>;

  return (
    <div>
      <div className="catalog-controls" style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,gap:12,flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            <button className="btn" onClick={() => selectAll(true)}>Tudo</button>
            <button className="btn" onClick={() => selectAll(false)}>Limpar</button>
            <button className="btn btn-danger" onClick={bulkRemove} title="Marcar selecionados como removidos">Remover</button>
            <button className="btn" onClick={() => downloadCSV(false)}>CSV todos</button>
            <button className="btn" onClick={() => downloadCSV(true)}>CSV sel.</button>
          </div>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <form onSubmit={onSearchSubmit} style={{display:'flex',gap:8}}>
            <input placeholder="Pesquisar título, autor, ISBN" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid var(--border-light)',minWidth:160}} />
            <button className="btn" type="submit">Buscar</button>
          </form>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:8,borderRadius:8}}>
            <option value="titulo-asc">Título ↑</option>
            <option value="titulo-desc">Título ↓</option>
            <option value="ano-desc">Ano ↓</option>
            <option value="paginas-desc">Páginas ↓</option>
          </select>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
        {filtered.map(b => (
          <BookCard key={b.id || b.isbn} book={b} onEdit={() => setEditBook(b)} onRemove={() => remove(b)} onSelect={onSelect} selected={!!selected[b.id || b.isbn]} />
        ))}
      </div>

      <EditLivroCard book={editBook} open={!!editBook} onClose={() => { setEditBook(null); load(); }} />
    </div>
  );
}
