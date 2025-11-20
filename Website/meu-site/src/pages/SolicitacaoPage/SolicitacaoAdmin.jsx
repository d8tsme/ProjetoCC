import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbarfolder/Navbar';
import apiFetch from '../../utils/apiFetch';

export default function SolicitacaoAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cargo = (sessionStorage.getItem('cargo') || localStorage.getItem('cargo') || 'USER').toUpperCase();

  useEffect(() => {
    if (cargo !== 'ADM') return;
    apiFetch('/solicitacoes')
      .then(setSolicitacoes)
      .catch(e => setError(e.message || 'Erro ao carregar solicitações'))
      .finally(() => setLoading(false));
  }, [cargo]);

  async function handleAprovar(id) {
    await apiFetch(`/solicitacoes/${id}/aprovar`, { method: 'PUT' });
    setSolicitacoes(solicitacoes => solicitacoes.map(s => s.id === id ? { ...s, status: 'aprovado' } : s));
  }
  async function handleRejeitar(id) {
    await apiFetch(`/solicitacoes/${id}/rejeitar`, { method: 'PUT' });
    setSolicitacoes(solicitacoes => solicitacoes.map(s => s.id === id ? { ...s, status: 'rejeitado' } : s));
  }

  if (cargo !== 'ADM') {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <div className="page-card" style={{textAlign:'center',padding:'2rem'}}>
            <h2>Acesso restrito</h2>
            <p>Esta página é exclusiva para administradores.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-card">
          <h1>Solicitações de Inclusão</h1>
          {loading ? <div>Carregando...</div> : error ? <div className="error-message">{error}</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoes.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.tipo}</td>
                    <td>{s.nome}</td>
                    <td>{s.usuarioId}</td>
                    <td>{s.status}</td>
                    <td>
                      {s.status === 'pendente' && (
                        <>
                          <button className="btn" onClick={() => handleAprovar(s.id)}>Aprovar</button>
                          <button className="btn btn-danger" onClick={() => handleRejeitar(s.id)}>Rejeitar</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
