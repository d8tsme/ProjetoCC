import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import Tabela from '../../components/TabelaFolder/Tabela';
import AddGeneroCard from '../../components/EntityForms/AddGeneroCard';
import { useState } from 'react';

export default function Generos() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const cargo = (sessionStorage.getItem('cargo') || localStorage.getItem('cargo') || 'USER').toUpperCase();
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
          <div className="page-header">
            <h1 className="page-title">Gêneros</h1>
            <div className="page-actions">
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Adicionar Gênero</button>
            </div>
          </div>
          <Tabela titulo="Gêneros" apiPath="/generos/listar" key={reloadKey} columns={[{key:'id',label:'ID'},{key:'nome',label:'Nome'}]} />
        </div>
        <AddGeneroCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </main>
    </div>
  );
}