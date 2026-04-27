import type {
  CharacterFilters,
  CharacterSummary,
  CharacterTier,
  TierGroup,
} from '@/entities/character/model/types/character';

const tierRankMap: Record<CharacterTier, number> = {
  SS: 5,
  S: 4,
  A: 3,
  B: 2,
  C: 1,
};

export const getTierRank = (tier: CharacterTier): number => tierRankMap[tier];

export const filterAndSortCharacters = (
  characters: CharacterSummary[],
  filters: CharacterFilters,
): CharacterSummary[] => {
  const searchQuery = filters.searchQuery.trim().toLocaleLowerCase();

  return [...characters]
    .filter((character) => {
      const matchesSearch = searchQuery.length === 0
        || character.name.toLocaleLowerCase().includes(searchQuery)
        || character.title.toLocaleLowerCase().includes(searchQuery);

      const matchesElement = filters.element === 'all' || character.element === filters.element;
      const matchesRole = filters.role === 'all' || character.role === filters.role;

      return matchesSearch && matchesElement && matchesRole;
    })
    .sort((left, right) => {
      if (filters.sortBy === 'name-asc') {
        return left.name.localeCompare(right.name, 'ko');
      }

      if (filters.sortBy === 'name-desc') {
        return right.name.localeCompare(left.name, 'ko');
      }

      const tierDiff = getTierRank(right.tier) - getTierRank(left.tier);

      if (tierDiff !== 0) {
        return tierDiff;
      }

      return left.name.localeCompare(right.name, 'ko');
    });
};

export const groupCharactersByTier = (
  tiers: TierGroup[],
  characters: CharacterSummary[],
): Array<TierGroup & { characters: CharacterSummary[] }> => tiers.map((tierGroup) => ({
  ...tierGroup,
  characters: tierGroup.characterIds
    .map((characterId) => characters.find((character) => character.id === characterId))
    .filter((character): character is CharacterSummary => Boolean(character)),
}));
