import Navbar from '../../components/Navbarfolder/Navbar.js';
import Tabela from '../../components/TabelaFolder/Tabela';
import AddEmprestimoCard from '../../components/EntityForms/AddEmprestimoCard';
import { useState } from 'react';

export default function Emprestimo() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-title">Empréstimos</h1>
            <div className="page-actions">
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Adicionar Empréstimo</button>
            </div>
          </div>
          <Tabela titulo="Empréstimos" apiPath="/emprestimos/listar" key={reloadKey} columns={[{key:'livro_foto',label:'Foto'},{key:'livro_titulo',label:'Livro'},{key:'pessoa_nome',label:'Pessoa'},{key:'dataEmprestimo',label:'Data Empréstimo'},{key:'dataDevolucao',label:'Data Devolução'},{key:'status',label:'Status'}]} />
        </div>
        <AddEmprestimoCard open={showAdd} onClose={() => setShowAdd(false)} onCreated={() => setReloadKey(k => k + 1)} />
      </main>
    </div>
  );
}
