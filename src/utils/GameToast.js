let toastTimer = null;

export function showGameToast(message, type = 'neutral') {
  const existing = document.getElementById('game-toast');
  if (existing) {
    existing.remove();
  }
  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  const el = document.createElement('div');
  el.id = 'game-toast';
  el.textContent = message;

  const bgColor = type === 'good' ? '#2e7d32' : type === 'bad' ? '#c62828' : '#333';
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: bgColor,
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    zIndex: '99999',
    fontSize: '14px',
    maxWidth: '80%',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    opacity: '1',
    transition: 'opacity 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  });

  document.body.appendChild(el);

  toastTimer = setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 300);
  }, 2500);
}
