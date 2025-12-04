import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import saveCsv from '../../utils/csv';
import EditLivroCard from '../AddLivroCard/EditLivroCard';

export default function LivroTable({ reloadKey }) {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const cols = [{key:'titulo', label:'Título'},{key:'autorNome', label:'Autor'},{key:'generoNome', label:'Gênero'},{key:'isbn', label:'ISBN'},{key:'status', label:'Status'}];

  // Determine cards per page based on window width (carousel showing 3 books)
  const getCardsPerPage = () => {
    if (windowWidth >= 1024) return 3; // Show 3 cards
    if (windowWidth >= 768) return 2;  // Show 2 cards
    return 1; // Show 1 card mobile
  };

  const cardsPerPage = getCardsPerPage();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadLivros();
    setCurrentPage(1); // Reset pagination on reload
  }, [sort, reloadKey]);

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
    const res = await apiFetch(url);
    let arr = Array.isArray(res) ? res : [];
    setLivros(arr);
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/livros/excluir/${id}`, { method: 'DELETE' });
      await loadLivros();
    } catch (err) {
      console.error('Erro ao excluir livro', err);
      alert(err.message || 'Erro ao excluir livro');
    }
  }

  async function handleBulkDelete() {
    try {
      await Promise.all(selected.map(id => apiFetch(`/livros/excluir/${id}`, { method: 'DELETE' }))); 
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
      <div className="table-controls" style={{display:'flex', gap: '0.2rem', marginBottom: '0.5rem', alignItems:'center'}}>
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
        <button className="btn-small" onClick={() => saveCsv('livros.csv', (filteredLivros.length ? filteredLivros : livros), cols)}>Salvar CSV</button>
        <div style={{marginLeft:'auto', display:'flex', flexDirection:'column', gap:'0.2rem', alignItems:'center'}}>
          <button className="btn-small" onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}>{viewMode === 'table' ? 'Ver em Cards' : 'Ver em Tabela'}</button>
          <button className="btn-small" onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
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
              <td>{livro.autorNome || livro.autorId}</td>
              <td>{livro.generoNome || livro.generoId}</td>
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
        <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
          {/* Carousel wrapper com grid */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '0 3rem',
            minHeight: '300px'
          }}>
            {/* Previous button */}
            <button 
              className="btn btn-small" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                position: 'absolute',
                left: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                height: '40px',
                width: '40px'
              }}
            >←</button>

            {/* Grid layout - mantém proporções mesmo com menos items */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cardsPerPage}, 1fr)`,
              gap: '1rem',
              flex: 1,
              alignItems: 'stretch',
              width: '100%'
            }}>
              {filteredLivros
                .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
                .map(livro => (
                <div key={livro.id} className="record-card" style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:'0.5rem',
                  padding:'1rem',
                  border:'1px solid #ccc',
                  borderRadius:'8px',
                  boxShadow:'0 2px 4px rgba(0,0,0,0.1)',
                  transition:'transform 0.2s',
                  minWidth: '0'
                }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                  {/* Imagem com tamanho fixo obrigatório */}
                  <div style={{width:'100%', height:'160px', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#f0f0f0', borderRadius:'4px', overflow:'hidden', flexShrink: 0}}>
                    {livro.foto ? <img src={livro.foto} alt="Capa" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{fontSize:'12px', color:'#999'}}>sem imagem</div>}
                  </div>
                  <div style={{flex:1, display:'flex', flexDirection:'column', gap:'0.4rem', minHeight: 0}}>
                    <div style={{fontWeight:'bold', fontSize:'13px', overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', minHeight:'32px', lineHeight:'1.6'}}>{livro.titulo}</div>
                    <div style={{fontSize:'11px', color:'#666', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{livro.autorNome || livro.autorId}</div>
                    <div style={{fontSize:'10px', color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{livro.generoNome || livro.generoId}</div>
                  </div>
                  <div>
                    <span style={{
                      backgroundColor: livro.status === 'Disponível' ? 'green' : livro.status === 'Emprestado' ? 'red' : 'blue',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      display:'inline-block'
                    }}>{livro.status}</span>
                  </div>
                  <div style={{display:'flex', gap:'0.25rem', marginTop:'auto'}}>
                    <button className="btn btn-small" onClick={() => handleEdit(livro)} style={{flex:1, fontSize:'12px'}}>Editar</button>
                    <button className="btn btn-small" onClick={() => handleDelete(livro.id)} style={{flex:1, fontSize:'12px'}}>Excluir</button>
                  </div>
                </div>
              ))}
              
              {/* Placeholder cards para manter grid completo */}
              {Array.from({length: cardsPerPage - (filteredLivros.length % cardsPerPage || cardsPerPage)}).map((_, idx) => (
                <div key={`placeholder-${idx}`} style={{
                  opacity: 0,
                  pointerEvents: 'none'
                }}></div>
              ))}
            </div>

            {/* Next button */}
            <button 
              className="btn btn-small" 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredLivros.length / cardsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(filteredLivros.length / cardsPerPage)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                height: '40px',
                width: '40px'
              }}
            >→</button>
          </div>

          {/* Pagination indicators */}
          {Math.ceil(filteredLivros.length / cardsPerPage) > 1 && (
            <div style={{display:'flex', justifyContent:'center', gap:'0.5rem', marginTop:'0.5rem'}}>
              <div style={{display:'flex', alignItems:'center', gap:'0.25rem'}}>
                {Array.from({length: Math.ceil(filteredLivros.length / cardsPerPage)}, (_, i) => i + 1).map(p => (
                  <button 
                    key={p}
                    className="btn btn-small"
                    onClick={() => setCurrentPage(p)}
                    style={{
                      backgroundColor: currentPage === p ? '#007bff' : '#f0f0f0',
                      color: currentPage === p ? 'white' : 'black',
                      minWidth:'32px'
                    }}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <EditLivroCard open={editOpen} onClose={() => setEditOpen(false)} onUpdated={handleEditSave} livro={editingLivro} />
    </div>
  );
}
