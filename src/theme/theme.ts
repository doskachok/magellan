const colors = {
  brand: '#1E7F57',
  brandHover: '#186B49',
  brandPressed: '#145A3D',
  brandSoft: '#E5F3EC',
  onBrand: '#FFFFFF',

  background: '#F4F6F5',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F0',
  border: '#DCE3DF',
  borderStrong: '#839089',

  text: '#14201B',
  textMuted: '#5A6A63',
  textDisabled: '#9AA7A1',

  positive: '#1B7450',
  positiveSoft: '#E5F3EC',
  negative: '#B93A26',
  negativeSoft: '#FBEAE6',
  warning: '#8A5A00',
  warningSoft: '#FFF4DB',

  focus: '#2B6CB0',
  overlay: 'rgba(20, 32, 27, 0.45)',
};

/**
 * Categorical chart hues in a fixed, CVD-validated order: series N always gets slot N, never cycled.
 * Magenta, yellow and aqua are under 3:1 on white, so charts using them must also show values in a legend.
 */
const chart = {
  series: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'],
  other: '#9AA7A1',
};

export const theme = {
  colors,
  chart,
  font: {
    family: `'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
    size: { xs: '12px', sm: '14px', md: '16px', lg: '20px', xl: '28px' },
    weight: { regular: 400, semibold: 600 },
    lineHeight: { tight: 1.2, normal: 1.45 },
  },
  space: (...steps: number[]) => steps.map(step => `${step * 4}px`).join(' '),
  radius: { sm: '8px', md: '12px', lg: '16px', pill: '999px' },
  shadow: {
    card: '0 1px 2px rgba(20, 32, 27, 0.06), 0 1px 3px rgba(20, 32, 27, 0.04)',
    raised: '0 8px 24px rgba(20, 32, 27, 0.16)',
  },
  layout: { maxWidth: '560px', topBarHeight: '56px', bottomNavHeight: '64px', touchTarget: '44px' },
  motion: { fast: '120ms ease-out', normal: '200ms ease-out' },
};

export type AppTheme = typeof theme;
