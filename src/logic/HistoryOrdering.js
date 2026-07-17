export function orderHistoryNewestFirst(history = []) {
  const ordered = Array.isArray(history) ? [...history] : [];
  if (ordered.length < 2) {
    return ordered;
  }

  const firstAge = Number(ordered[0]?.age);
  const lastAge = Number(ordered[ordered.length - 1]?.age);
  if (Number.isFinite(firstAge) && Number.isFinite(lastAge) && firstAge < lastAge) {
    ordered.reverse();
  }
  return ordered;
}
