import type { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

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

const Select = styled.select`
  width: 100%;
  min-height: 52px;
  padding: 0 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.12);
  }
`;

export const SelectField = ({
  label,
  options,
  ...props
}: SelectFieldProps) => (
  <Field>
    <Label>{label}</Label>
    <Select {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </Field>
);
