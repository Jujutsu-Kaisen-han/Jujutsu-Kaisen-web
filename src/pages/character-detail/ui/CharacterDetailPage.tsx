import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  filterAndSortCatalogCharacters,
  getCharacterNeighbors,
} from '@/entities/character/lib/character-selectors';
import {
  defaultCharacterFilters,
  useCharacterStore,
} from '@/entities/character/model/store/character-store';
import {
  areCatalogFiltersEqual,
  createCatalogSearchParams,
  getCatalogFiltersFromSearchParams,
} from '@/pages/character-list/lib/catalog-url-state';
import { ButtonLink } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageIntro } from '@/shared/ui/PageIntro';
import { routes } from '@/shared/config/routes';
import { SiteShell } from '@/widgets/layout/ui/SiteShell';
import { CharacterDetailNavigator } from '@/widgets/character-detail/ui/CharacterDetailNavigator';
import { CharacterProfile } from '@/widgets/character-detail/ui/CharacterProfile';

const BackNavigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const CharacterDetailPage = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const characters = useCharacterStore((state) => state.characters);
  const favoriteCharacterIds = useCharacterStore((state) => state.favoriteCharacterIds);
  const characterDetails = useCharacterStore((state) => state.characterDetails);
  const detailStatusById = useCharacterStore((state) => state.detailStatusById);
  const detailErrorById = useCharacterStore((state) => state.detailErrorById);
  const loadCharacterById = useCharacterStore((state) => state.loadCharacterById);
  const toggleFavoriteCharacter = useCharacterStore((state) => state.toggleFavoriteCharacter);
  const catalogFilters = useMemo(
    () => getCatalogFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  const catalogSearch = useMemo(
    () => createCatalogSearchParams(catalogFilters).toString(),
    [catalogFilters],
  );

  useEffect(() => {
    if (!characterId) {
      return;
    }

    void loadCharacterById(characterId);
  }, [characterId, loadCharacterById]);

  if (!characterId) {
    return null;
  }

  const character = characterDetails[characterId];
  const summary = characters.find((item) => item.id === characterId);
  const detailStatus = detailStatusById[characterId] ?? 'idle';
  const detailError = detailErrorById[characterId] ?? null;
  const isFavorite = favoriteCharacterIds.includes(characterId);
  const hasCatalogContext = !areCatalogFiltersEqual(catalogFilters, defaultCharacterFilters);
  const neighborCharacters = filterAndSortCatalogCharacters(
    characters,
    catalogFilters,
    favoriteCharacterIds,
  );
  const neighbors = getCharacterNeighbors(neighborCharacters, characterId);
  const canNavigateBetweenDetails = neighbors.currentIndex >= 0 && neighbors.totalCount > 1;
  const characterListTo = hasCatalogContext
    ? { pathname: routes.characters, search: `?${catalogSearch}` }
    : routes.characters;

  return (
    <SiteShell>
      <BackNavigation aria-label="상세 페이지 이동">
        <ButtonLink to={routes.home} variant="ghost">
          전투력 티어표로
        </ButtonLink>
        <ButtonLink to={characterListTo} variant="ghost">
          캐릭터 목록으로
        </ButtonLink>
      </BackNavigation>

      {character ? (
        <>
          <CharacterProfile
            character={character}
            isFavorite={isFavorite}
            onToggleFavorite={() => toggleFavoriteCharacter(character.id)}
          />
          {canNavigateBetweenDetails ? (
            <CharacterDetailNavigator
              previousCharacter={neighbors.previousCharacter}
              nextCharacter={neighbors.nextCharacter}
              currentIndex={neighbors.currentIndex}
              totalCount={neighbors.totalCount}
              detailLinkSearch={hasCatalogContext ? catalogSearch : undefined}
            />
          ) : null}
        </>
      ) : null}

      {!character && (detailStatus === 'idle' || detailStatus === 'loading') ? (
        <div aria-busy="true">
          <PageIntro
            eyebrow="캐릭터 상세"
            title={summary?.name ?? '캐릭터 정보'}
            description="상세 정보를 불러오고 있습니다."
          />
          <LoadingState label="스킬과 티어 정보를 불러오는 중입니다." />
        </div>
      ) : null}

      {!character && detailStatus === 'error' ? (
        <ErrorState
          title="상세 정보를 불러오지 못했어요."
          description={detailError ?? '잠시 후 다시 시도해주세요.'}
          actionLabel="다시 시도"
          onAction={() => {
            void loadCharacterById(characterId, true);
          }}
        />
      ) : null}

      {!character && detailStatus === 'not-found' ? (
        <ErrorState
          title="캐릭터를 찾을 수 없어요."
          description="목록으로 돌아가 다른 캐릭터를 선택해보세요."
          actionLabel="목록으로 이동"
          onAction={() => {
            navigate(characterListTo);
          }}
        />
      ) : null}
    </SiteShell>
  );
};
