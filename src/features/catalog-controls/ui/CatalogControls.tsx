import styled from 'styled-components';
import type {
  CatalogSortOption,
  CharacterFilters,
  CharacterRole,
  CharacterTrait,
  OfficialCategory,
} from '@/entities/character/model/types/character';
import {
  officialCategoryLabels,
  roleLabels,
  traitLabels,
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
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

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

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Hint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

const ActiveFilterPanel = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 2px;
`;

const ActiveFilterHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ActiveFilterTitle = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ActiveFilterList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ActiveFilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  max-width: 100%;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 122, 69, 0.22);
  }
`;

const ActiveFilterLabel = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`;

const RemoveIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  line-height: 1;
`;

const FavoriteToggle = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid ${({ $active, theme }) => (
    $active ? theme.colors.borderStrong : theme.colors.border
  )};
  background: ${({ $active, theme }) => (
    $active ? theme.colors.primarySoft : 'rgba(15, 23, 42, 0.82)'
  )};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const FavoriteIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  line-height: 1;
`;

interface CatalogControlsProps {
  filters: CharacterFilters;
  onSearchQueryChange: (value: string) => void;
  onTraitFilterChange: (value: CharacterTrait | 'all') => void;
  onOfficialCategoryFilterChange: (value: OfficialCategory | 'all') => void;
  onRoleFilterChange: (value: CharacterRole | 'all') => void;
  onSortByChange: (value: CatalogSortOption) => void;
  onFavoritesOnlyChange: (value: boolean) => void;
  onReset: () => void;
}

interface ActiveFilterItem {
  id: string;
  label: string;
  onRemove: () => void;
}

export const CatalogControls = ({
  filters,
  onSearchQueryChange,
  onTraitFilterChange,
  onOfficialCategoryFilterChange,
  onRoleFilterChange,
  onSortByChange,
  onFavoritesOnlyChange,
  onReset,
}: CatalogControlsProps) => {
  const hasActiveFilters = filters.searchQuery.length > 0
    || filters.trait !== 'all'
    || filters.officialCategory !== 'all'
    || filters.role !== 'all'
    || filters.sortBy !== 'tier-desc'
    || filters.favoritesOnly;
  const selectedSortOption = sortOptions.find((option) => option.value === filters.sortBy);
  const activeFilters: ActiveFilterItem[] = [];

  if (filters.searchQuery.trim().length > 0) {
    activeFilters.push({
      id: 'searchQuery',
      label: `검색: ${filters.searchQuery.trim()}`,
      onRemove: () => onSearchQueryChange(''),
    });
  }

  if (filters.trait !== 'all') {
    activeFilters.push({
      id: 'trait',
      label: `특성: ${traitLabels[filters.trait]}`,
      onRemove: () => onTraitFilterChange('all'),
    });
  }

  if (filters.officialCategory !== 'all') {
    activeFilters.push({
      id: 'officialCategory',
      label: `분류: ${officialCategoryLabels[filters.officialCategory]}`,
      onRemove: () => onOfficialCategoryFilterChange('all'),
    });
  }

  if (filters.role !== 'all') {
    activeFilters.push({
      id: 'role',
      label: `역할: ${roleLabels[filters.role]}`,
      onRemove: () => onRoleFilterChange('all'),
    });
  }

  if (filters.sortBy !== 'tier-desc') {
    activeFilters.push({
      id: 'sortBy',
      label: `정렬: ${selectedSortOption?.label ?? filters.sortBy}`,
      onRemove: () => onSortByChange('tier-desc'),
    });
  }

  if (filters.favoritesOnly) {
    activeFilters.push({
      id: 'favoritesOnly',
      label: '즐겨찾기만 보기',
      onRemove: () => onFavoritesOnlyChange(false),
    });
  }

  return (
    <Layout>
      <FieldGrid>
        <SearchField
          label="이름 검색"
          placeholder="고죠, ㄱㅈ, 허식 자색..."
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
      {activeFilters.length > 0 ? (
        <ActiveFilterPanel role="group" aria-label="활성 필터">
          <ActiveFilterHeader>
            <ActiveFilterTitle>활성 필터</ActiveFilterTitle>
          </ActiveFilterHeader>
          <ActiveFilterList>
            {activeFilters.map((filter) => (
              <ActiveFilterChip
                key={filter.id}
                type="button"
                aria-label={`${filter.label} 해제`}
                onClick={filter.onRemove}
              >
                <ActiveFilterLabel>{filter.label}</ActiveFilterLabel>
                <RemoveIcon aria-hidden="true">×</RemoveIcon>
              </ActiveFilterChip>
            ))}
          </ActiveFilterList>
        </ActiveFilterPanel>
      ) : null}
      <Footer>
        <Hint>특성과 분류, 역할을 함께 걸어 원하는 캐릭터만 빠르게 찾을 수 있습니다.</Hint>
        <Actions>
          <FavoriteToggle
            type="button"
            $active={filters.favoritesOnly}
            aria-pressed={filters.favoritesOnly}
            onClick={() => onFavoritesOnlyChange(!filters.favoritesOnly)}
          >
            <FavoriteIcon aria-hidden="true">{filters.favoritesOnly ? '★' : '☆'}</FavoriteIcon>
            즐겨찾기만 보기
          </FavoriteToggle>
          <Button variant="ghost" onClick={onReset} disabled={!hasActiveFilters}>
            필터 초기화
          </Button>
        </Actions>
      </Footer>
    </Layout>
  );
};
