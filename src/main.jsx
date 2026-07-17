import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components/NewFeatures.css';
import './components/MobilePolish.css';

const rootElement = document.getElementById('root');

function showStartupError(error) {
  const message = error?.stack || error?.message || String(error || 'Unknown startup error');
  console.error('PathBloom startup error:', error);

  if (!rootElement) {
    return;
  }
  rootElement.innerHTML = `
    <div style="min-height:100vh;padding:24px;background:#10101c;color:#f5f5f5;font-family:Arial,sans-serif;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:14px;">
      <h1 style="margin:0;font-size:24px;">PathBloom failed to start</h1>
      <p style="margin:0;color:#d6d6e7;line-height:1.5;">The Android WebView hit a startup error. Clear the app data or rebuild with <code>npm run build && npx cap sync android</code>.</p>
      <pre style="white-space:pre-wrap;overflow:auto;max-height:45vh;background:#1b1b2f;border-radius:12px;padding:14px;color:#ffb4b4;font-size:12px;line-height:1.4;">${message.replace(/[<>&]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char])}</pre>
    </div>
  `;
}

window.addEventListener('error', event => {
  showStartupError(event.error || event.message);
});

window.addEventListener('unhandledrejection', event => {
  showStartupError(event.reason || event);
});

async function bootstrap() {
  try {
    // Runtime order matters: compatibility fixes first, connected simulation second,
    // then country careers and smart monthly controls wrap the completed pipeline.
    await import('./logic/GameEngineRuntimeFixes');
    await import('./logic/DeepSimulationRuntime');
    await import('./logic/CountryJobRuntime');
    await import('./logic/SmartMonthRuntime');

    const [{ App: CapApp }, { default: App }, { default: ErrorBoundary }] = await Promise.all([
      import('@capacitor/app'),
      import('./App.jsx'),
      import('./components/ErrorBoundary.jsx'),
    ]);

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

    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (error) {
    showStartupError(error);
  }
}

bootstrap();
