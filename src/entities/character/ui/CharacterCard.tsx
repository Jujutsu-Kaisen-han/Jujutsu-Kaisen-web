import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  type CharacterSummary,
} from '@/entities/character/model/types/character';
import { CharacterArtwork } from '@/entities/character/ui/CharacterArtwork';
import { routes } from '@/shared/config/routes';

const Card = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  min-height: 88px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

const Poster = styled.div`
  position: relative;
  flex: 0 0 72px;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(8, 15, 29, 0.8);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-basis: 60px;
    width: 60px;
    height: 60px;
  }
`;

const Frame = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 7px 6px;
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

const FavoriteMark = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
`;

const Body = styled.div`
  display: grid;
  min-width: 0;
  gap: 4px;
  padding: 4px 6px 4px 0;
`;

const Name = styled.h3`
  margin: 0;
  overflow: hidden;
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface CharacterCardProps {
  character: CharacterSummary;
  detailLinkSearch?: string;
  isFavorite?: boolean;
}

export const CharacterCard = ({
  character,
  detailLinkSearch,
  isFavorite = false,
}: CharacterCardProps) => {
  const hasVariant = character.variantName.trim().length > 0 && character.variantName !== '기본형';
  const accessibleLabel = hasVariant
    ? `${character.name} ${character.variantName} ${character.title}`
    : `${character.name} ${character.title}`;
  const detailPath = routes.characterDetail(character.id);
  const detailTo = detailLinkSearch
    ? { pathname: detailPath, search: `?${detailLinkSearch}` }
    : detailPath;

  return (
    <Card
      to={detailTo}
      title={`${character.name} 상세 보기`}
      aria-label={`${accessibleLabel} 상세 보기${isFavorite ? ', 즐겨찾기됨' : ''}`}
    >
      <Poster>
        <Frame>
          <Image
            src={character.variantImage}
            fallbackSrc={character.image}
            alt={character.name}
            loading="lazy"
          />
        </Frame>
        {isFavorite ? <FavoriteMark aria-hidden="true">★</FavoriteMark> : null}
      </Poster>
      <Body>
        <Name>{character.name}</Name>
      </Body>
    </Card>
  );
};
