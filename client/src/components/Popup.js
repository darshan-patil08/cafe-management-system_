import React, { useEffect } from 'react';

// Simple toast-style Popup component
// Props: message (string), type ('info' | 'success' | 'error' | 'warning'),
// isVisible (boolean), onClose (function)
const Popup = ({ message = '', type = 'info', isVisible = false, onClose = () => {} }) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const palette = {
    info: { bg: '#0ea5e9', text: '#ffffff' },
    success: { bg: '#22c55e', text: '#ffffff' },
    error: { bg: '#ef4444', text: '#ffffff' },
    warning: { bg: '#f59e0b', text: '#1f2937' }
  };

  const { bg, text } = palette[type] || palette.info;

  const containerStyle = {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: bg,
    color: text,
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    maxWidth: '92vw',
    width: 'fit-content',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  };

  const closeBtnStyle = {
    marginLeft: '8px',
    background: 'rgba(255,255,255,0.2)',
    color: text,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '6px 8px',
    lineHeight: 1,
  };

  const iconMap = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  return (
    <div style={containerStyle} role="status" aria-live="polite">
      <span style={{ fontSize: 18 }}>{iconMap[type] || iconMap.info}</span>
      <span style={{ fontWeight: 600 }}>{message}</span>
      <button style={closeBtnStyle} onClick={onClose} aria-label="Close notification">✕</button>
    </div>
  );
};

export default Popup;
