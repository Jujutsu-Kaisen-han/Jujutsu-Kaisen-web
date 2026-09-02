import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  traitLabels,
  type CharacterSummary,
} from '@/entities/character/model/types/character';
import { CharacterArtwork } from '@/entities/character/ui/CharacterArtwork';
import { TierBadge } from '@/entities/character/ui/TierBadge';
import { routes } from '@/shared/config/routes';
import { Panel } from '@/shared/ui/Panel';

const Navigator = styled(Panel).attrs({ as: 'nav' })`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
`;

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  font-weight: 700;
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavCard = styled(Link)`
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  min-height: 112px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 15, 29, 0.72);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: rgba(15, 23, 42, 0.92);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

const ImageFrame = styled.div`
  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
  width: 82px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top, rgba(255, 122, 69, 0.16), transparent 42%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(8, 15, 29, 0.98));
`;

const Image = styled(CharacterArtwork)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  padding: 4px;
`;

const Copy = styled.div`
  display: grid;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Direction = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Name = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  overflow-wrap: anywhere;
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  overflow-wrap: anywhere;
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Trait = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  background: rgba(15, 23, 42, 0.72);
  font-size: 12px;
  font-weight: 700;
`;

interface CharacterDetailNavigatorProps {
  previousCharacter?: CharacterSummary;
  nextCharacter?: CharacterSummary;
  currentIndex: number;
  totalCount: number;
  detailLinkSearch?: string;
}

interface CharacterNavLinkProps {
  direction: string;
  character: CharacterSummary;
  detailLinkSearch?: string;
}

const CharacterNavLink = ({ direction, character, detailLinkSearch }: CharacterNavLinkProps) => {
  const detailPath = routes.characterDetail(character.id);
  const detailTo = detailLinkSearch
    ? { pathname: detailPath, search: `?${detailLinkSearch}` }
    : detailPath;
  const hasVariant = character.variantName.trim().length > 0 && character.variantName !== '기본형';
  const meta = hasVariant ? `${character.variantName} · ${character.title}` : character.title;

  return (
    <NavCard to={detailTo} aria-label={`${direction}: ${character.name}`}>
      <ImageFrame>
        <Image
          src={character.variantImage}
          fallbackSrc={character.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </ImageFrame>
      <Copy>
        <Direction>{direction}</Direction>
        <Name>{character.name}</Name>
        <Meta>{meta}</Meta>
        <Badges>
          <TierBadge tier={character.tier} />
          <Trait>{traitLabels[character.trait]}</Trait>
        </Badges>
      </Copy>
    </NavCard>
  );
};

export const CharacterDetailNavigator = ({
  previousCharacter,
  nextCharacter,
  currentIndex,
  totalCount,
  detailLinkSearch,
}: CharacterDetailNavigatorProps) => (
  <Navigator aria-label="캐릭터 상세 페이지 이동">
    <Header>
      <TitleGroup>
        <Eyebrow>캐릭터 이어보기</Eyebrow>
        <Title>다른 캐릭터로 이어보기</Title>
      </TitleGroup>
      <Count>{currentIndex + 1} / {totalCount}</Count>
    </Header>
    <LinkGrid>
      {previousCharacter ? (
        <CharacterNavLink
          direction="이전 캐릭터"
          character={previousCharacter}
          detailLinkSearch={detailLinkSearch}
        />
      ) : null}
      {nextCharacter ? (
        <CharacterNavLink
          direction="다음 캐릭터"
          character={nextCharacter}
          detailLinkSearch={detailLinkSearch}
        />
      ) : null}
    </LinkGrid>
  </Navigator>
);
