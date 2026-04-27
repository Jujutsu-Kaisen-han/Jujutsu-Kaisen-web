import styled, { keyframes } from 'styled-components';
import { Panel } from '@/shared/ui/Panel';

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Body = styled.div`
  display: grid;
  justify-items: center;
  gap: 16px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid rgba(148, 163, 184, 0.2);
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
`;

const Label = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

interface LoadingStateProps {
  label: string;
}

export const LoadingState = ({ label }: LoadingStateProps) => (
  <Panel>
    <Body>
      <Spinner />
      <Label>{label}</Label>
    </Body>
  </Panel>
);
