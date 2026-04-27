import styled from 'styled-components';
import { stackItems } from '@/entities/tech-stack/model/stack';
import { PageShell } from '@/widgets/layout/ui/PageShell';

const Intro = styled.section`
  display: grid;
  gap: 24px;
`;

const HeroCard = styled.div`
  padding: 32px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.64));
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Label = styled.span`
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(248, 113, 113, 0.14);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 16px 0 12px;
  font-size: clamp(40px, 7vw, 72px);
  line-height: 0.95;
`;

const Description = styled.p`
  max-width: 720px;
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 18px;
`;

const StackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`;

const StackCard = styled.article`
  padding: 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(148, 163, 184, 0.14);
`;

const StackName = styled.h2`
  margin: 0 0 8px;
  font-size: 18px;
`;

const StackDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

export const HomePage = () => (
  <PageShell
    title="FSD React Starter"
    description="React, styled-components, React Router가 연결된 기본 스타터예요."
  >
    <Intro>
      <HeroCard>
        <Label>Jujutsu Kaisen</Label>
        <Title>Feature-Sliced Design로 시작하는 React 구조</Title>
        <Description>
          `app`, `pages`, `widgets`, `features`, `entities`, `shared` 레이어를 기준으로
          확장하기 쉽게 정리했고, 라우터와 전역 스타일도 바로 붙여놨어요.
        </Description>
      </HeroCard>

      <StackGrid>
        {stackItems.map((item) => (
          <StackCard key={item.name}>
            <StackName>{item.name}</StackName>
            <StackDescription>{item.description}</StackDescription>
          </StackCard>
        ))}
      </StackGrid>
    </Intro>
  </PageShell>
);
