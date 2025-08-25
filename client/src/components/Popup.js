import React, { useEffect, useRef, useState } from 'react';

// Popup component supporting two modes: 'toast' (default) and 'modal'
// Common Props:
// - isVisible: boolean
// - onClose: function
// Toast Props:
// - message, type ('info'|'success'|'error'|'warning'), duration (ms)
// Modal Props:
// - title, children, closeOnBackdrop (bool), showClose (bool), actions (node)
const Popup = ({
  mode = 'toast',
  message = '',
  type = 'info',
  duration = 3000,
  isVisible = false,
  onClose = () => {},
  // modal-specific
  title = '',
  children = null,
  closeOnBackdrop = true,
  showClose = true,
  actions = null,
}) => {
  const [animate, setAnimate] = useState(false);
  const dialogRef = useRef(null);
  const lastActiveRef = useRef(null);

  // Mount animation trigger
  useEffect(() => {
    if (isVisible) {
      // next frame to allow transition
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    } else {
      setAnimate(false);
    }
  }, [isVisible]);

  // Toast auto-dismiss
  useEffect(() => {
    if (mode !== 'toast' || !isVisible) return;
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [mode, isVisible, duration, onClose]);

  // Modal: esc to close + focus management
  useEffect(() => {
    if (mode !== 'modal' || !isVisible) return;

    // store last focus
    lastActiveRef.current = document.activeElement;
    // focus dialog
    setTimeout(() => {
      if (dialogRef.current) dialogRef.current.focus();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown, { capture: true });
    return () => {
      document.removeEventListener('keydown', onKeyDown, { capture: true });
      // restore focus
      if (lastActiveRef.current && lastActiveRef.current.focus) {
        try { lastActiveRef.current.focus(); } catch {}
      }
    };
  }, [mode, isVisible, onClose]);

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
    right: mode === 'toast' ? '16px' : undefined,
    bottom: mode === 'toast' ? '16px' : undefined,
    inset: mode === 'modal' ? 0 : undefined,
    zIndex: 1000,
    display: mode === 'modal' ? 'grid' : 'flex',
    placeItems: mode === 'modal' ? 'center' : undefined,
    alignItems: mode === 'toast' ? 'center' : undefined,
    gap: mode === 'toast' ? '12px' : undefined,
    background: mode === 'toast' ? bg : 'transparent',
    color: mode === 'toast' ? text : undefined,
    padding: mode === 'toast' ? '12px 16px' : 0,
    borderRadius: mode === 'toast' ? '12px' : 0,
    boxShadow: mode === 'toast' ? '0 10px 30px rgba(0,0,0,0.15)' : 'none',
    maxWidth: mode === 'toast' ? '92vw' : 'none',
    width: mode === 'toast' ? 'fit-content' : 'auto',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    // fade/scale animation
    transition: 'opacity 200ms ease, transform 200ms ease',
    opacity: animate ? 1 : 0,
    transform: mode === 'toast' ? (animate ? 'translateY(0)' : 'translateY(8px)') : 'none'
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

  if (mode === 'toast') {
    return (
      <div style={containerStyle} role="status" aria-live="polite">
        <span style={{ fontSize: 18 }}>{iconMap[type] || iconMap.info}</span>
        <span style={{ fontWeight: 600 }}>{message}</span>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close notification">✕</button>
      </div>
    );
  }

  // Modal rendering
  const backdropStyle = {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
    opacity: animate ? 1 : 0,
    transition: 'opacity 200ms ease'
  };

  const cardStyle = {
    position: 'relative',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.75))',
    color: '#1f2937',
    borderRadius: 16,
    width: 'min(560px, 92vw)',
    padding: 24,
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    transform: animate ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
    transition: 'transform 220ms ease, opacity 220ms ease',
    opacity: animate ? 1 : 0,
    border: '1px solid rgba(255,255,255,0.6)',
    outline: 'none'
  };

  const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
  };
  const titleStyle = { fontSize: 20, fontWeight: 700 };
  const modalCloseBtn = {
    background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#111827'
  };

  const footerStyle = { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 };

  const handleBackdropClick = (e) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div style={backdropStyle} onClick={handleBackdropClick} />
      <div style={containerStyle}>
        <div
          ref={dialogRef}
          style={cardStyle}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Dialog'}
          tabIndex={-1}
        >
          <div style={headerStyle}>
            <div style={titleStyle}>{title}</div>
            {showClose && (
              <button style={modalCloseBtn} onClick={onClose} aria-label="Close dialog">✕</button>
            )}
          </div>
          <div>
            {children || <p style={{ margin: 0 }}>{message}</p>}
          </div>
          {actions && (
            <div style={footerStyle}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Popup;
