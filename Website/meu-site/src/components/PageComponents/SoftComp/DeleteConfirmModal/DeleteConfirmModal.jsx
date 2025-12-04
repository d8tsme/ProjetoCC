import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../IndexApputils/Utils/utils/apiFetch';
import './DeleteConfirmModal.css';

export default function DeleteConfirmModal({ open, onClose, onConfirm, entityType, entityName, entityId }) {
  const [vinculos, setVinculos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && entityId && entityType === 'pessoa') {
      loadVinculos();
    }
  }, [open, entityId, entityType]);

  async function loadVinculos() {
    setLoading(true);
    try {
      // Load emprestimos for this person
      const emprestimos = await apiFetch(`/emprestimos/listar`);
      const pessoaEmprestimos = Array.isArray(emprestimos) 
        ? emprestimos.filter(e => e.pessoaId === entityId) 
        : [];
      
      // Load reservas for this person
      const reservas = await apiFetch(`/reservas/listar`);
      const pessoaReservas = Array.isArray(reservas) 
        ? reservas.filter(r => r.pessoaId === entityId) 
        : [];

      setVinculos([
        ...pessoaEmprestimos.map(e => ({
          type: 'emprestimo',
          id: e.id,
          descricao: `Empréstimo: ${e.livro_titulo} (${e.status})`
        })),
        ...pessoaReservas.map(r => ({
          type: 'reserva',
          id: r.id,
          descricao: `Reserva: ${r.livro_titulo} (${r.status})`
        }))
      ]);
    } catch (err) {
      console.error('Erro ao carregar vículos', err);
    }
    setLoading(false);
  }

  if (!open) return null;

  const temVinculos = vinculos.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Confirmar Exclusão</h2>
        <p>Deseja realmente excluir <strong>{entityName}</strong>?</p>
        
        {loading && <p style={{color: '#999', marginTop: '1rem'}}>Verificando vículos...</p>}
        
        {temVinculos && (
          <div className="vinculos-section" style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <p style={{fontWeight: 'bold', color: '#856404', marginTop: 0}}>
              ⚠️ Esta pessoa tem {vinculos.length} vínculo{vinculos.length !== 1 ? 's' : ''} ativo{vinculos.length !== 1 ? 's' : ''}:
            </p>
            <ul style={{marginBottom: 0, paddingLeft: '1.5rem', color: '#856404'}}>
              {vinculos.map(v => (
                <li key={`${v.type}-${v.id}`} style={{marginBottom: '0.25rem', fontSize: '14px'}}>
                  {v.descricao}
                </li>
              ))}
            </ul>
            <p style={{fontSize: '13px', marginTop: '0.5rem', color: '#856404'}}>
              Esses registros também serão deletados.
            </p>
          </div>
        )}

        <div className="modal-actions" style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1.5rem',
          justifyContent: 'flex-end'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger" onClick={() => {
            onConfirm();
            onClose();
          }} disabled={loading} style={{
            backgroundColor: loading ? '#ccc' : '#dc3545',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Carregando...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
