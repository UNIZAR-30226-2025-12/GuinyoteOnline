import React from 'react';

function ConfirmLogoutModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>¿Estás seguro de que quieres cerrar sesión?</h3>
        <div className="modal-buttons">
          <button type="button" onClick={onConfirm}>Sí</button>
          <button type="button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogoutModal;
