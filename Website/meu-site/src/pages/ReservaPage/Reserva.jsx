import '../LoginPage/App.css';
import Navbar from '../../components/Navbarfolder/Navbar.js';
import ReservasAtivasTable from '../../components/EntityTables/ReservasAtivasTable';
import ReservasExpiradasTable from '../../components/EntityTables/ReservasExpiradasTable';
import AddReservaCard from '../../components/EntityForms/AddReservaCard';
import { useState } from 'react';
import Layout from '../../components/mainlayout/layout.jsx';

export default function Reserva() {
	const [showAdd, setShowAdd] = useState(false);
	const [reloadKey, setReloadKey] = useState(0);
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
				<ReservasAtivasTable reloadKey={reloadKey} />
				<ReservasExpiradasTable reloadKey={reloadKey} />
				<AddReservaCard open={showAdd} onClose={()=>setShowAdd(false)} onCreated={()=>setReloadKey(k=>k+1)} />
			</div>
		</div>
	);
}
