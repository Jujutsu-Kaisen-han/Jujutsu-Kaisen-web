import { ThemeProvider } from 'styled-components';
import { AppRouterProvider } from '@/app/providers/router-provider';
import { theme } from '@/shared/styles/theme';

export const AppProviders = () => (
  <ThemeProvider theme={theme}>
    <AppRouterProvider />
  </ThemeProvider>
);
