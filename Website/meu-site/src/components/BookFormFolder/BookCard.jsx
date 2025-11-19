import React from 'react';

export default function BookCard({ book, onEdit, onRemove, onSelect, selected }) {
  function normalizeSrc(src){
    if(!src) return '/placeholder-book.png';
    if(src.startsWith('data:')) return src;
    // if looks like base64 without prefix, heuristically add jpeg prefix
    if(/^[A-Za-z0-9+/=\s]+$/.test(src) && src.length > 100) return `data:image/jpeg;base64,${src.replace(/\s+/g,'')}`;
    return src;
  }

  return (
    <div className={`book-card ${selected ? 'selected' : ''}`}>
      <div className="book-card-media">
        <img src={normalizeSrc(book.foto)} alt={book.titulo} />
      </div>
      <div className="book-card-body">
        <div className="book-card-title" title={book.titulo}>{book.titulo}</div>
        <div className="book-card-sub">{book.autorNome || book.autor || ''}</div>
        <div className="book-card-meta">{book.status || 'Disponível'}</div>
      </div>
      <div className="book-card-actions">
        <input type="checkbox" checked={!!selected} onChange={e => onSelect && onSelect(book, e.target.checked)} aria-label={`select-${book.titulo}`} />
        <button className="btn" onClick={onEdit}>Editar</button>
        <button className="btn btn-danger" onClick={onRemove}>Remover</button>
      </div>
    </div>
  );
}
