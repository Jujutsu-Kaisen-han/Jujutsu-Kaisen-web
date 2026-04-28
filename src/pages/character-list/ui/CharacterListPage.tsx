import { filterAndSortCharacters } from '@/entities/character/lib/character-selectors';
import { useCharacterStore } from '@/entities/character/model/store/character-store';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageIntro } from '@/shared/ui/PageIntro';
import { SiteShell } from '@/widgets/layout/ui/SiteShell';
import { CharacterCatalog } from '@/widgets/character-catalog/ui/CharacterCatalog';

export const CharacterListPage = () => {
  const characters = useCharacterStore((state) => state.characters);
  const filters = useCharacterStore((state) => state.filters);
  const catalogStatus = useCharacterStore((state) => state.catalogStatus);
  const catalogError = useCharacterStore((state) => state.catalogError);
  const loadCatalog = useCharacterStore((state) => state.loadCatalog);
  const setSearchQuery = useCharacterStore((state) => state.setSearchQuery);
  const setTraitFilter = useCharacterStore((state) => state.setTraitFilter);
  const setOfficialCategoryFilter = useCharacterStore((state) => state.setOfficialCategoryFilter);
  const setRoleFilter = useCharacterStore((state) => state.setRoleFilter);
  const setSortBy = useCharacterStore((state) => state.setSortBy);
  const resetFilters = useCharacterStore((state) => state.resetFilters);

  const filteredCharacters = filterAndSortCharacters(characters, filters);

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Character Dex"
        title="캐릭터 목록과 필터링"
        description="이름 검색, 팬파레 특성, 공식 사이트 분류, 역할 필터를 조합하고 결과를 환·영·야·행 섹션으로 나눠서 원하는 변형 유닛을 빠르게 찾을 수 있습니다."
      />

      {catalogStatus === 'loading' && characters.length === 0 ? (
        <LoadingState label="캐릭터 목록을 정리하는 중입니다." />
      ) : null}

      {catalogStatus === 'error' && characters.length === 0 ? (
        <ErrorState
          title="캐릭터 목록을 불러오지 못했어요."
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
          filters={filters}
          onSearchQueryChange={setSearchQuery}
          onTraitFilterChange={setTraitFilter}
          onOfficialCategoryFilterChange={setOfficialCategoryFilter}
          onRoleFilterChange={setRoleFilter}
          onSortByChange={setSortBy}
          onResetFilters={resetFilters}
        />
      ) : null}
    </SiteShell>
  );
};
