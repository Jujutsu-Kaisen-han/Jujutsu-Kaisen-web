import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  combatTypeLabels,
  officialCategoryLabels,
  roleLabels,
  traitLabels,
  type CharacterSummary,
} from '@/entities/character/model/types/character';
import { CharacterArtwork } from '@/entities/character/ui/CharacterArtwork';
import { TierBadge } from '@/entities/character/ui/TierBadge';
import { routes } from '@/shared/config/routes';

const Card = styled(Link)`
  display: grid;
  overflow: hidden;
  min-height: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const Poster = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(255, 122, 69, 0.2), transparent 44%),
    linear-gradient(180deg, rgba(8, 15, 29, 0.82) 0%, rgba(8, 15, 29, 1) 100%);

  &::after {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(8, 15, 29, 0.08) 0%, rgba(8, 15, 29, 0.7) 100%),
      linear-gradient(180deg, rgba(8, 15, 29, 0) 0%, rgba(8, 15, 29, 0.92) 100%);
    content: '';
    pointer-events: none;
  }
`;

const Backdrop = styled(CharacterArtwork)`
  position: absolute;
  inset: -8%;
  width: calc(100% + 16%);
  height: calc(100% + 16%);
  object-fit: cover;
  object-position: center top;
  filter: blur(22px);
  opacity: 0.28;
  transform: scale(1.08);
`;

const Frame = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 14px 12px;
`;

const Image = styled(CharacterArtwork)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  transition: transform 0.3s ease;

  &[data-source='fallback'] {
    object-position: center bottom;
  }

  &:not([data-source='fallback']) {
    max-width: calc(100% - 8px);
    max-height: calc(100% - 8px);
    object-position: center center;
  }

  ${Card}:hover & {
    transform: scale(1.03);
  }
`;

const Tier = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 1;
`;

const Body = styled.div`
  display: grid;
  gap: 14px;
  padding: 18px;
`;

const Header = styled.div`
  display: grid;
  gap: 6px;
`;

const Variant = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 22px;
`;

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 600;
`;

interface CharacterCardProps {
  character: CharacterSummary;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const hasVariant = character.variantName.trim().length > 0 && character.variantName !== '기본형';
  const subtitle = hasVariant ? `${character.variantName} · ${character.title}` : character.title;

  return (
    <Card to={routes.characterDetail(character.id)}>
      <Poster>
        <Backdrop
          src={character.variantImage}
          fallbackSrc={character.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <Frame>
          <Image
            src={character.variantImage}
            fallbackSrc={character.image}
            alt={character.name}
            loading="lazy"
          />
        </Frame>
        <Tier>
          <TierBadge tier={character.tier} />
        </Tier>
      </Poster>
      <Body>
        <Header>
          {hasVariant ? <Variant>{character.variantName}</Variant> : null}
          <Name>{character.name}</Name>
          <Title>{subtitle}</Title>
        </Header>
        <Meta>
          <Chip>{traitLabels[character.trait]}</Chip>
          <Chip>{combatTypeLabels[character.combatType]}</Chip>
          <Chip>{roleLabels[character.role]}</Chip>
          <Chip>{officialCategoryLabels[character.officialCategory]}</Chip>
          <Chip>{character.rarity}</Chip>
          <Chip>{character.releaseType}</Chip>
        </Meta>
      </Body>
    </Card>
  );
};
