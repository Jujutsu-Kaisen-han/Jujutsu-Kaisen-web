import { ThemeProvider } from 'styled-components';
import { BootstrapProvider } from '@/app/providers/bootstrap-provider';
import { AppRouterProvider } from '@/app/providers/router-provider';
import { GlobalStyle } from '@/app/styles/global-style';
import { theme } from '@/shared/styles/theme';

export const AppProviders = () => (
  <ThemeProvider theme={theme}>
    <BootstrapProvider>
      <GlobalStyle />
      <AppRouterProvider />
    </BootstrapProvider>
  </ThemeProvider>
);
