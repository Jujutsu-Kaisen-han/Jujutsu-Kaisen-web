export const theme = {
  colors: {
    background: '#0f131a',
    backgroundElevated: '#151b24',
    surface: '#171d27',
    surfaceStrong: '#1c232d',
    surfaceSoft: '#222b36',
    border: 'rgba(148, 163, 184, 0.18)',
    borderStrong: 'rgba(255, 122, 69, 0.4)',
    primary: '#ff7a45',
    primarySoft: 'rgba(255, 122, 69, 0.16)',
    secondary: '#67e8f9',
    text: '#f8fafc',
    muted: '#94a3b8',
    input: '#0f172a',
    danger: '#f87171',
    success: '#34d399',
    tierSS: '#fbbf24',
    tierS: '#fb7185',
    tierA: '#818cf8',
    tierB: '#38bdf8',
    tierC: '#94a3b8',
  },
  shadows: {
    card: '0 6px 18px rgba(0, 0, 0, 0.16)',
    glow: '0 8px 22px rgba(0, 0, 0, 0.2)',
  },
  radius: {
    lg: '32px',
    md: '24px',
    sm: '16px',
  },
  breakpoints: {
    tablet: '900px',
    mobile: '640px',
  },
  typography: {
    body: '"Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", sans-serif',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '28px',
  },
  layout: {
    contentMaxWidth: '1200px',
  },
} as const;

export type AppTheme = typeof theme;
