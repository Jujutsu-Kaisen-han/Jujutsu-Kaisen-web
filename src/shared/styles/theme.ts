export const theme = {
  colors: {
    background: '#050816',
    surface: 'rgba(15, 23, 42, 0.78)',
    primary: '#f87171',
    text: '#f8fafc',
    muted: '#94a3b8',
  },
  shadows: {
    card: '0 30px 80px rgba(15, 23, 42, 0.45)',
  },
} as const;

export type AppTheme = typeof theme;
