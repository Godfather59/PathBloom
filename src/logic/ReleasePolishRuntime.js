import { Person } from './Person';
import { GameEngine } from './GameEngine';
import { getCurrentTimePerson } from './TimeProgression';
import {
  ensurePlayerJourney,
  recordJourneyAction,
  updatePlayerJourney,
} from './PlayerJourney';
import { checksumText, parseStoredSave } from './SaveReliability';
import { HAPTICS } from './Haptics';
import {
  achievement as playAchievement,
  playAgeUp,
  playBadEvent,
  playGoodEvent,
  playMoney,
  playNotification,
  playSuccess,
  playTap,
} from './Audio';

const RUNTIME_FLAG = Symbol.for('pathbloom.releasePolishRuntime');
const SAVE_PATCH_FLAG = Symbol.for('pathbloom.saveReliabilityPatch');
const METHOD_PATCH_FLAG = Symbol.for('pathbloom.releasePolishMethodPatch');
let lastSaveStatus = { status: 'idle', at: 0 };
let domObserver = null;

function language() {
  try {
    return localStorage.getItem('pathbloom_language') === 'ar' ||
      localStorage.getItem('lifepath_language') === 'ar'
      ? 'ar'
      : 'en';
  } catch {
    return document.documentElement.lang?.startsWith('ar') ? 'ar' : 'en';
  }
}

function hapticsAllowed() {
  try {
    return localStorage.getItem('pathbloom_haptics_enabled') !== 'false';
  } catch {
    return true;
  }
}

function dispatchSaveStatus(status, details = {}) {
  lastSaveStatus = { status, at: Date.now(), ...details };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pathbloom-save-status', { detail: lastSaveStatus }));
  }
  injectSaveStatus();
}

function saveStatusCopy(status, locale) {
  const values = locale === 'ar'
    ? { saving: 'جارٍ الحفظ', saved: 'تم الحفظ', recovered: 'تم الاسترداد', error: 'فشل الحفظ', idle: 'حفظ تلقائي' }
    : { saving: 'Saving', saved: 'Saved', recovered: 'Recovered', error: 'Save failed', idle: 'Autosave' };
  return values[status] || values.idle;
}

function injectSaveStatus() {
  if (typeof document === 'undefined') return;
  const roleLine = document.querySelector('.hud-role-line');
  if (!roleLine) return;
  let indicator = roleLine.querySelector('.hud-save-status');
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.className = 'hud-save-status';
    roleLine.append(indicator);
  }
  indicator.className = `hud-save-status is-${lastSaveStatus.status || 'idle'}`;
  indicator.textContent = saveStatusCopy(lastSaveStatus.status, language());
  indicator.setAttribute('aria-live', 'polite');
}

function isPrimarySaveKey(key) {
  return /^bitlife_save_slot_/.test(String(key || '')) && !/_(backup|tmp)$/.test(String(key || ''));
}

function protectedEnvelope(payload) {
  const payloadText = JSON.stringify(payload);
  return JSON.stringify({
    storageVersion: 1,
    checksum: checksumText(payloadText),
    payload,
  });
}

