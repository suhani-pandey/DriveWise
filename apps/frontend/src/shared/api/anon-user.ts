/**
 * Anonymous per-browser identity for the watchlist until real auth (Clerk)
 * lands. The backend only needs a stable opaque id in the x-user-id header.
 */
const STORAGE_KEY = 'drivewise.anon-user-id';

export const getAnonUserId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};
