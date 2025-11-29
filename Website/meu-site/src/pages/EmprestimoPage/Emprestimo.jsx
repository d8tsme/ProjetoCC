import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import Tabela from '../../components/TabelaFolder/Tabela';
import AddEmprestimoCard from '../../components/EntityForms/AddEmprestimoCard';
//import EmprestimoTable from '../../components/EntityTables/EmprestimoTable';
import EmprestimosAtivosTable from '../../components/EntityTables/EmprestimosAtivosTable';
import EmprestimosConcluidosTable from '../../components/EntityTables/EmprestimosConcluidosTable';
import { useState } from 'react';
import Layout from '../../components/mainlayout/layout.jsx';

export default function Emprestimo() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <h1>Empréstimos</h1>
        <div className="add-btn-bar">
          <button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Empréstimo</button>
        </div>
        <EmprestimosAtivosTable reloadKey={reloadKey} onDevolvido={() => setReloadKey(k=>k+1)} />
        <EmprestimosConcluidosTable reloadKey={reloadKey} />
        <AddEmprestimoCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </div>
    </div>
  );
}