function installStorageProtection() {
  if (typeof Storage === 'undefined' || Storage.prototype[SAVE_PATCH_FLAG]) return;
  const prototype = Storage.prototype;
  const nativeGet = prototype.getItem;
  const nativeSet = prototype.setItem;
  const nativeRemove = prototype.removeItem;
  let internalWrite = false;

  Object.defineProperty(prototype, SAVE_PATCH_FLAG, { value: true, configurable: false });

  prototype.setItem = function patchedSetItem(key, value) {
    if (internalWrite || !isPrimarySaveKey(key)) {
      return nativeSet.call(this, key, value);
    }

    dispatchSaveStatus('saving');
    const primary = String(key);
    const backup = `${primary}_backup`;
    const temp = `${primary}_tmp`;

    try {
      const incoming = parseStoredSave(String(value));
      if (!incoming.ok) throw new Error(`Invalid save payload: ${incoming.reason}`);
      const serialized = protectedEnvelope(incoming.payload);
      const existing = nativeGet.call(this, primary);
      if (existing && parseStoredSave(existing).ok) {
        internalWrite = true;
        nativeSet.call(this, backup, existing);
        internalWrite = false;
      }

      internalWrite = true;
      nativeSet.call(this, temp, serialized);
      const tempCheck = parseStoredSave(nativeGet.call(this, temp));
      if (!tempCheck.ok) throw new Error(`Temporary save verification failed: ${tempCheck.reason}`);
      nativeSet.call(this, primary, serialized);
      const primaryCheck = parseStoredSave(nativeGet.call(this, primary));
      if (!primaryCheck.ok) throw new Error(`Primary save verification failed: ${primaryCheck.reason}`);
      nativeRemove.call(this, temp);
      internalWrite = false;
      dispatchSaveStatus('saved', { protected: true, backupAvailable: Boolean(existing) });
      return undefined;
    } catch (error) {
      internalWrite = false;
      dispatchSaveStatus('error', { reason: error?.message || String(error) });
      throw error;
    }
  };

  prototype.getItem = function patchedGetItem(key) {
    if (!isPrimarySaveKey(key)) return nativeGet.call(this, key);
    const primary = String(key);
    const candidates = [
      ['primary', primary],
      ['temp', `${primary}_tmp`],
      ['backup', `${primary}_backup`],
    ];

    for (const [source, candidateKey] of candidates) {
      const raw = nativeGet.call(this, candidateKey);
      if (!raw) continue;
      const parsed = parseStoredSave(raw);
      if (!parsed.ok) continue;
      if (source !== 'primary') {
        try {
          internalWrite = true;
          nativeSet.call(this, primary, raw);
          if (source === 'temp') nativeRemove.call(this, candidateKey);
          internalWrite = false;
        } catch {
          internalWrite = false;
        }
        dispatchSaveStatus('recovered', { source });
      }
      return JSON.stringify(parsed.payload);
    }

    return nativeGet.call(this, primary);
  };

  prototype.removeItem = function patchedRemoveItem(key) {
    if (!isPrimarySaveKey(key)) return nativeRemove.call(this, key);
    const primary = String(key);
    nativeRemove.call(this, primary);
    nativeRemove.call(this, `${primary}_backup`);
    nativeRemove.call(this, `${primary}_tmp`);
    const slotId = primary.replace(/^bitlife_save_/, '');
    nativeRemove.call(this, `pathbloom_save_health_${slotId}`);
    return undefined;
  };
}

function emitJourneyNotifications(person) {
  const notifications = updatePlayerJourney(person, language());
  if (!notifications.length || typeof window === 'undefined') return;
  notifications.forEach((notification, index) => {
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('pathbloom-journey-notification', { detail: notification })
      );
      if (notification.type === 'goal') {
        playSuccess();
        if (hapticsAllowed()) HAPTICS.success();
      } else {
        playNotification();
        if (hapticsAllowed()) HAPTICS.light();
      }
    }, index * 650);
  });
}

function patchMethod(target, name, after) {
  const original = target?.[name];
  if (typeof original !== 'function' || original[METHOD_PATCH_FLAG]) return;
  function wrappedMethod(...args) {
    const result = original.apply(this, args);
    try {
      after.call(this, result, args);
    } catch (error) {
      console.warn(`Release polish hook failed for ${name}.`, error);
    }
    return result;
  }
  Object.defineProperty(wrappedMethod, METHOD_PATCH_FLAG, { value: true });
  target[name] = wrappedMethod;
}

