import styled from 'styled-components';

export const Container = styled.div`
  width: min(${({ theme }) => theme.layout.contentMaxWidth}, calc(100% - 32px));
  margin: 0 auto;
`;
