import React, { useEffect, useState } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function EditLivroCard({ open, book, onClose }) {
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
    if (!book) return;
    setTitulo(book.titulo || '');
    setPaginas(book.paginas || '');
    setAutor(book.autorId || book.autorId || book.autor || '');
    setGenero(book.generoId || book.generoId || book.genero || '');
    setIsbn(book.isbn || '');
    setAnoPublicacao(book.anoPublicacao || '');
    setFoto(book.foto || '');
  }, [book]);

  useEffect(() => {
    async function loadLookups() {
      try {
        const a = await apiFetch('/autores/listar');
        const g = await apiFetch('/generos/listar');
        setAutores(Array.isArray(a) ? a : []);
        setGeneros(Array.isArray(g) ? g : []);
      } catch (e) { console.error(e); }
    }
    loadLookups();
  }, []);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const onFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const data = await fileToBase64(f);
      setFoto(data);
    } catch (err) { setError('Erro ao processar imagem'); }
  };

  if (!open || !book) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    // basic client-side validation
    if (!titulo || titulo.trim().length < 3) { setError('O título deve ter ao menos 3 caracteres'); setLoading(false); return; }
    if (!paginas || parseInt(paginas,10) <= 0) { setError('Informe o número de páginas'); setLoading(false); return; }
    try {
      const payload = {
        id: book.id,
        titulo,
        isbn,
        foto,
        anoPublicacao: parseInt(anoPublicacao, 10) || 0,
        autorId: parseInt(autor, 10) || null,
        generoId: parseInt(genero, 10) || null,
        paginas: parseInt(paginas, 10) || 0,
        status: book.status || 'Disponível'
      };
      await apiFetch(`/livros/atualizar/${book.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar');
    } finally { setLoading(false); }
  };

  return (
    <div className="form-overlay">
      <div className="form-card fade-in" role="dialog" aria-modal="true" aria-labelledby="form-title-edit">
        <header className="form-header">
          <h2 id="form-title-edit" className="form-title">Editar Livro</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">×</button>
        </header>
        <form className="form-body" onSubmit={handleSubmit} role="form" noValidate>
          {error && <div className="error-message" role="alert" aria-live="assertive">{error}</div>}
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Páginas</label>
            <input className="form-input" type="number" value={paginas} onChange={e => setPaginas(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Autor</label>
            <select className="form-select" value={autor} onChange={e => setAutor(e.target.value)} required>
              <option value="">-- selecione --</option>
              {autores.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Gênero</label>
            <select className="form-select" value={genero} onChange={e => setGenero(e.target.value)} required>
              <option value="">-- selecione --</option>
              {generos.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">ISBN</label>
            <input className="form-input" value={isbn} onChange={e => setIsbn(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Ano de Publicação</label>
            <input className="form-input" type="number" value={anoPublicacao} onChange={e => setAnoPublicacao(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Foto (URL ou base64)</label>
            <input className="form-input" value={foto} onChange={e => setFoto(e.target.value)} />
            <div style={{marginTop:8}}>
              <input type="file" accept="image/*" onChange={onFileChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !titulo || !paginas}>{loading ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
