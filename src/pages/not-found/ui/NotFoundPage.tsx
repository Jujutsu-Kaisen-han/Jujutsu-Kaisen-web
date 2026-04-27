import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { routes } from '@/shared/config/routes';
import { PageShell } from '@/widgets/layout/ui/PageShell';

const Box = styled.div`
  padding: 32px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(148, 163, 184, 0.14);
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

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: #111827;
  font-weight: 700;
`;

export const NotFoundPage = () => (
  <PageShell title="Not Found" description="없는 경로로 접근했을 때 보여줄 기본 페이지예요.">
    <Box>
      <Code>404 error</Code>
      <Title>찾는 페이지가 없어요.</Title>
      <Description>라우터 연결은 끝났고, 이제 필요한 페이지들을 여기에 계속 추가하면 됩니다.</Description>
      <HomeLink to={routes.home}>홈으로 돌아가기</HomeLink>
    </Box>
  </PageShell>
);
