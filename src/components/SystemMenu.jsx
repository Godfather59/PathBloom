import React from 'react';
import { LANGUAGES } from '../logic/i18n';
import { THEMES } from '../logic/themes';
import './Modal.css';

export function SystemMenu({
  language = 'en',
  currentTheme = 'dark',
  t = (key, fallback) => fallback || key,
  onLanguageChange,
  onThemeChange,
  onResume,
  onSave,
  onExit,
  onGodMode,
  onStats,
  onHistory,
  onFamilyTree,
  onWorldNews,
  onWorldOverview,
  onAchievements,
  onChallenge,
  onTutorial,
  onResetTutorial,
  audioEnabled = true,
  onSoundToggle,
  sfxVolume = 0.7,
  onSfxVolumeChange,
  musicVolume = 0.5,
  onMusicVolumeChange,
  hapticsEnabled = true,
  onHapticsToggle,
  onDebug,
  onRelationshipDashboard,
  onEventHistory,
  onLifeTimeline,
  onCountryProfile,
}) {
  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '340px' }}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="modal-header">
          <h2 className="modal-title">⏸️ {t('system.paused', 'Paused')}</h2>
          <button className="close-btn" onClick={onResume}>
            &times;
          </button>
        </div>

        <div
          className="modal-body"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <button
            className="btn-primary"
            onClick={onResume}
            style={{ padding: '16px', fontSize: '1.1rem' }}
          >
            ▶️ {t('system.resume', 'Resume Game')}
          </button>

          <button
            className="btn-secondary"
            onClick={onSave}
            style={{ padding: '16px', fontSize: '1.1rem' }}
          >
            💾 {t('system.save', 'Save Game')}
          </button>

          <button
            className="list-item"
            onClick={onGodMode}
            style={{
              padding: '16px',
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #ffd700, #ffa500)',
              color: 'black',
              fontWeight: 'bold',
              border: 'none',
              marginBottom: 0,
              textAlign: 'center',
            }}
          >
            ⚡ {t('system.godMode', 'God Mode')}
          </button>

          <button className="btn-secondary" onClick={onStats} style={{ padding: '12px' }}>
            📊 {t('system.stats', 'Lifetime Stats')}
          </button>

          <button className="btn-secondary" onClick={onHistory} style={{ padding: '12px' }}>
            📈 {t('system.history', 'Current Life Trends')}
          </button>

          <button className="btn-secondary" onClick={onFamilyTree} style={{ padding: '12px' }}>
            🌳 {t('system.familyTree', 'Family Dynasty')}
          </button>

          <button className="btn-secondary" onClick={onWorldNews} style={{ padding: '12px' }}>
            📰 {t('system.worldNews', 'World News')}
          </button>

          <button className="btn-secondary" onClick={onWorldOverview} style={{ padding: '12px' }}>
            🌍 {t('system.worldOverview', 'World Overview')}
          </button>

          {onRelationshipDashboard && (
            <button className="btn-secondary" onClick={onRelationshipDashboard} style={{ padding: '12px' }}>
              📊 {t('system.relationships', 'Relationships')}
            </button>
          )}

          {onLifeTimeline && (
            <button className="btn-secondary" onClick={onLifeTimeline} style={{ padding: '12px' }}>
              📈 {t('system.lifeTimeline', 'Life Timeline')}
            </button>
          )}

          {onEventHistory && (
            <button className="btn-secondary" onClick={onEventHistory} style={{ padding: '12px' }}>
              📜 {t('system.eventHistory', 'Event History')}
            </button>
          )}

          {onCountryProfile && (
            <button className="btn-secondary" onClick={onCountryProfile} style={{ padding: '12px' }}>
              🗺️ {t('system.countryProfile', 'Country Profile')}
            </button>
          )}

          {onDebug && (
            <button className="btn-secondary" onClick={onDebug} style={{ padding: '12px', fontSize: '0.85rem', color: '#888' }}>
              🛠️ {t('system.debug', 'Debug Tools')}
            </button>
          )}

          <button className="btn-secondary" onClick={onAchievements} style={{ padding: '12px' }}>
            🏆 {t('system.achievements', 'Achievements')}
          </button>

          <button className="btn-secondary" onClick={onChallenge} style={{ padding: '12px' }}>
            🎯 {t('system.challenge', 'Challenges')}
          </button>

          <button className="btn-secondary" onClick={onTutorial} style={{ padding: '12px' }}>
            🧭 {t('system.tutorial', 'Tutorial')}
          </button>

          <button
            className="btn-secondary"
            onClick={onResetTutorial}
            style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
          >
            🔄 {t('system.resetTutorial', 'Reset Tutorial')}
          </button>

          <div className="settings-language">
            <div className="settings-language-label">🔊 {t('system.sound', 'Sound')}</div>
            <div className="settings-language-options">
              <button
                type="button"
                className={`language-chip ${audioEnabled ? 'active' : ''}`}
                onClick={() => onSoundToggle?.(true)}
              >
                🔊 {t('common.on', 'On')}
              </button>
              <button
                type="button"
                className={`language-chip ${!audioEnabled ? 'active' : ''}`}
                onClick={() => onSoundToggle?.(false)}
              >
                🔇 {t('common.off', 'Off')}
              </button>
            </div>
          </div>

          <div className="settings-language">
            <div className="settings-language-label">🎵 {t('system.sfxVolume', 'SFX Volume')}</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              onChange={e => onSfxVolumeChange?.(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {Math.round(sfxVolume * 100)}%
            </div>
          </div>

          <div className="settings-language">
            <div className="settings-language-label">🎶 {t('system.musicVolume', 'Music Volume')}</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={e => onMusicVolumeChange?.(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {Math.round(musicVolume * 100)}%
            </div>
          </div>

          <div className="settings-language">
            <div className="settings-language-label">📳 {t('system.haptics', 'Vibration')}</div>
            <div className="settings-language-options">
              <button
                type="button"
                className={`language-chip ${hapticsEnabled ? 'active' : ''}`}
                onClick={() => onHapticsToggle?.(true)}
              >
                {t('common.on', 'On')}
              </button>
              <button
                type="button"
                className={`language-chip ${!hapticsEnabled ? 'active' : ''}`}
                onClick={() => onHapticsToggle?.(false)}
              >
                {t('common.off', 'Off')}
              </button>
            </div>
          </div>

          <div className="settings-language">
            <div className="settings-language-label">🌐 {t('system.language', 'Language')}</div>
            <div className="settings-language-options">
              {LANGUAGES.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`language-chip ${language === option.id ? 'active' : ''}`}
                  onClick={() => onLanguageChange?.(option.id)}
                >
                  {option.nativeName}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-language">
            <div className="settings-language-label">🎨 {t('system.theme', 'Theme')}</div>
            <div className="settings-language-options" style={{ flexWrap: 'wrap', gap: '4px' }}>
              {Object.entries(THEMES).map(([id, theme]) => (
                <button
                  key={id}
                  type="button"
                  className={`language-chip ${currentTheme === id ? 'active' : ''}`}
                  onClick={() => onThemeChange?.(id)}
                >
                  {theme.icon} {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }}></div>

          <button
            className="btn-danger"
            onClick={() => {
              if (
                confirm(
                  t(
                    'system.exitConfirm',
                    'Are you sure you want to exit? Unsaved progress will be lost.'
                  )
                )
              ) {
                onExit();
              }
            }}
            style={{ padding: '16px', fontSize: '1.1rem' }}
          >
            🚪 {t('system.exit', 'Exit to Main Menu')}
          </button>
        </div>
      </div>
    </div>
  );
}
