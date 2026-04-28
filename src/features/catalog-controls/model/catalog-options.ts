import {
  officialCategoryLabels,
  roleLabels,
  traitLabels,
  type CharacterRole,
  type CharacterTrait,
  type OfficialCategory,
} from '@/entities/character/model/types/character';

export const traitFilterOptions: Array<{ value: CharacterTrait | 'all'; label: string }> = [
  { value: 'all', label: '전체 특성' },
  ...Object.entries(traitLabels).map(([value, label]) => ({
    value: value as CharacterTrait,
    label,
  })),
];

export const officialCategoryFilterOptions: Array<{ value: OfficialCategory | 'all'; label: string }> = [
  { value: 'all', label: '전체 분류' },
  ...Object.entries(officialCategoryLabels).map(([value, label]) => ({
    value: value as OfficialCategory,
    label,
  })),
];

export const roleFilterOptions: Array<{ value: CharacterRole | 'all'; label: string }> = [
  { value: 'all', label: '전체 역할' },
  ...Object.entries(roleLabels).map(([value, label]) => ({
    value: value as CharacterRole,
    label,
  })),
];

export const sortOptions = [
  { value: 'tier-desc', label: '티어 높은 순' },
  { value: 'name-asc', label: '이름 오름차순' },
  { value: 'name-desc', label: '이름 내림차순' },
] as const;
