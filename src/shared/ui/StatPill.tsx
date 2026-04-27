import styled from 'styled-components';

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Value = styled.strong`
  font-size: 16px;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

interface StatPillProps {
  label: string;
  value: string;
}

export const StatPill = ({ label, value }: StatPillProps) => (
  <Pill>
    <Value>{value}</Value>
    <Label>{label}</Label>
  </Pill>
);
