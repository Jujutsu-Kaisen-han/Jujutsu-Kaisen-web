import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { elementLabels, roleLabels, type CharacterSummary } from '@/entities/character/model/types/character';
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
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(4, 6, 18, 0) 40%, rgba(4, 6, 18, 0.86) 100%),
    linear-gradient(135deg, rgba(103, 232, 249, 0.1), rgba(255, 122, 69, 0.16));
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const Tier = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
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

export const CharacterCard = ({ character }: CharacterCardProps) => (
  <Card to={routes.characterDetail(character.id)}>
    <Poster>
      <Image src={character.image} alt={character.name} loading="lazy" />
      <Tier>
        <TierBadge tier={character.tier} />
      </Tier>
    </Poster>
    <Body>
      <Header>
        <Name>{character.name}</Name>
        <Title>{character.title}</Title>
      </Header>
      <Meta>
        <Chip>{elementLabels[character.element]}</Chip>
        <Chip>{roleLabels[character.role]}</Chip>
        <Chip>{character.releaseType}</Chip>
      </Meta>
    </Body>
  </Card>
);
