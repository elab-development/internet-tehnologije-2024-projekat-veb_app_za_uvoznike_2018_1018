import React from "react";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Zatvori">×</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}