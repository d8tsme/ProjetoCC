import '../../../src';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import { useState } from 'react';
import AddLivroCard from '../../components/BookFormFolder/AddLivroCard';
import BooksCatalog from '../../components/BookFormFolder/BooksCatalog';
import '../../styles.css';

function Main() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, paddingRight: 20 }}>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Adicionar Livro</button>
        </div>

        <div style={{ display: 'flex', width: '100%', gap: 12, marginTop: 12, alignItems: 'flex-start' }}>
          <div style={{ width: '240px' }}>
            <Navbar />
          </div>
          <div style={{ flex: 1 }}>
            <div className="page-card">
              <h1 className="page-title">Catálogo de Livros</h1>
              <BooksCatalog />
            </div>
          </div>
        </div>

        <AddLivroCard open={showAdd} onClose={() => setShowAdd(false)} onCreated={() => { /* could refresh table via event */ }} />
      </header>
    </div>
  );
}

export default Main;
