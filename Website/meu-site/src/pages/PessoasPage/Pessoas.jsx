import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import Tabela from '../../components/TabelaFolder/Tabela';
import AddPessoaCard from '../../components/EntityForms/AddPessoaCard';
import { useState } from 'react';

export default function Pessoas() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-title">Pessoas</h1>
            <div className="page-actions">
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Adicionar Pessoa</button>
            </div>
          </div>
          <Tabela titulo="Pessoas" apiPath="/pessoas/listar" key={reloadKey} columns={[{key:'nome',label:'Nome'},{key:'email',label:'Email'},{key:'telefone',label:'Telefone'}]} />
        </div>
        <AddPessoaCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </main>
    </div>
  );
}
