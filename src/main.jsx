import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installArabicLocalizationRuntime } from './logic/ArabicLocalizationRuntime';
import { installArabicSupplementalRuntime } from './logic/ArabicSupplementalRuntime';
import { installPhaseTwoScreenRuntime } from './logic/PhaseTwoScreenRuntime';
import './index.css';
import './components/NewFeatures.css';
import './components/MobilePolish.css';
import './components/ArabicRTL.css';
import './components/DesignSystem.css';
import './components/ShellExtensions.css';
import './components/PrisonRedesign.css';
import './components/DecisionSheet.css';
import './components/DestinationScreens.css';
import './components/SystemMenuRedesign.css';
import './components/PhaseTwoScreens.css';
import './components/PhaseTwoFeatureStyles.css';
import './components/PhaseTwoMusicStyles.css';
import './components/ReleasePolish.css';
import './components/ReleasePerformance.css';

const rootElement = document.getElementById('root');

function isArabicLanguage() {
  try {
    return (
      localStorage.getItem('pathbloom_language') === 'ar' ||
      localStorage.getItem('lifepath_language') === 'ar'
    );
  } catch {
    return false;
  }
}

function showStartupError(error) {
  const message = error?.stack || error?.message || String(error || 'Unknown startup error');
  console.error('PathBloom startup error:', error);

  if (!rootElement) return;
  const isArabic = isArabicLanguage();
  const title = isArabic ? 'تعذر تشغيل PathBloom' : 'PathBloom failed to start';
  const help = isArabic
    ? 'واجه Android WebView خطأ أثناء التشغيل. امسح بيانات التطبيق أو أعد البناء باستخدام npm run build ثم npx cap sync android.'
    : 'The Android WebView hit a startup error. Clear the app data or rebuild with npm run build && npx cap sync android.';

  rootElement.innerHTML = `
    <div dir="${isArabic ? 'rtl' : 'ltr'}" style="min-height:100vh;padding:24px;background:#10101c;color:#f5f5f5;font-family:Arial,sans-serif;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:14px;">
      <h1 style="margin:0;font-size:24px;">${title}</h1>
      <p style="margin:0;color:#d6d6e7;line-height:1.5;">${help}</p>
      <pre dir="ltr" style="white-space:pre-wrap;overflow:auto;max-height:45vh;background:#1b1b2f;border-radius:12px;padding:14px;color:#ffb4b4;font-size:12px;line-height:1.4;">${message.replace(/[<>&]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char])}</pre>
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
    // Runtime order matters: foundational fixes first, connected personal simulation second,
    // country careers and the autonomous world next, data-driven content after that, smart
    // monthly controls next, and release/save polish last so it observes the final behavior.
    await import('./logic/GameEngineRuntimeFixes');
    await import('./logic/DeepSimulationRuntime');
    await import('./logic/CountryJobRuntime');
    await import('./logic/WorldSimulation2Runtime');
    await import('./logic/DataDrivenContentRuntime');
    await import('./logic/SmartMonthRuntime');
    await import('./logic/ReleasePolishRuntime');

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

    installArabicSupplementalRuntime();
    installArabicLocalizationRuntime();
    installPhaseTwoScreenRuntime();
  } catch (error) {
    showStartupError(error);
  }
}

bootstrap();
