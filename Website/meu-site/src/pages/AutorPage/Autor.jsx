import React, { useEffect } from 'react';
import '../LoginPage/App.css';
import Navbar from '../../components/PageComponents/Navbarfolder/Navbar.js';
import Tabela from '../../components/Table/TabelaFolder/Tabela.js';
import AddAutorCard from '../../components/Form/EntityForms/AddAutorCard.js';
import AutorTable from '../../components/Table/EntityTables/AutorTable.jsx';
import { useState } from 'react';

function Autor() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [autorParaEditar, setAutorParaEditar] = useState(null);
  const [autorParaDeletar, setAutorParaDeletar] = useState(null);
  async function getAutor() {
    try {
      const json = await (await import('../../IndexApputils/Utils/utils/apiFetch.js')).default('/autores/listar');
      console.log(json);
    } catch (err) {
      console.error('Erro ao buscar autores:', err);
      if (err.status === 401 || err.status === 403) {
        window.location.href = '/login';
      }
    }
  }
  useEffect(() => {
    getAutor();
  }, []);
  return (
    <div className="layout">
      <Navbar/>
      <div className="main-content">
        <div className="page-header">
          <h1>Autores</h1>
          <div className="add-btn-bar">
            <button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Autor</button>
          </div>
        </div>
        <AutorTable reloadKey={reloadKey} />
        <AddAutorCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </div>
    </div>
  );
}

export default Autor;
