import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/apiFetch';
import saveCsv from '../../utils/csv';
import EditPessoaCard from '../EntityForms/EditPessoaCard';

export default function PessoaTable() {
  const [pessoas, setPessoas] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nome');
  const [editOpen, setEditOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const cols = [{key:'nome', label:'Nome'},{key:'email', label:'Email'},{key:'telefone', label:'Telefone'}];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadPessoas();
  }, [sort, search]);

  async function loadPessoas() {
    let url = `/pessoas/listar`;
    try {
      const res = await apiFetch(url, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      let arr = Array.isArray(res) ? res : [];
      if (search) arr = arr.filter(p => p.nome && p.nome.toLowerCase().includes(search.toLowerCase()));
      // Sort the array
      if (sort === 'nome') arr.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
      else if (sort === 'email') arr.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
      else if (sort === 'telefone') arr.sort((a, b) => (a.telefone || '').localeCompare(b.telefone || ''));
      setPessoas(arr);
    } catch (err) {
      console.error('Erro ao carregar pessoas', err);
      alert(err.message || 'Erro ao carregar pessoas');
    }
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/pessoas/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
      await loadPessoas();
    } catch (err) {
      console.error('Erro ao excluir pessoa', err);
      alert(err.message || 'Erro ao excluir');
    }
  }

  async function handleBulkDelete() {
    try {
      await Promise.all(selected.map(id => apiFetch(`/pessoas/excluir/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }))); 
      setSelected([]);
      await loadPessoas();
    } catch (err) {
      console.error('Erro ao excluir pessoas em lote', err);
      alert(err.message || 'Erro ao excluir pessoas');
    }
  }

  function handleEdit(pessoa) {
    setEditingPessoa(pessoa);
    setEditOpen(true);
  }

  async function handleEditSave() {
    await loadPessoas();
  }

  function handleSelect(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <h2>Pessoas</h2>
      <div className="table-controls" style={{display:'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems:'center'}}>
        <input placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn" onClick={() => saveCsv('pessoas.csv', pessoas, cols)}>Salvar CSV</button>
        <div style={{marginLeft:'auto'}}>
          <button className="btn bulk-delete-btn" onClick={handleBulkDelete} disabled={!selected.length}>Excluir Selecionados</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? pessoas.map(a => a.id) : [])} checked={selected.length === pessoas.length && pessoas.length > 0} /></th>
            <th onClick={() => setSort('nome')} style={{cursor: 'pointer'}}>Nome</th>
            <th onClick={() => setSort('email')} style={{cursor: 'pointer'}}>Email</th>
            <th onClick={() => setSort('telefone')} style={{cursor: 'pointer'}}>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map(pessoa => (
            <tr key={pessoa.id}>
              <td><input type="checkbox" checked={selected.includes(pessoa.id)} onChange={() => handleSelect(pessoa.id)} /></td>
              <td>{pessoa.nome}</td>
              <td>{pessoa.email}</td>
              <td>{pessoa.telefone}</td>
              <td>
                <>
                  <button onClick={() => handleEdit(pessoa)}>Editar</button>
                  <button onClick={() => handleDelete(pessoa.id)}>Excluir</button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination removed - table renders all items */}
      <EditPessoaCard open={editOpen} onClose={() => setEditOpen(false)} onUpdated={handleEditSave} pessoa={editingPessoa} />
    </div>
  );
}
