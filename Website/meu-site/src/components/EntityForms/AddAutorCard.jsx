import React, { useState } from 'react';
import apiFetch from '../../utils/apiFetch';
import '../BookFormFolder/AddLivroCard.css';

export default function AddAutorCard({ open, onClose, onCreated }) {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const reset = () => { setNome(''); setFoto(''); setError(null); };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const payload = { nome, foto };
      const res = await apiFetch('/autores/inserir', { method: 'POST', body: JSON.stringify(payload) });
      reset();
      onCreated && onCreated(res);
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Erro ao criar autor');
    } finally { setLoading(false); }
  };

  return (
    <div className="addlivro-overlay">
      <div className="addlivro-card">
        <header className="addlivro-header">
          <h2>Adicionar Autor</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">×</button>
        </header>
        <form className="addlivro-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>Nome<input value={nome} onChange={e=>setNome(e.target.value)} required /></label>
          <label>Foto (URL ou base64)<input value={foto} onChange={e=>setFoto(e.target.value)} /></label>
          <div style={{marginTop:8}}>
            <input type="file" accept="image/*" onChange={onFileChange} />
          </div>
          <div className="addlivro-actions">
            <button type="button" className="btn secondary" onClick={() => { reset(); onClose && onClose(); }}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Enviando...' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
