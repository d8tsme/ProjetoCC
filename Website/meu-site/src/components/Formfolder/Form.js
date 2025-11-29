import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Form() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const usuario = form.usuario.value.trim();
    const senha = form.senha.value;
    try {
        setLoading(true);
        // Use environment configured API endpoint or local default
        const API_TARGET = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_TARGET}/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha })
        });

        // tentar ler JSON, fallback para texto
        let data;
        try { data = await res.json(); } catch { data = await res.text(); }

        if (res.status === 200) {
            // Extrair token de formatos comuns
            let token = null;
            if (typeof data === 'string') {
                // se o backend retornar apenas o token como texto
                token = data;
            } else if (data && typeof data === 'object') {
                token = data.token || data.accessToken || data.jwt || data.data?.token || null;
            }

            if (token) {
                sessionStorage.setItem('token', token);
                // navegação SPA para Main
                navigate('/main');
                return;
            }

            // status 200 mas sem token — trata como erro
            const missingTokenMsg = 'Login bem-sucedido, porém token ausente na resposta.';
            alert(missingTokenMsg);
            form.reset();
            return;
        }

        // Outros códigos: alertar e resetar o formulário
        const errMsg = (data && (data.error || data.message)) || (typeof data === 'string' ? data : `Erro: ${res.status}`);
        alert(errMsg);
        form.reset();
    } catch (err) {
        // Erros de rede / exceções
        alert(err?.message || String(err));
        form.reset();
    } finally {
        setLoading(false);
    }
}


return (
    <form onSubmit={handleSubmit} className="login-form" aria-label="login-form">
        <div className="login-input-group">
            <label className="login-input-label">Usuário</label>
            <input name="usuario" type="text" required className="login-input-field" placeholder="Usuário" />
        </div>

        <div className="login-input-group">
            <label className="login-input-label">Senha</label>
            <div className="login-password-row">
                <input name="senha" type={showPassword ? 'text' : 'password'} required className="login-input-field" placeholder="Senha" />
                <button type="button" className="login-toggle-btn" onClick={() => setShowPassword(!showPassword)} aria-label="Mostrar senha">
                    {showPassword ? '🙈' : '👁️'}
                </button>
            </div>
        </div>

        <button type="submit" className="login-submit-btn" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
    </form>
);
}
