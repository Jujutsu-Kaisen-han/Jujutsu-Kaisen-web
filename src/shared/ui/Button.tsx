import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
}

const buttonStyles = css<{ $variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 12px 18px;
  border: 0;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;

  ${({ $variant, theme }) => $variant === 'primary'
    ? css`
        background: linear-gradient(135deg, ${theme.colors.primary}, #f97316);
        color: #140b07;
        box-shadow: ${theme.shadows.glow};
      `
    : css`
        background: rgba(15, 23, 42, 0.82);
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
      `}

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  ${buttonStyles}
`;

const StyledButtonLink = styled(Link)<{ $variant: ButtonVariant }>`
  ${buttonStyles}
`;

export const Button = ({
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) => <StyledButton $variant={variant} type={type} {...props} />;

export const ButtonLink = ({
  variant = 'primary',
  ...props
}: ButtonLinkProps) => <StyledButtonLink $variant={variant} {...props} />;
