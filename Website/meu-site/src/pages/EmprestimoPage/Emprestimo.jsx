import '../LoginPage/App.css';
import Navbar from '../../components/PageComponents/Navbarfolder/Navbar.js';
import Tabela from '../../components/Table/TabelaFolder/Tabela.js';
import AddEmprestimoCard from '../../components/Form/EntityForms/AddEmprestimoCard.js';
//import EmprestimoTable from '../../components/EntityTables/EmprestimoTable';
import EmprestimosAtivosTable from '../../components/Table/EntityTables/EmprestimosAtivosTable.jsx';
import EmprestimosConcluidosTable from '../../components/Table/EntityTables/EmprestimosConcluidosTable.jsx';
import { useState } from 'react';
import Layout from '../../components/PageComponents/mainlayout/layout.jsx';

export default function Emprestimo() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  
  const handleDevolvido = () => {
    setReloadKey(k => k + 1);
  };

  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <div className="page-header">
          <h1>Empréstimos</h1>
          <div className="add-btn-bar">
            <button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Empréstimo</button>
          </div>
        </div>
        <EmprestimosAtivosTable reloadKey={reloadKey} onDevolvido={handleDevolvido} />
        <EmprestimosConcluidosTable reloadKey={reloadKey} />
        <AddEmprestimoCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </div>
    </div>
  );
}
