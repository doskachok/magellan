const LOCALE = 'en-GB';

const moneyFormatters = new Map<string, Intl.NumberFormat>();

const getMoneyFormatter = (currencyCode: string) => {
  let formatter = moneyFormatters.get(currencyCode);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: currencyCode || 'USD',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    moneyFormatters.set(currencyCode, formatter);
  }
  return formatter;
};

export const formatMoney = (amount: number, currencyCode: string) => getMoneyFormatter(currencyCode).format(amount);

export const formatDay = (date: Date | string) => {
  const value = new Date(date);
  const sameYear = value.getFullYear() === new Date().getFullYear();
  return value.toLocaleDateString(LOCALE, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
};

export const formatShortDate = (date: Date | string) =>
  new Date(date).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });

/** Local calendar date as `yyyy-mm-dd`, the value format of `<input type="date">`. */
export const toDateInputValue = (date: Date = new Date()) => {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
};

export const dayKey = (date: Date | string) => toDateInputValue(new Date(date));

export const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join('');

/** Rounds to cents to keep sums of user-entered decimals comparable. */
export const roundMoney = (value: number) => Math.round(value * 100) / 100;

/** Parses user input that may use a comma as decimal separator; returns 0 for empty/invalid input. */
export const parseAmount = (value: string) => {
  const parsed = Number.parseFloat(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

export type Tone = 'positive' | 'negative' | 'neutral';

/** Classifies a signed balance, treating sub-cent rounding noise as zero. */
export const toneOf = (amount: number): Tone => (amount > 0.005 ? 'positive' : amount < -0.005 ? 'negative' : 'neutral');
