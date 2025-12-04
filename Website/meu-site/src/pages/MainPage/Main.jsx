// global styling is imported in src/index.js so it's not needed here
import Navbar from '../../components/PageComponents/Navbarfolder/Navbar.js';
import LivroTable from '../../components/Table/EntityTables/LivroTable.jsx';
import { useState } from 'react';
import AddLivroCard from '../../components/PageComponents/SoftComp/AddLivroCard/AddLivroCard.jsx'; // Now uses index.js in AddLivroCard folder

function Main() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  
  const triggerReload = () => setReloadKey(k => k + 1);

  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <div className="page-header">
          <h1>Livros</h1>
          <div className="add-btn-bar">
            <button className="btn primary" onClick={() => setShowAdd(true)}>Adicionar Livro</button>
          </div>
        </div>
            <LivroTable reloadKey={reloadKey} />
        <AddLivroCard open={showAdd} onClose={() => setShowAdd(false)} onCreated={triggerReload} />
      </div>
    </div>
  );
}

export default Main;
