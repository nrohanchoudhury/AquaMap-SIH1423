import React from 'react';
import { useAqua } from '../context/AquaContext';
import { CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useAqua();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={'toast toast-' + toast.type}>
          <div className="toast-icon">
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} color="#16a34a" />
            ) : (
              <Info size={18} color="#2563a6" />
            )}
          </div>
          <div className="toast-content" style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#16324f', marginBottom: '2px' }}>
              {toast.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#667784' }}>{toast.message}</div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
