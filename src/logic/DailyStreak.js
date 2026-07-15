const STREAK_KEY = 'pathbloom_daily_streak';
const PLAYED_KEY = 'pathbloom_daily_played';

export function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getDailySeed() {
  const today = getTodayKey();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    const char = today.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getDailyStreak() {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    if (!data) {
      return { streak: 0, lastPlayed: null };
    }
    return JSON.parse(data);
  } catch {
    return { streak: 0, lastPlayed: null };
  }
}

export function recordDailyPlay() {
  const today = getTodayKey();
  const streak = getDailyStreak();
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  let newStreak = 1;
  if (streak.lastPlayed === yesterdayKey) {
    newStreak = streak.streak + 1;
  } else if (streak.lastPlayed === today) {
    newStreak = streak.streak;
  }

  const updated = { streak: newStreak, lastPlayed: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  localStorage.setItem(PLAYED_KEY, JSON.stringify({ date: today, seed: getDailySeed() }));
  return updated;
}

export function hasPlayedToday() {
  try {
    const data = localStorage.getItem(PLAYED_KEY);
    if (!data) {
      return false;
    }
    const played = JSON.parse(data);
    return played.date === getTodayKey();
  } catch {
    return false;
  }
}

export function getDailyLifeConfig() {
  return {
    seed: getDailySeed(),
    date: getTodayKey(),
    isDaily: true,
  };
}
