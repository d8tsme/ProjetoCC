import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles.css';
import LogoPeople from '../LoginPage/logo-people.svg';

export default function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefone = parseInt(form.telefone.value || '0', 10);
    const usuario = form.usuario.value.trim();
    const senha = form.senha.value;

    setLoading(true);
    try {
      const res = await fetch('/usuarios/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' },
        body: JSON.stringify({ nome, email, telefone, usuario, senha })
      });

      let data = null;
      try {
        const text = await res.text();
        if (text) {
          try { data = JSON.parse(text); } catch { data = text; }
        }
      } catch (e) {
        data = null;
      }

      if (res.status === 201 || res.status === 200) {
        const token = data && (data.token || data.accessToken || data.jwt || null);
        const cargo = data && (data.cargo || 'USER');
        if (token) {
          try { sessionStorage.setItem('token', token); sessionStorage.setItem('cargo', cargo); localStorage.setItem('cargo', cargo); } catch(e){}
        }
        alert('Cadastro realizado com sucesso. Você pode entrar agora.');
        navigate('/login');
        return;
      }

      const errMsg = (data && (data.error || data.message)) || (typeof data === 'string' ? data : `Erro: ${res.status}`);
      alert(errMsg);

    } catch (err) {
      alert(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <div className="login-header">
          <img src={LogoPeople} alt="logo" className="login-brand-icon" />
          <h1 className="login-brand-title">Bibliotech™</h1>
          <p className="login-brand-subtitle">Crie sua conta de usuário</p>
        </div>

        <div className="login-body">
          <form className="login-form" onSubmit={handleSubmit} aria-label="cadastro-form">
            <div className="login-input-group">
              <label className="login-input-label">Nome completo</label>
              <input name="nome" type="text" required className="login-input-field" placeholder="Nome completo" />
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Email</label>
              <input name="email" type="email" required className="login-input-field" placeholder="email@exemplo.com" />
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Telefone</label>
              <input name="telefone" type="tel" className="login-input-field" placeholder="(xx) xxxxx-xxxx" />
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Usuário</label>
              <input name="usuario" type="text" required className="login-input-field" placeholder="Nome de usuário" />
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Senha</label>
              <input name="senha" type="password" required className="login-input-field" placeholder="Senha" />
            </div>

            <div style={{display:'flex',gap:8}}>
              <button className="login-submit-btn" type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
              <button type="button" className="login-toggle-btn" onClick={()=>navigate('/login')}>Voltar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
