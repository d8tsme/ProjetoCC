import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../utils/apiFetch';
import PropTypes from "prop-types";

// Tabela is generic; pass `apiPath` like '/livros/listar' to fetch data
export default function Tabela({ titulo = "Lista", rows, apiPath = '/livros/listar', columns, showActions = true }) {
    const [data, setData] = useState(rows || []);
    const [loading, setLoading] = useState(!rows || (Array.isArray(rows) && rows.length === 0));
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const errorText = typeof error === 'string' ? error : (error && (error.message || (error.code ? `Erro ${error.code}` : null))) || null;

    useEffect(() => {
        // if rows passed from parent, use them and skip fetching
        if (rows && Array.isArray(rows) && rows.length > 0) {
            setData(rows);
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const json = await apiFetch(apiPath, { method: 'GET' });
                if (cancelled) return;
                const items = Array.isArray(json) ? json : json?.data ?? json?.books ?? [];
                try{ window.__tabela_lastApiPath = apiPath; }catch(e){}
                setData(items);
            } catch (err) {
                if (cancelled) return;
                if (err.status === 401 || err.status === 403) {
                    setError({ code: err.status, message: 'Autenticação necessária. Faça login para continuar.' });
                    setData([]);
                    return;
                }
                setError(err.message || "Erro ao carregar dados");
                setData([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();

        function onRefresh() { fetchData(); }
        window.addEventListener('tabela:refresh', onRefresh);

        return () => {
            cancelled = true;
            window.removeEventListener('tabela:refresh', onRefresh);
        };
    }, [rows, navigate, apiPath]);

    return (
        <>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-medium)' }}>Carregando...</div>
            ) : error ? (
                <div className="error-message">Erro: {errorText}</div>
            ) : data.length === 0 ? (
                <div className="table-empty">Nenhum registro encontrado.</div>
            ) : (
                <table className="table">
                    <thead>
                                        <tr>
                                            {(columns && columns.length > 0 ? columns : defaultColumns()).map(col => (
                                                <th key={col.key}>{col.label}</th>
                                            ))}
                                            {showActions && <th>Ações</th>}
                                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r, idx) => (
                            <tr key={r.id ?? r.isbn ?? idx}>
                                {(columns && columns.length > 0 ? columns : defaultColumns()).map(col => (
                                    <td key={col.key}>
                                        {renderCell(r, col.key)}
                                    </td>
                                ))}
                                {showActions && (
                                    <td>
                                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                            {/* edit for non-livro entities */}
                                            {getEntityFromPath(apiPath) !== 'livros' && (
                                              <button className="btn" style={{padding:'6px 8px',fontSize:'0.85rem'}} onClick={() => handleEdit(r)}>Editar</button>
                                            )}
                                            <button className="btn btn-danger" style={{padding:'6px 8px',fontSize:'0.85rem'}} onClick={() => handleDelete(r)}>Excluir</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
                {error && error.code && (error.code === 401 || error.code === 403) && (
                    <div style={{textAlign:'center',padding:16}}>
                        <div style={{marginBottom:8}}>{error.message}</div>
                        <div style={{display:'flex',justifyContent:'center',gap:8}}>
                            <button className="btn" onClick={() => navigate('/login')}>Ir para login</button>
                        </div>
                    </div>
                )}
        </>
    );
}

function getEntityFromPath(apiPath){
    if(!apiPath) return '';
    const p = apiPath.replace(/^\//,'').split('/');
    return p[0] || '';
}

function handlePromptForName(row){
    return window.prompt('Editar nome', row.nome || row.titulo || '');
}

async function handleEdit(row){
    try{
        const apiPath = (window.__tabela_lastApiPath || '/autores/listar');
        const entity = getEntityFromPath(apiPath);
        const id = row.id || row.codigo || row._id;
        const newName = handlePromptForName(row);
        if(!newName) return;
        const payload = { id, nome: newName };
        await (await import('../../utils/apiFetch')).default(`/${entity}/alterar`, { method: 'PUT', body: JSON.stringify(payload) });
        // trigger a local refresh: dispatch event that Tabela listens to
        try{ window.dispatchEvent(new Event('tabela:refresh')); }catch(e){ window.location.reload(); }
    }catch(err){
        alert('Erro ao editar: ' + (err.message || err));
    }
}

async function handleDelete(row){
    try{
        const apiPath = (window.__tabela_lastApiPath || '/autores/listar');
        const entity = getEntityFromPath(apiPath);
        const id = row.id || row.codigo || row._id || row.isbn;
        if(!window.confirm('Confirma exclusão?')) return;
        if(entity === 'livros'){
            // livros uses logical delete via atualizar/{id}
            await (await import('../../utils/apiFetch')).default(`/livros/atualizar/${id}`, { method: 'PUT', body: JSON.stringify({ id, status: 'Removido' }) });
        } else {
            await (await import('../../utils/apiFetch')).default(`/${entity}/excluir/${id}`, { method: 'DELETE' });
        }
        try{ window.dispatchEvent(new Event('tabela:refresh')); }catch(e){ window.location.reload(); }
    }catch(err){
        alert('Erro ao excluir: ' + (err.message || err));
    }
}

function renderCell(row, key) {
    const v = row[key];
    if (!v && v !== 0) return '-';
    if (key.toLowerCase().includes('foto') && typeof v === 'string') {
        // normalize same way as BookCard: accept data: URIs, absolute urls, or raw base64
        let src = v;
        if (!src.startsWith('data:') && /^[A-Za-z0-9+/=\s]+$/.test(src) && src.length > 100) {
            src = `data:image/jpeg;base64,${src.replace(/\s+/g,'')}`;
        }
        return <img src={src} alt="foto" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />;
    }
    return String(v);
}

function defaultColumns() {
    return [
        { key: 'foto', label: 'Foto' },
        { key: 'titulo', label: 'Título' },
        { key: 'autorNome', label: 'Autor' },
        { key: 'generoNome', label: 'Gênero' },
        { key: 'isbn', label: 'ISBN' },
        { key: 'paginas', label: 'Páginas' },
        { key: 'anoPublicacao', label: 'Ano' },
        { key: 'status', label: 'Status' },
    ];
}

Tabela.propTypes = {
    titulo: PropTypes.string,
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            titulo: PropTypes.string,
            isbn: PropTypes.string,
            anoPublicacao: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            autor: PropTypes.string,
            genero: PropTypes.string,
            foto: PropTypes.string,
            paginas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            status: PropTypes.string,
        })
    ),
};
