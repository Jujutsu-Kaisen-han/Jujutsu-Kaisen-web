import { AppProviders } from '@/app/providers/app-providers';
import { GlobalStyle } from '@/app/styles/global-style';

export const App = () => (
  <>
    <GlobalStyle />
    <AppProviders />
  </>
);
