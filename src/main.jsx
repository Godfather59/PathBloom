import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as CapApp } from '@capacitor/app';
import './index.css';
import './components/NewFeatures.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

let backCount = 0;
CapApp.addListener('backButton', event => {
  const customEvent = new CustomEvent('capacitor-back', { detail: event, cancelable: true });
  const handledInGame = !window.dispatchEvent(customEvent);
  if (handledInGame) {
    backCount = 0;
    return;
  }
  backCount++;
  if (backCount >= 2) {
    CapApp.exitApp();
  }
  setTimeout(() => {
    backCount = 0;
  }, 2000);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
