import React, { useEffect, useState } from 'react';
import '../../styles.css';
import './Dashboard.css';
import Navbar from '../../components/Navbarfolder/Navbar';
import StatCard from '../../components/DashboardComponents/StatCard';
import LineChart from '../../components/DashboardComponents/LineChart';
import BarChart from '../../components/DashboardComponents/BarChart';
import apiFetch from '../../utils/apiFetch';

function Dashboard() {
  const [stats, setStats] = useState({ livros: 0, autores: 0, pessoas: 0, emprestimos: 0 });
  const [monthly, setMonthly] = useState([12, 20, 15, 30, 40, 55, 60, 50, 45, 70, 62, 80]);
  const [trend, setTrend] = useState([5, 9, 6, 12, 18, 24, 22, 28, 30, 26, 34, 40]);

  useEffect(() => {
    async function load() {
      try {
        const livros = await apiFetch('/livros/listar').catch(() => []);
        const autores = await apiFetch('/autores/listar').catch(() => []);
        const pessoas = await apiFetch('/pessoas/listar').catch(() => []);
        // emprestimos endpoint returns a page; accept array or object with content
        let emprestimosRaw = await apiFetch('/emprestimos').catch(() => null);

        let emprestimosCount = 0;
        if (Array.isArray(emprestimosRaw)) emprestimosCount = emprestimosRaw.length;
        else if (emprestimosRaw && emprestimosRaw.content) emprestimosCount = emprestimosRaw.content.length;

        setStats({ livros: livros.length || 0, autores: autores.length || 0, pessoas: pessoas.length || 0, emprestimos: emprestimosCount });
        // try to fetch analytics endpoints (fallback to mock data declared above)
        try {
          const sales = await apiFetch('/analytics/monthly-sales').catch(() => null);
          const users = await apiFetch('/analytics/active-users').catch(() => null);
          if (Array.isArray(sales) && sales.length >= 12) setMonthly(sales.slice(0,12));
          if (Array.isArray(users) && users.length >= 12) setTrend(users.slice(0,12));
        } catch (e) { /* ignore analytics errors */ }
      } catch (e) {
        console.error('Dashboard load error', e);
      }
    }
    load();
  }, []);

  return (
    <div className="dashboard-root">
      <div className="dashboard-sidebar"><Navbar /></div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2>Bibliotech Dashboard</h2>
          <div className="header-actions">
            <button className="btn">Share</button>
            <button className="btn primary">New</button>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard title="Livros" value={stats.livros} color="accent-1" />
          <StatCard title="Autores" value={stats.autores} color="primary-brown-light" />
          <StatCard title="Pessoas" value={stats.pessoas} color="primary-brown" />
          <StatCard title="Empréstimos" value={stats.emprestimos} color="accent-2" />
        </section>

        <section className="charts-row">
          <div className="chart-card large">
            <h3>Sales overview</h3>
            <LineChart data={trend} />
          </div>

          <div className="chart-card small">
            <h3>Active Users</h3>
            <BarChart data={monthly} />
          </div>
        </section>

        <section className="projects-row">
          <div className="projects-card">
            <h3>Projects</h3>
            <div className="project-item">Chakra Soft UI Version — $14,000 — 60%</div>
            <div className="project-item">Bibliotech Migration — $8,500 — 40%</div>
          </div>

          <div className="orders-card">
            <h3>Orders overview</h3>
            <div className="order-item">Today: 2400 changes — $2,400</div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
