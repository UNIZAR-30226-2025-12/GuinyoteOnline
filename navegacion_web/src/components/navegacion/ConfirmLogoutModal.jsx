import React from 'react';
import '/src/styles/ConfirmLogoutModal.css'

function ConfirmLogoutModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="confirmlogout-modal-overlay">
      <div className="confirmlogout-modal-content">
        <h3>¿Estás seguro de que quieres cerrar sesión?</h3>
        <div className="confirmlogout-modal-buttons">
          <button type="button" onClick={onConfirm}>Sí</button>
          <button type="button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogoutModal;
