import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import Tabela from '../../components/TabelaFolder/Tabela';
import AddPessoaCard from '../../components/EntityForms/AddPessoaCard';
import { useState } from 'react';

export default function Pessoas() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <h1>Pessoas</h1>
        <div className="add-btn-bar">
          <button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Pessoa</button>
        </div>
        <Tabela titulo="Pessoas" apiPath="/pessoas/listar" key={reloadKey} columns={[{key:'nome',label:'Nome'},{key:'email',label:'Email'},{key:'telefone',label:'Telefone'}]} />
        <AddPessoaCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </div>
    </div>
  );
}
