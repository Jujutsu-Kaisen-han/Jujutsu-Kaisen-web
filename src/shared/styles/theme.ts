export const theme = {
  colors: {
    background: '#040612',
    backgroundElevated: '#08101f',
    surface: 'rgba(15, 23, 42, 0.82)',
    surfaceStrong: 'rgba(11, 18, 32, 0.96)',
    surfaceSoft: 'rgba(30, 41, 59, 0.52)',
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
    card: '0 30px 80px rgba(15, 23, 42, 0.45)',
    glow: '0 24px 60px rgba(255, 122, 69, 0.18)',
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
} as const;

export type AppTheme = typeof theme;
