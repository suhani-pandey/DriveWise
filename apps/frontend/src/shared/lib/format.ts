/** Danish-locale formatting helpers used across the app. */

const dkkFormat = new Intl.NumberFormat('da-DK', { maximumFractionDigits: 0 });

/** 419000 → "419.000 kr." */
export const formatDkk = (amount: number): string => `${dkkFormat.format(amount)} kr.`;

/** 419000 → "419k" — compact price for cards. */
export const formatDkkShort = (amount: number): string =>
  amount >= 1000 ? `${Math.round(amount / 1000)}k` : `${amount}`;

/** 34000 → "34.000 km" */
export const formatKm = (km: number): string => `${dkkFormat.format(km)} km`;

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  );
