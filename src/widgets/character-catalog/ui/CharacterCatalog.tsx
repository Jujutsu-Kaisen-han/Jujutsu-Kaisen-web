import styled from 'styled-components';
import type {
  CatalogSortOption,
  CharacterFilters,
  CharacterRole,
  CharacterTrait,
  CharacterSummary,
  OfficialCategory,
} from '@/entities/character/model/types/character';
import { groupCharactersByTrait } from '@/entities/character/lib/character-selectors';
import { traitLabels, traitOrder } from '@/entities/character/model/types/character';
import { CharacterCard } from '@/entities/character/ui/CharacterCard';
import { CatalogControls } from '@/features/catalog-controls/ui/CatalogControls';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Panel } from '@/shared/ui/Panel';
import { StatPill } from '@/shared/ui/StatPill';

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ResultBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SectionNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionLink = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  background: rgba(15, 23, 42, 0.6);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const TraitSections = styled.div`
  display: grid;
  gap: 18px;
`;

const TraitSection = styled(Panel)`
  display: grid;
  gap: 18px;
  scroll-margin-top: 24px;
`;

const TraitHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
`;

const TraitTitleGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const TraitEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const TraitTitle = styled.h2`
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
`;

const TraitDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

interface CharacterCatalogProps {
  characters: CharacterSummary[];
  totalCount: number;
  favoriteCharacterIds: string[];
  filters: CharacterFilters;
  detailLinkSearch?: string;
  onSearchQueryChange: (value: string) => void;
  onTraitFilterChange: (value: CharacterTrait | 'all') => void;
  onOfficialCategoryFilterChange: (value: OfficialCategory | 'all') => void;
  onRoleFilterChange: (value: CharacterRole | 'all') => void;
  onSortByChange: (value: CatalogSortOption) => void;
  onFavoritesOnlyChange: (value: boolean) => void;
  onResetFilters: () => void;
}

export const CharacterCatalog = ({
  characters,
  totalCount,
  favoriteCharacterIds,
  filters,
  detailLinkSearch,
  onSearchQueryChange,
  onTraitFilterChange,
  onOfficialCategoryFilterChange,
  onRoleFilterChange,
  onSortByChange,
  onFavoritesOnlyChange,
  onResetFilters,
}: CharacterCatalogProps) => {
  const traitSections = groupCharactersByTrait(characters, traitOrder);
  const favoriteCharacterIdSet = new Set(favoriteCharacterIds);
  const favoriteCount = favoriteCharacterIds.length;
  const emptyDescription = filters.favoritesOnly && favoriteCount === 0
    ? '캐릭터 상세 페이지에서 즐겨찾기를 추가하면 이곳에서 모아볼 수 있습니다.'
    : '검색어를 바꾸거나 필터를 초기화해서 다른 조합을 확인해보세요.';

  return (
    <Layout>
      <CatalogControls
        filters={filters}
        onSearchQueryChange={onSearchQueryChange}
        onTraitFilterChange={onTraitFilterChange}
        onOfficialCategoryFilterChange={onOfficialCategoryFilterChange}
        onRoleFilterChange={onRoleFilterChange}
        onSortByChange={onSortByChange}
        onFavoritesOnlyChange={onFavoritesOnlyChange}
        onReset={onResetFilters}
      />
      <ResultBar>
        <StatPill label="검색 결과" value={`${characters.length}명`} />
        <StatPill label="전체 캐릭터" value={`${totalCount}명`} />
        <StatPill label="즐겨찾기" value={`${favoriteCount}명`} />
      </ResultBar>
      {characters.length === 0 ? (
        <EmptyState
          title="조건에 맞는 캐릭터가 없어요."
          description={emptyDescription}
        />
      ) : (
        <>
          <SectionNav aria-label="특성별 바로가기">
            {traitSections.map((section) => (
              <SectionLink key={section.trait} href={`#trait-${section.trait}`}>
                {traitLabels[section.trait]} · {section.characters.length}명
              </SectionLink>
            ))}
          </SectionNav>

          <TraitSections>
            {traitSections.map((section) => (
              <TraitSection key={section.trait} id={`trait-${section.trait}`}>
                <TraitHeader>
                  <TraitTitleGroup>
                    <TraitEyebrow>특성 아카이브</TraitEyebrow>
                    <TraitTitle>{traitLabels[section.trait]} 특성</TraitTitle>
                    <TraitDescription>
                      현재 조건에 맞는 {traitLabels[section.trait]} 특성 캐릭터를 따로 모아봤습니다.
                    </TraitDescription>
                  </TraitTitleGroup>
                  <StatPill label="캐릭터 수" value={`${section.characters.length}명`} />
                </TraitHeader>

                <Grid>
                  {section.characters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      detailLinkSearch={detailLinkSearch}
                      isFavorite={favoriteCharacterIdSet.has(character.id)}
                    />
                  ))}
                </Grid>
              </TraitSection>
            ))}
          </TraitSections>
        </>
      )}
    </Layout>
  );
};
