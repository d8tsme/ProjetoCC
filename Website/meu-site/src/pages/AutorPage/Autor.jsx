import React, { useEffect } from 'react';
import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import Tabela from '../../components/TabelaFolder/Tabela';
import AddAutorCard from '../../components/EntityForms/AddAutorCard';
import { useState } from 'react';

function Autor() {
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  async function getAutor() {
    try {
      const json = await (await import('../../utils/apiFetch')).default('/autores/listar');
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
        <h1>Autores</h1>
        <div className="add-btn-bar">
          <button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Autor</button>
        </div>
        <Tabela titulo="Autores" apiPath="/autores/listar" key={reloadKey} columns={[{key:'foto',label:'Foto'},{key:'nome',label:'Nome'}]} />
        <AddAutorCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </div>
    </div>
  );
}

export default Autor;
