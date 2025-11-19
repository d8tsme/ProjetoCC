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
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-title">Autores</h1>
            <div className="page-actions">
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Adicionar Autor</button>
            </div>
          </div>
          <Tabela titulo="Autores" apiPath="/autores/listar" key={reloadKey} columns={[{key:'foto',label:'Foto'},{key:'nome',label:'Nome'}]} />
        </div>
        <AddAutorCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
      </main>
    </div>
  );
}

export default Autor;
