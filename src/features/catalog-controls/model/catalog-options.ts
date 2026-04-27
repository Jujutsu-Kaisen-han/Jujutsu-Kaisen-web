import { elementLabels, roleLabels, type CharacterElement, type CharacterRole } from '@/entities/character/model/types/character';

export const elementFilterOptions: Array<{ value: CharacterElement | 'all'; label: string }> = [
  { value: 'all', label: '전체 속성' },
  ...Object.entries(elementLabels).map(([value, label]) => ({
    value: value as CharacterElement,
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
