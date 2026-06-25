import styled from 'styled-components';
import { routes } from '@/shared/config/routes';
import { ButtonLink } from '@/shared/ui/Button';
import { PageIntro } from '@/shared/ui/PageIntro';
import { Panel } from '@/shared/ui/Panel';
import { SiteShell } from '@/widgets/layout/ui/SiteShell';

const Box = styled(Panel)`
  text-align: center;
`;

const Code = styled.p`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: clamp(32px, 6vw, 54px);
`;

const Description = styled.p`
  margin: 0 0 20px;
  color: ${({ theme }) => theme.colors.muted};
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
`;

export const NotFoundPage = () => (
  <SiteShell>
    <PageIntro
      eyebrow="404"
      title="없는 페이지에 도착했어요."
      description="경로가 잘못되었거나, 아직 연결하지 않은 화면입니다."
    />
    <Box>
      <Code>404 error</Code>
      <Title>찾는 페이지가 없어요.</Title>
      <Description>티어표나 캐릭터 목록으로 돌아가서 다른 정보를 확인해보세요.</Description>
      <ActionRow>
        <ButtonLink to={routes.home}>홈으로 돌아가기</ButtonLink>
      </ActionRow>
    </Box>
  </SiteShell>
);
