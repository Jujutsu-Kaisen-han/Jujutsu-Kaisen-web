import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterAndSortCatalogCharacters } from '@/entities/character/lib/character-selectors';
import {
  defaultCharacterFilters,
  useCharacterStore,
} from '@/entities/character/model/store/character-store';
import type {
  CatalogSortOption,
  CharacterFilters,
  CharacterRole,
  CharacterTrait,
  OfficialCategory,
} from '@/entities/character/model/types/character';
import {
  areCatalogFiltersEqual,
  createCatalogSearchParams,
  getCatalogFiltersFromSearchParams,
} from '@/pages/character-list/lib/catalog-url-state';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageIntro } from '@/shared/ui/PageIntro';
import { SiteShell } from '@/widgets/layout/ui/SiteShell';
import { CharacterCatalog } from '@/widgets/character-catalog/ui/CharacterCatalog';

export const CharacterListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const characters = useCharacterStore((state) => state.characters);
  const favoriteCharacterIds = useCharacterStore((state) => state.favoriteCharacterIds);
  const storeFilters = useCharacterStore((state) => state.filters);
  const catalogStatus = useCharacterStore((state) => state.catalogStatus);
  const catalogError = useCharacterStore((state) => state.catalogError);
  const loadCatalog = useCharacterStore((state) => state.loadCatalog);
  const setFilters = useCharacterStore((state) => state.setFilters);

  const catalogFilters = useMemo(
    () => getCatalogFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  const detailLinkSearch = useMemo(
    () => createCatalogSearchParams(catalogFilters).toString(),
    [catalogFilters],
  );
  const filteredCharacters = filterAndSortCatalogCharacters(
    characters,
    catalogFilters,
    favoriteCharacterIds,
  );

  useEffect(() => {
    if (!areCatalogFiltersEqual(storeFilters, catalogFilters)) {
      setFilters(catalogFilters);
    }
  }, [catalogFilters, setFilters, storeFilters]);

  const updateCatalogFilters = (nextFilters: CharacterFilters) => {
    setSearchParams(createCatalogSearchParams(nextFilters), { replace: true });
  };

  return (
    <SiteShell>
      <PageIntro
        eyebrow="캐릭터 도감"
        title="캐릭터 목록과 필터링"
        description="이름 검색, 팬파레 특성, 공식 사이트 분류, 역할 필터를 조합하고 결과를 환·영·야·행 섹션으로 나눠서 원하는 변형 유닛을 빠르게 찾을 수 있습니다."
      />

      {catalogStatus === 'loading' && characters.length === 0 ? (
        <LoadingState label="캐릭터 목록을 정리하는 중입니다." />
      ) : null}

      {catalogStatus === 'error' ? (
        <ErrorState
          title={characters.length > 0 ? '최신 캐릭터 목록을 갱신하지 못했어요.' : '캐릭터 목록을 불러오지 못했어요.'}
          description={catalogError ?? '잠시 후 다시 시도해주세요.'}
          actionLabel="다시 시도"
          onAction={() => {
            void loadCatalog(true);
          }}
        />
      ) : null}

      {characters.length > 0 ? (
        <CharacterCatalog
          characters={filteredCharacters}
          totalCount={characters.length}
          favoriteCharacterIds={favoriteCharacterIds}
          filters={catalogFilters}
          detailLinkSearch={detailLinkSearch}
          onSearchQueryChange={(searchQuery) => {
            updateCatalogFilters({ ...catalogFilters, searchQuery });
          }}
          onTraitFilterChange={(trait: CharacterTrait | 'all') => {
            updateCatalogFilters({ ...catalogFilters, trait });
          }}
          onOfficialCategoryFilterChange={(officialCategory: OfficialCategory | 'all') => {
            updateCatalogFilters({ ...catalogFilters, officialCategory });
          }}
          onRoleFilterChange={(role: CharacterRole | 'all') => {
            updateCatalogFilters({ ...catalogFilters, role });
          }}
          onSortByChange={(sortBy: CatalogSortOption) => {
            updateCatalogFilters({ ...catalogFilters, sortBy });
          }}
          onFavoritesOnlyChange={(favoritesOnly) => {
            updateCatalogFilters({ ...catalogFilters, favoritesOnly });
          }}
          onResetFilters={() => {
            updateCatalogFilters(defaultCharacterFilters);
          }}
        />
      ) : null}
    </SiteShell>
  );
};
