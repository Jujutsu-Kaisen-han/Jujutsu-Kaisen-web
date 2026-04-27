import styled from 'styled-components';
import type {
  CatalogSortOption,
  CharacterElement,
  CharacterFilters,
  CharacterRole,
  CharacterSummary,
} from '@/entities/character/model/types/character';
import { CharacterCard } from '@/entities/character/ui/CharacterCard';
import { CatalogControls } from '@/features/catalog-controls/ui/CatalogControls';
import { EmptyState } from '@/shared/ui/EmptyState';
import { StatPill } from '@/shared/ui/StatPill';

const Layout = styled.div`
  display: grid;
  gap: 20px;
`;

const ResultBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
`;

interface CharacterCatalogProps {
  characters: CharacterSummary[];
  totalCount: number;
  filters: CharacterFilters;
  onSearchQueryChange: (value: string) => void;
  onElementFilterChange: (value: CharacterElement | 'all') => void;
  onRoleFilterChange: (value: CharacterRole | 'all') => void;
  onSortByChange: (value: CatalogSortOption) => void;
  onResetFilters: () => void;
}

export const CharacterCatalog = ({
  characters,
  totalCount,
  filters,
  onSearchQueryChange,
  onElementFilterChange,
  onRoleFilterChange,
  onSortByChange,
  onResetFilters,
}: CharacterCatalogProps) => (
  <Layout>
    <CatalogControls
      filters={filters}
      onSearchQueryChange={onSearchQueryChange}
      onElementFilterChange={onElementFilterChange}
      onRoleFilterChange={onRoleFilterChange}
      onSortByChange={onSortByChange}
      onReset={onResetFilters}
    />
    <ResultBar>
      <StatPill label="검색 결과" value={`${characters.length}명`} />
      <StatPill label="전체 캐릭터" value={`${totalCount}명`} />
    </ResultBar>
    {characters.length === 0 ? (
      <EmptyState
        title="조건에 맞는 캐릭터가 없어요."
        description="검색어를 바꾸거나 필터를 초기화해서 다른 조합을 확인해보세요."
      />
    ) : (
      <Grid>
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </Grid>
    )}
  </Layout>
);
