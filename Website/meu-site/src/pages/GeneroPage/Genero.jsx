import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import Tabela from '../../components/TabelaFolder/Tabela';
import AddGeneroCard from '../../components/EntityForms/AddGeneroCard';
import GeneroTable from '../../components/EntityTables/GeneroTable';
import { useState } from 'react';

export default function Generos() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <h1>Gêneros</h1>
        <div className="add-btn-bar">
          <button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Gênero</button>
        </div>
        <GeneroTable key={reloadKey} />
        <AddGeneroCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </div>
    </div>
  );
}