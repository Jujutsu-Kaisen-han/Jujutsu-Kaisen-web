import type { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const Field = styled.label`
  display: grid;
  gap: 10px;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  min-height: 52px;
  padding: 0 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.12);
  }
`;

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const SearchField = ({ label, ...props }: SearchFieldProps) => (
  <Field>
    <Label>{label}</Label>
    <Input {...props} />
  </Field>
);
