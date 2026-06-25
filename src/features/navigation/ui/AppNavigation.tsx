import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { routes } from '@/shared/config/routes';

const Nav = styled.nav`
  display: flex;
  position: sticky;
  top: 20px;
  z-index: 10;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  padding: 18px 22px;
  border-radius: 28px;
  background: rgba(8, 15, 29, 0.75);
  backdrop-filter: blur(22px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BrandBlock = styled.div`
  display: grid;
  gap: 4px;
`;

const Brand = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
`;

const BrandTitle = styled.strong`
  font-size: 20px;
  font-weight: 800;
`;

const BrandDescription = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

const Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const MenuLink = styled(NavLink)`
  padding: 11px 15px;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.muted};
  transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;

  &.active {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.text};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-1px);
  }
`;

export const AppNavigation = () => (
  <Nav>
    <BrandBlock>
      <Brand>Jujutsu Kaisen</Brand>
      <BrandTitle>팬텀 퍼레이드 티어 보드</BrandTitle>
      <BrandDescription>캐릭터 검색, 티어 비교, 역할별 분석을 한 화면에서.</BrandDescription>
    </BrandBlock>
    <Menu>
      <MenuLink to={routes.home} end>
        티어표
      </MenuLink>
      <MenuLink to={routes.characters}>캐릭터 도감</MenuLink>
    </Menu>
  </Nav>
);
