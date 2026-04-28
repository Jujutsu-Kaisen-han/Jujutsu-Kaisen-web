import styled from 'styled-components';
import type {
  CatalogSortOption,
  CharacterFilters,
  CharacterRole,
  CharacterTrait,
  OfficialCategory,
} from '@/entities/character/model/types/character';
import {
  officialCategoryFilterOptions,
  roleFilterOptions,
  sortOptions,
  traitFilterOptions,
} from '@/features/catalog-controls/model/catalog-options';
import { Button } from '@/shared/ui/Button';
import { Panel } from '@/shared/ui/Panel';
import { SearchField } from '@/shared/ui/SearchField';
import { SelectField } from '@/shared/ui/SelectField';

const Layout = styled(Panel)`
  display: grid;
  gap: 20px;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const Hint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

interface CatalogControlsProps {
  filters: CharacterFilters;
  onSearchQueryChange: (value: string) => void;
  onTraitFilterChange: (value: CharacterTrait | 'all') => void;
  onOfficialCategoryFilterChange: (value: OfficialCategory | 'all') => void;
  onRoleFilterChange: (value: CharacterRole | 'all') => void;
  onSortByChange: (value: CatalogSortOption) => void;
  onReset: () => void;
}

export const CatalogControls = ({
  filters,
  onSearchQueryChange,
  onTraitFilterChange,
  onOfficialCategoryFilterChange,
  onRoleFilterChange,
  onSortByChange,
  onReset,
}: CatalogControlsProps) => {
  const hasActiveFilters = filters.searchQuery.length > 0
    || filters.trait !== 'all'
    || filters.officialCategory !== 'all'
    || filters.role !== 'all'
    || filters.sortBy !== 'tier-desc';

  return (
    <Layout>
      <FieldGrid>
        <SearchField
          label="이름 검색"
          placeholder="무량공처, 고죠, 유타, 존..."
          value={filters.searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
        />
        <SelectField
          label="특성"
          value={filters.trait}
          options={traitFilterOptions}
          onChange={(event) => onTraitFilterChange(event.target.value as CharacterTrait | 'all')}
        />
        <SelectField
          label="공식 분류"
          value={filters.officialCategory}
          options={officialCategoryFilterOptions}
          onChange={(event) => onOfficialCategoryFilterChange(event.target.value as OfficialCategory | 'all')}
        />
        <SelectField
          label="역할"
          value={filters.role}
          options={roleFilterOptions}
          onChange={(event) => onRoleFilterChange(event.target.value as CharacterRole | 'all')}
        />
        <SelectField
          label="정렬"
          value={filters.sortBy}
          options={sortOptions.map((option) => ({ ...option }))}
          onChange={(event) => onSortByChange(event.target.value as CatalogSortOption)}
        />
      </FieldGrid>
      <Footer>
        <Hint>팬파레 특성과 공식 사이트 분류를 함께 걸어 원하는 변형 유닛만 좁힐 수 있습니다.</Hint>
        <Button variant="ghost" onClick={onReset} disabled={!hasActiveFilters}>
          필터 초기화
        </Button>
      </Footer>
    </Layout>
  );
};
