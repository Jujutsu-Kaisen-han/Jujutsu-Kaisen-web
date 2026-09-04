import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: none;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(34px, 6vw, 68px);
  line-height: 0.95;
`;

const Description = styled.p`
  max-width: 760px;
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 17px;
`;

const Top = styled.div`
  display: grid;
  gap: 14px;
`;

const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

export const PageIntro = ({
  eyebrow,
  title,
  description,
  meta,
  actions,
}: PageIntroProps) => (
  <Root>
    <Top>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Top>
    {(meta || actions) ? (
      <Bottom>
        <div>{meta}</div>
        <div>{actions}</div>
      </Bottom>
    ) : null}
  </Root>
);
