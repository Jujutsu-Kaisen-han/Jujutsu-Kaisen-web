import styled from 'styled-components';
import { Button } from '@/shared/ui/Button';
import { Panel } from '@/shared/ui/Panel';

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 26px;
`;

const Description = styled.p`
  margin: 0 0 22px;
  color: ${({ theme }) => theme.colors.muted};
`;

interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorState = ({
  title,
  description,
  actionLabel,
  onAction,
}: ErrorStateProps) => (
  <Panel>
    <Title>{title}</Title>
    <Description>{description}</Description>
    {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
  </Panel>
);
