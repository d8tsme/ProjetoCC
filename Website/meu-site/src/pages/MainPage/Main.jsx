import '../../../src';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import Table from '../../components/TabelaFolder/Tabela';
import { useState } from 'react';
import AddLivroCard from '../../components/AddLivroCard/AddLivroCard.jsx'; // Now uses index.js in AddLivroCard folder

function Main() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <h1 style={{ textAlign: 'center', width: '100%' }}>Bem-vindo à Bibliotech</h1>
        <div className="add-btn-bar">
          <button className="btn primary" onClick={() => setShowAdd(true)}>Adicionar Livro</button>
        </div>
        <Table/>
        <AddLivroCard open={showAdd} onClose={() => setShowAdd(false)} onCreated={() => { /* could refresh table */ }} />
      </div>
    </div>
  );
}

export default Main;
