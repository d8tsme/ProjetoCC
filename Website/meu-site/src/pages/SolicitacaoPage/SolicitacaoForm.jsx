import React, { useState } from 'react';
import Navbar from '../../components/Navbarfolder/Navbar';
import apiFetch from '../../utils/apiFetch';

export default function SolicitacaoForm() {
  const [tipo, setTipo] = useState('autor');
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const usuarioId = sessionStorage.getItem('usuarioId');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatus('');
    if (!nome) {
      setError('Nome é obrigatório');
      return;
    }
    try {
      await apiFetch('/solicitacoes/inserir', {
        method: 'POST',
        body: JSON.stringify({ tipo, nome, usuarioId })
      });
      setStatus('Solicitação enviada com sucesso!');
      setNome('');
    } catch (e) {
      setError(e.message || 'Erro ao enviar solicitação');
    }
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-card" style={{maxWidth:400,margin:'2rem auto'}}>
          <h2>Solicitar Inclusão de Autor/Gênero</h2>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
            <label>
              Tipo:
              <select value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="autor">Autor</option>
                <option value="gênero">Gênero</option>
              </select>
            </label>
            <label>
              Nome:
              <input value={nome} onChange={e => setNome(e.target.value)} required />
            </label>
            <button className="btn btn-primary" type="submit">Enviar Solicitação</button>
            {error && <div className="error-message">{error}</div>}
            {status && <div className="success-message">{status}</div>}
          </form>
        </div>
      </main>
    </div>
  );
}
