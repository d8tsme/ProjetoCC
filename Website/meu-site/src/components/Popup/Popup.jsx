import React from 'react';
import './Popup.css';

export default function Popup({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="popup-close" onClick={onClose}>&times;</button>
        <div className="popup-content">{children}</div>
      </div>
    </div>
  );
}
