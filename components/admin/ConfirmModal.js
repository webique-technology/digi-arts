'use client';
export default function ConfirmModal({ open, title = 'Are you sure?', message, confirmText = 'Delete', busy, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal__actions">
          <button className="btn btn--outline btn--sm" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn btn--danger btn--sm" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmText}</button>
        </div>
      </div>
    </div>
  );
}
