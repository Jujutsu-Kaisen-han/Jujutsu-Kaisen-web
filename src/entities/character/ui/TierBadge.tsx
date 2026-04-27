import styled from 'styled-components';
import type { CharacterTier } from '@/entities/character/model/types/character';

const toneByTier: Record<CharacterTier, 'tierSS' | 'tierS' | 'tierA' | 'tierB' | 'tierC'> = {
  SS: 'tierSS',
  S: 'tierS',
  A: 'tierA',
  B: 'tierB',
  C: 'tierC',
};

const Badge = styled.span<{ $tier: CharacterTier }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${({ $tier, theme }) => `${theme.colors[toneByTier[$tier]]}22`};
  border: 1px solid ${({ $tier, theme }) => `${theme.colors[toneByTier[$tier]]}66`};
  color: ${({ $tier, theme }) => theme.colors[toneByTier[$tier]]};
  font-weight: 800;
  letter-spacing: 0.04em;
`;

interface TierBadgeProps {
  tier: CharacterTier;
}

export const TierBadge = ({ tier }: TierBadgeProps) => <Badge $tier={tier}>{tier}</Badge>;