function installJourneyHooks() {
  patchMethod(Person.prototype, 'clone', function afterClone(result) {
    ensurePlayerJourney(this);
    if (result) ensurePlayerJourney(result);
  });

  if (typeof Person.load === 'function' && !Person.load[METHOD_PATCH_FLAG]) {
    const originalLoad = Person.load;
    function patchedLoad(...args) {
      const person = originalLoad.apply(this, args);
      if (person) ensurePlayerJourney(person);
      return person;
    }
    Object.defineProperty(patchedLoad, METHOD_PATCH_FLAG, { value: true });
    Person.load = patchedLoad;
  }

  patchMethod(Person.prototype, 'logEvent', function afterLogEvent(result, args) {
    const text = String(args?.[0]?.text || args?.[0] || '');
    if (/achievement unlocked/i.test(text)) {
      playAchievement();
      if (hapticsAllowed()) HAPTICS.achievement();
    }
    queueMicrotask(() => emitJourneyNotifications(this));
  });

  patchMethod(Person.prototype, 'performActivity', function afterActivity(result, args) {
    const activity = args?.[0] || {};
    const signature = `${activity.id || ''} ${activity.name || ''} ${activity.category || ''}`.toLowerCase();
    recordJourneyAction(this, 'activity_done');
    if (/gym|fitness|meditat|yoga|run|walk|library|doctor|health|diet|therapy|relax/.test(signature)) {
      recordJourneyAction(this, 'healthy_activity');
    }
    emitJourneyNotifications(this);
  });

  patchMethod(Person.prototype, 'studyHard', function afterStudy() {
    recordJourneyAction(this, 'studied');
    emitJourneyNotifications(this);
  });

  patchMethod(Person.prototype, 'setJob', function afterJob(result) {
    if (result !== false && this.job) {
      recordJourneyAction(this, 'career_started');
      playSuccess();
      if (hapticsAllowed()) HAPTICS.success();
    }
    emitJourneyNotifications(this);
  });

  patchMethod(Person.prototype, 'joinMilitary', function afterMilitary(result) {
    if (result !== false) recordJourneyAction(this, 'career_started');
    emitJourneyNotifications(this);
  });

  ['interactWithRel', 'startDating'].forEach(name => {
    patchMethod(Person.prototype, name, function afterRelationship() {
      recordJourneyAction(this, 'relationship_action');
      emitJourneyNotifications(this);
    });
  });

  ['buyAsset', 'buyInvestment'].forEach(name => {
    patchMethod(Person.prototype, name, function afterPurchase(result) {
      if (result !== false) {
        recordJourneyAction(this, 'asset_action');
        playMoney();
        if (hapticsAllowed()) HAPTICS.medium();
      }
      emitJourneyNotifications(this);
    });
  });

  patchMethod(Person.prototype, 'resolveEvent', function afterDecision(result, args) {
    const choice = args?.[0] || {};
    const harmful = choice.type === 'bad' || Number(choice.effects?.karma) < 0 || Number(choice.effects?.health) < 0;
    if (harmful) {
      playBadEvent();
      if (hapticsAllowed()) HAPTICS.warning();
    } else {
      playGoodEvent();
      if (hapticsAllowed()) HAPTICS.success();
    }
    recordJourneyAction(this, 'decision_made');
    emitJourneyNotifications(this);
  });

  patchMethod(GameEngine, 'ageUp', function afterAgeUp(result, args) {
    const person = args?.[0];
    if (!person) return;
    recordJourneyAction(person, 'age_up');
    emitJourneyNotifications(person);
    playAgeUp();
  });
}

function clickJourneyDestination(action) {
  const person = getCurrentTimePerson();
  if (person) {
    if (action === 'activities') recordJourneyAction(person, 'open_activities');
    else recordJourneyAction(person, `open_${action}`);
    emitJourneyNotifications(person);
  }

  if (action === 'age_up') {
    document.querySelector('.time-primary-action')?.click();
    return;
  }

  const shortcuts = [...document.querySelectorAll('.life-shortcut')];
  const shortcutIndex = { occupation: 0, relationships: 1, education: 2, assets: 3 }[action];
  if (Number.isInteger(shortcutIndex) && shortcuts[shortcutIndex]) {
    shortcuts[shortcutIndex].click();
    return;
  }

  const destinations = [...document.querySelectorAll('.bottom-nav-item')];
  const destinationIndex = { life: 0, activities: 1, world: 2, menu: 3 }[action];
  if (Number.isInteger(destinationIndex) && destinations[destinationIndex]) {
    destinations[destinationIndex].click();
  }
}

function installInteractionFeedback() {
  window.addEventListener('pathbloom-journey-action', event => {
    clickJourneyDestination(event.detail?.action);
  });

  document.addEventListener('click', event => {
    const button = event.target?.closest?.('button');
    if (!button || button.disabled) return;
    if (button.matches('.time-primary-action, .decision-option')) return;
    playTap();
  }, { passive: true });
}

function installPerformanceProfile() {
  if (typeof document === 'undefined') return;
  const memory = Number(navigator.deviceMemory) || 8;
  const cores = Number(navigator.hardwareConcurrency) || 8;
  const saveData = Boolean(navigator.connection?.saveData);
  const lowEnd = memory <= 2 || cores <= 4 || saveData;
  document.documentElement.classList.toggle('performance-lite', lowEnd);
  document.documentElement.dataset.performanceProfile = lowEnd ? 'lite' : 'full';
}

function installDomObserver() {
  if (typeof MutationObserver === 'undefined' || domObserver) return;
  domObserver = new MutationObserver(() => injectSaveStatus());
  domObserver.observe(document.documentElement, { subtree: true, childList: true });
  injectSaveStatus();
}

export function installReleasePolishRuntime() {
  if (globalThis[RUNTIME_FLAG]) return;
  globalThis[RUNTIME_FLAG] = true;
  installStorageProtection();
  installJourneyHooks();
  installInteractionFeedback();
  installPerformanceProfile();
  installDomObserver();
  dispatchSaveStatus('idle');
}

installReleasePolishRuntime();
