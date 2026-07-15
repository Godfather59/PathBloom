export function vibrate(pattern = [15]) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }
  try {
    navigator.vibrate(pattern);
  } catch {
    // Ignore haptic errors on unsupported devices
  }
}

export const HAPTICS = {
  light: () => vibrate([10]),
  medium: () => vibrate([20]),
  heavy: () => vibrate([35]),
  success: () => vibrate([10, 30, 10]),
  warning: () => vibrate([20, 40, 20]),
  error: () => vibrate([40, 20, 40]),
  ageUp: () => vibrate([25]),
  achievement: () => vibrate([15, 20, 15, 30, 15]),
  event: () => vibrate([12]),
  death: () => vibrate([60, 30, 60]),
};
