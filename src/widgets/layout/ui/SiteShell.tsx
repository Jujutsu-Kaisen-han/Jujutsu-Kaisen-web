import { useEffect, useRef, type ReactNode } from 'react';
import styled from 'styled-components';
import { ScrollRestoration, useLocation } from 'react-router-dom';
import { Container } from '@/shared/ui/Container';
import { RouteMetadata } from '@/widgets/layout/ui/RouteMetadata';

const Root = styled.div`
  padding: 28px 0 72px;
`;

const SkipLink = styled.a`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
  transform: translateY(-160%);
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};
  font-weight: 800;
  transition: transform 0.2s ease;

  &:focus {
    transform: translateY(0);
  }
`;

const Main = styled.main`
  display: grid;
  gap: 24px;
  outline: 0;

  &:focus-visible {
    outline: 3px solid rgba(103, 232, 249, 0.72);
    outline-offset: 8px;
  }
`;

interface SiteShellProps {
  children: ReactNode;
}

export const SiteShell = ({ children }: SiteShellProps) => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) {
      return;
    }

    previousPathnameRef.current = location.pathname;
    const animationFrameId = window.requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [location.pathname]);

  return (
    <Root>
      <RouteMetadata />
      <ScrollRestoration getKey={(routerLocation) => routerLocation.pathname} />
      <SkipLink href="#main-content">본문으로 건너뛰기</SkipLink>
      <Container>
        <Main id="main-content" ref={mainRef} tabIndex={-1}>
          {children}
        </Main>
      </Container>
    </Root>
  );
};
