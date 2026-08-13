import { defaultCharacterFilters } from '@/entities/character/model/store/character-store';
import {
  officialCategoryLabels,
  roleLabels,
  traitOrder,
  type CatalogSortOption,
  type CharacterFilters,
  type CharacterRole,
  type CharacterTrait,
  type OfficialCategory,
} from '@/entities/character/model/types/character';
import { sortOptions } from '@/features/catalog-controls/model/catalog-options';

const searchParamKeys = {
  searchQuery: 'q',
  trait: 'trait',
  officialCategory: 'category',
  role: 'role',
  sortBy: 'sort',
  favoritesOnly: 'favorites',
} as const;

const officialCategoryValues = Object.keys(officialCategoryLabels) as OfficialCategory[];
const roleValues = Object.keys(roleLabels) as CharacterRole[];
const sortValues = sortOptions.map((option) => option.value) satisfies CatalogSortOption[];

const isAllowedValue = <T extends string>(
  value: string | null,
  allowedValues: readonly T[],
): value is T => value !== null && allowedValues.includes(value as T);

const getSearchQuery = (searchParams: URLSearchParams): string => (
  searchParams.get(searchParamKeys.searchQuery)?.trim() ?? defaultCharacterFilters.searchQuery
);

export const getCatalogFiltersFromSearchParams = (
  searchParams: URLSearchParams,
): CharacterFilters => {
  const trait = searchParams.get(searchParamKeys.trait);
  const officialCategory = searchParams.get(searchParamKeys.officialCategory);
  const role = searchParams.get(searchParamKeys.role);
  const sortBy = searchParams.get(searchParamKeys.sortBy);
  const favoritesOnly = searchParams.get(searchParamKeys.favoritesOnly);

  return {
    searchQuery: getSearchQuery(searchParams),
    trait: isAllowedValue(trait, traitOrder) ? trait : defaultCharacterFilters.trait,
    officialCategory: isAllowedValue(officialCategory, officialCategoryValues)
      ? officialCategory
      : defaultCharacterFilters.officialCategory,
    role: isAllowedValue(role, roleValues) ? role : defaultCharacterFilters.role,
    sortBy: isAllowedValue(sortBy, sortValues) ? sortBy : defaultCharacterFilters.sortBy,
    favoritesOnly: favoritesOnly === '1',
  };
};

export const createCatalogSearchParams = (filters: CharacterFilters): URLSearchParams => {
  const searchParams = new URLSearchParams();
  const searchQuery = filters.searchQuery.trim();

  if (searchQuery.length > 0) {
    searchParams.set(searchParamKeys.searchQuery, searchQuery);
  }

  if (filters.trait !== defaultCharacterFilters.trait) {
    searchParams.set(searchParamKeys.trait, filters.trait);
  }

  if (filters.officialCategory !== defaultCharacterFilters.officialCategory) {
    searchParams.set(searchParamKeys.officialCategory, filters.officialCategory);
  }

  if (filters.role !== defaultCharacterFilters.role) {
    searchParams.set(searchParamKeys.role, filters.role);
  }

  if (filters.sortBy !== defaultCharacterFilters.sortBy) {
    searchParams.set(searchParamKeys.sortBy, filters.sortBy);
  }

  if (filters.favoritesOnly) {
    searchParams.set(searchParamKeys.favoritesOnly, '1');
  }

  return searchParams;
};

export const areCatalogFiltersEqual = (
  left: CharacterFilters,
  right: CharacterFilters,
): boolean => (
  left.searchQuery === right.searchQuery
  && left.trait === right.trait
  && left.officialCategory === right.officialCategory
  && left.role === right.role
  && left.sortBy === right.sortBy
  && left.favoritesOnly === right.favoritesOnly
);
