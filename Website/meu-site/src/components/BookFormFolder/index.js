import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
// import './styles.css';
// import '../../index.css';

export default function AddLivroCard({ open, onClose, onCreated }) {
  const [titulo, setTitulo] = useState('');
  const [paginas, setPaginas] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [isbn, setIsbn] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [foto, setFoto] = useState('');
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      try {
        const a = await apiFetch('/autores/listar');
        const g = await apiFetch('/generos/listar');
        if (!cancelled) {
          setAutores(Array.isArray(a) ? a : []);
          setGeneros(Array.isArray(g) ? g : []);
        }
      } catch (err) {
        setError('Erro ao carregar autores ou gêneros');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [open]);

  if (!open) return null;

  const reset = () => {
    setTitulo('');
    setPaginas('');
    setAutor('');
    setGenero('');
    setIsbn('');
    setAnoPublicacao('');
    setFoto('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        titulo,
        paginas: parseInt(paginas, 10),
        autorId: parseInt(autor, 10),
        generoId: parseInt(genero, 10),
        isbn,
        anoPublicacao: parseInt(anoPublicacao, 10),
        foto
      };
      const res = await apiFetch('/livros/inserir', { method: 'POST', body: JSON.stringify(payload) });
      reset();
      onCreated && onCreated(res);
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao criar livro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <header className="addlivro-header">
          <h2 className="addlivro-title">Adicionar Livro</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">×</button>
        </header>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>Título
            <input value={titulo} onChange={e=>setTitulo(e.target.value)} required />
          </label>
          <label>Páginas
            <input type="number" value={paginas} onChange={e=>setPaginas(e.target.value)} required />
          </label>
          <label>Autor
            <select value={autor} onChange={e=>setAutor(e.target.value)} required>
              <option value="">-- selecione --</option>
              {autores.map(a => <option key={a.id || a._id || a.codigo || a.nome} value={a.id || a._id || a.codigo || a.nome}>{a.nome || a.email || a.id}</option>)}
            </select>
          </label>
          <label>Gênero
            <select value={genero} onChange={e=>setGenero(e.target.value)} required>
              <option value="">-- selecione --</option>
              {generos.map(g => <option key={g.id || g._id || g.codigo || g.nome} value={g.id || g._id || g.codigo || g.nome}>{g.nome || g.email || g.id}</option>)}
            </select>
          </label>
          <label>ISBN
            <input value={isbn} onChange={e=>setIsbn(e.target.value)} required />
          </label>
          <label>Ano de Publicação
            <input type="number" value={anoPublicacao} onChange={e=>setAnoPublicacao(e.target.value)} required />
          </label>
          <label>Foto (URL ou base64)
            <input value={foto} onChange={e=>setFoto(e.target.value)} />
          </label>
          <div className="addlivro-actions">
            <button type="button" className="btn secondary" onClick={() => { reset(); onClose && onClose(); }}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Enviando...' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
