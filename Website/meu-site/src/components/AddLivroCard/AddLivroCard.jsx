import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';

export default function AddLivroCard({ open, setOpen, onClose, onCreated }) {
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

  React.useEffect(() => {
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
        console.error(err);
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
    <ModalForm open={open} setOpen={setOpen} handleSubmit={handleSubmit} header="Adicionar Livro">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" value={titulo} onChange={e=>setTitulo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Páginas</label>
            <input className="form-input" type="number" value={paginas} onChange={e=>setPaginas(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Autor</label>
            <select className="form-select" value={autor} onChange={e=>setAutor(e.target.value)} required>
              <option value="">-- selecione --</option>
              {autores.map(a => <option key={a.id || a._id || a.codigo || a.nome} value={a.id || a._id || a.codigo || a.nome}>{a.nome || a.email || a.id}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Gênero</label>
            <select className="form-select" value={genero} onChange={e=>setGenero(e.target.value)} required>
              <option value="">-- selecione --</option>
              {generos.map(g => <option key={g.id || g._id || g.codigo || g.nome} value={g.id || g._id || g.codigo || g.nome}>{g.nome || g.email || g.id}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">ISBN</label>
            <input className="form-input" value={isbn} onChange={e=>setIsbn(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Ano de Publicação</label>
            <input className="form-input" type="number" value={anoPublicacao} onChange={e=>setAnoPublicacao(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Foto (URL ou base64)</label>
            <input className="form-input" value={foto} onChange={e=>setFoto(e.target.value)} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => { reset(); onClose && onClose(); }}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Enviando...' : 'Adicionar'}</button>
          </div>
    </ModalForm>
  );
}
