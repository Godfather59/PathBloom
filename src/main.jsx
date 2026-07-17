import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installArabicLocalizationRuntime } from './logic/ArabicLocalizationRuntime';
import { installArabicSupplementalRuntime } from './logic/ArabicSupplementalRuntime';
import {
  dispatchInGameBack,
  findVisibleBackControl,
  hasVisibleBackLayer,
} from './logic/AndroidBackNavigation';
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
import './components/SaveRelease.css';
import './components/ThemeCompatibility.css';
import './components/ScreenshotRegressionFixes.css';
import './components/ShellRefresh.css';
import './components/ScreenshotFollowup.css';

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

  if (!rootElement) {
    return;
  }
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

function installVisualViewportBridge() {
  const viewport = window.visualViewport;
  if (!viewport) {
    return;
  }

  const update = () => {
    document.documentElement.style.setProperty('--pb-visual-height', `${viewport.height}px`);
    const keyboardHeight = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    document.documentElement.style.setProperty('--pb-keyboard-height', `${keyboardHeight}px`);
  };

  viewport.addEventListener('resize', update);
  viewport.addEventListener('scroll', update);
  update();
}

async function bootstrap() {
  try {
    // Runtime order matters: foundational fixes first, connected personal simulation second,
    // country careers and the autonomous world next, data-driven content after that, smart
    // monthly controls next, and release/save polish last so it observes the final behavior.
    await import('./logic/BrowserRequireBridge');
    await import('./logic/GameEngineRuntimeFixes');
    await import('./logic/DeepSimulationRuntime');
    await import('./logic/CountryJobRuntime');
    await import('./logic/WorldSimulation2Runtime');
    await import('./logic/DataDrivenContentRuntime');
    await import('./logic/SmartMonthRuntime');
    await import('./logic/ReleasePolishRuntime');
    await import('./logic/FeedbackPreferencesRuntime');

    const [{ App: CapApp }, { default: App }, { default: ErrorBoundary }] = await Promise.all([
      import('@capacitor/app'),
      import('./App.jsx'),
      import('./components/ErrorBoundary.jsx'),
    ]);

    installVisualViewportBridge();

    let backCount = 0;
    await CapApp.addListener('backButton', event => {
      const handledInGame = dispatchInGameBack(event);
      if (handledInGame) {
        backCount = 0;
        return;
      }

      const closeControl = findVisibleBackControl();
      if (closeControl) {
        closeControl.click();
        backCount = 0;
        return;
      }

      // Mandatory decisions and non-dismissible layers must consume Back instead of
      // making the first gesture appear broken and the second gesture exit the app.
      if (hasVisibleBackLayer()) {
        backCount = 0;
        return;
      }

      if (event?.canGoBack && window.history.length > 1) {
        window.history.back();
        backCount = 0;
        return;
      }

      backCount += 1;
      if (backCount >= 2) {
        CapApp.exitApp();
      }
      setTimeout(() => {
        backCount = 0;
      }, 2000);
    });

    // Capacitor 8 exposes this switch explicitly. Keeping it enabled makes Android's
    // button and edge-swipe gesture use the same listener on Android 13-16.
    await CapApp.toggleBackButtonHandler({ enabled: true });

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
