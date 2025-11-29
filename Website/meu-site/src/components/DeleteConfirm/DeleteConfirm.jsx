import React from "react";
import "./DeleteConfirm.css";

export default function DeleteConfirm({ open, setOpen, registro, onConfirm, onClose }) {
  if (!open) return null;

  const handleCancel = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleConfirm = () => {
    onConfirm && onConfirm(registro);
    setOpen(false);
    onClose && onClose();
  };

  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm-box">
        <h3>Confirmar exclusão</h3>
        <p>Tem certeza que deseja excluir este registro?</p>

        <div className="delete-confirm-actions">
          <button className="btn secondary" onClick={handleCancel}>Cancelar</button>
          <button className="btn danger" onClick={handleConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}
