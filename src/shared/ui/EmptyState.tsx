import styled from 'styled-components';
import { Panel } from '@/shared/ui/Panel';

const Title = styled.h3`
  margin: 0 0 10px;
  font-size: 24px;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <Panel>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </Panel>
);
