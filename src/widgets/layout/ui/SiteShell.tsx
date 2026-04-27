import type { ReactNode } from 'react';
import styled from 'styled-components';
import { AppNavigation } from '@/features/navigation/ui/AppNavigation';
import { Container } from '@/shared/ui/Container';

const Root = styled.div`
  padding: 28px 0 72px;
`;

const Main = styled.main`
  display: grid;
  gap: 24px;
`;

interface SiteShellProps {
  children: ReactNode;
}

export const SiteShell = ({ children }: SiteShellProps) => (
  <Root>
    <Container>
      <AppNavigation />
      <Main>{children}</Main>
    </Container>
  </Root>
);
