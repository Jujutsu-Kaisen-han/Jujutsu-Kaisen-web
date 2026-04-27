import type { ReactNode } from 'react';
import styled from 'styled-components';
import { AppNavigation } from '@/features/navigation/ui/AppNavigation';
import { Container } from '@/shared/ui/Container';

const Root = styled.div`
  padding: 40px 0 72px;
`;

const Header = styled.header`
  margin-bottom: 28px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(24px, 4vw, 36px);
`;

const Description = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Main = styled.main`
  display: grid;
  gap: 24px;
`;

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const PageShell = ({
  title,
  description,
  children,
}: PageShellProps) => (
  <Root>
    <Container>
      <AppNavigation />
      <Header>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Header>
      <Main>{children}</Main>
    </Container>
  </Root>
);
