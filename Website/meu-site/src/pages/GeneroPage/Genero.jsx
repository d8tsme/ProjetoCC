import '../LoginPage/App.css';
import Navbar from '../../components/PageComponents/Navbarfolder/Navbar.js';
import Tabela from '../../components/Table/TabelaFolder/Tabela.js';
import AddGeneroCard from '../../components/Form/EntityForms/AddGeneroCard';
import GeneroTable from '../../components/Table/EntityTables/GeneroTable';
import { useState } from 'react';
import Layout from '../../components/PageComponents/mainlayout/layout.jsx';

export default function Generos() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <div className="page-header">
          <h1>Gêneros</h1>
          <div className="add-btn-bar">
            <button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Gênero</button>
          </div>
        </div>
        <GeneroTable reloadKey={reloadKey} />
        <AddGeneroCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </div>
    </div>
  );
}