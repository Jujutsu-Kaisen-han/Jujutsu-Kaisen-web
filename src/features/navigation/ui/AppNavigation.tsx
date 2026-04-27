import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { routes } from '@/shared/config/routes';

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
  padding: 16px 20px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.14);
`;

const Brand = styled.span`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const Menu = styled.div`
  display: flex;
  gap: 12px;
`;

const MenuLink = styled(NavLink)`
  padding: 10px 14px;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.muted};
  transition: 0.2s ease;

  &.active {
    background: rgba(248, 113, 113, 0.16);
    color: ${({ theme }) => theme.colors.text};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const AppNavigation = () => (
  <Nav>
    <Brand>jujustukaisen</Brand>
    <Menu>
      <MenuLink to={routes.home}>Home</MenuLink>
    </Menu>
  </Nav>
);
