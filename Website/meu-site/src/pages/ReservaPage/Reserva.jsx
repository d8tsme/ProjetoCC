import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import ReservasAtivasTable from '../../components/EntityTables/ReservasAtivasTable';
import ReservasAntigasTable from '../../components/EntityTables/ReservasAntigasTable';
import AddReservaCard from '../../components/EntityForms/AddReservaCard';
import { useState } from 'react';
import Layout from '../../components/mainlayout/layout.jsx';

export default function Reserva() {
	const [showAdd, setShowAdd] = useState(false);
	const [reloadKey, setReloadKey] = useState(0);
	
	const triggerReload = () => setReloadKey(k => k + 1);
	
	return (
		<div className="layout">
			<Navbar/>
			<div className="main-content">
				<div className="page-header">
					<h1>Reservas</h1>
					<div className="add-btn-bar">
						<button onClick={()=>setShowAdd(true)} className="btn primary">Adicionar Reserva</button>
					</div>
				</div>
				<ReservasAtivasTable reloadKey={reloadKey} onStatusChanged={triggerReload} />
				<ReservasAntigasTable reloadKey={reloadKey} />
				<AddReservaCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={triggerReload} />
			</div>
		</div>
	);
}
