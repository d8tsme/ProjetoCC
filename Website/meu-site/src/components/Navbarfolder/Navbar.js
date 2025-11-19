import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  function logout() {
    sessionStorage.removeItem('token');
    navigate('/login');
  }

  function onSearch(e) {
    e.preventDefault();
    navigate(`/main?search=${encodeURIComponent(query)}`);
    setDrawerOpen(false);
  }

  const navList = (
    <>
      <div className="sidebar-logo">Bibliotech™</div>

      <form onSubmit={onSearch} style={{display:'flex',padding:'8px'}}>
        <input placeholder="Pesquisar livros..." value={query} onChange={e=>setQuery(e.target.value)} style={{flex:1,padding:'8px',borderRadius:8,border:'1px solid var(--border-light)'}} />
        <button className="btn" type="submit" style={{marginLeft:8}}>Ir</button>
      </form>

      <ul className="sidebar-links">
        <li><NavLink to="/dashboard" onClick={()=>setDrawerOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        <li><NavLink to="/Main" onClick={()=>setDrawerOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Livros</NavLink></li>
        <li><NavLink to="/autores" onClick={()=>setDrawerOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Autor</NavLink></li>
        <li><NavLink to="/pessoas" onClick={()=>setDrawerOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Pessoas</NavLink></li>
        <li><NavLink to="/emprestimos" onClick={()=>setDrawerOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Empréstimos</NavLink></li>
        <li><NavLink to="/generos" onClick={()=>setDrawerOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Gêneros</NavLink></li>
      </ul>

      <div style={{marginTop:'auto',padding:'12px',display:'flex',flexDirection:'column',gap:8}}>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={()=>setTheme(t=> t==='light' ? 'dark' : 'light')}>{theme==='light' ? 'Dark' : 'Light'}</button>
          <button className="btn btn-secondary" onClick={logout}>Logoff</button>
        </div>
        <div style={{fontSize:'0.8rem',color:'var(--text-light)'}}>Bibliotech • v1</div>
      </div>
    </>
  );

  return (
    <>
      <button className="mobile-toggle" aria-label="Abrir menu" onClick={()=>setDrawerOpen(true)}>☰</button>

      <aside className={`sidebar ${drawerOpen ? 'open' : ''}`} onClick={() => { /* allow overlay click to close handled below */ }}>
        <div className="sidebar-inner">
          {navList}
        </div>
      </aside>

      {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}
    </>
  );
}

export default Navbar;

