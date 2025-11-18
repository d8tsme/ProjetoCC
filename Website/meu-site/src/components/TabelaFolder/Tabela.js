import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../utils/apiFetch';
import PropTypes from "prop-types";

// Tabela is generic; pass `apiPath` like '/livros/listar' to fetch data
export default function Tabela({ titulo = "Lista", rows, apiPath = '/livros/listar', columns }) {
    const [data, setData] = useState(rows || []);
    const [loading, setLoading] = useState(!rows || (Array.isArray(rows) && rows.length === 0));
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // if rows passed from parent, use them and skip fetching
        if (rows && Array.isArray(rows) && rows.length > 0) {
            setData(rows);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        apiFetch(apiPath, { method: 'GET' })
            .then((json) => {
                if (cancelled) return;
                // support array responses or wrapped objects like { data: [...] } or { books: [...] }
                const items = Array.isArray(json) ? json : json?.data ?? json?.books ?? [];
                setData(items);
            })
            .catch((err) => {
                if (cancelled) return;
                // on auth errors navigate to login
                if (err.status === 401 || err.status === 403) {
                    navigate('/login');
                    return;
                }
                setError(err.message || "Erro ao carregar dados");
                setData([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [rows, navigate, apiPath]);

    return (
        <>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-medium)' }}>Carregando...</div>
            ) : error ? (
                <div className="error-message">Erro: {error}</div>
            ) : data.length === 0 ? (
                <div className="table-empty">Nenhum registro encontrado.</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            {(columns && columns.length > 0 ? columns : defaultColumns()).map(col => (
                                <th key={col.key}>{col.label}</th>
                            ))}
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

function renderCell(row, key) {
    const v = row[key];
    if (!v && v !== 0) return '-';
    if (key.toLowerCase().includes('foto') && typeof v === 'string') {
        return <img src={v} alt="foto" style={{ width: 60, height: 'auto', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />;
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
