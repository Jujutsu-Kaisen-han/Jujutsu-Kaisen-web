import type {
  CharacterFilters,
  CharacterTrait,
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

const hangulInitials = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const;

const hangulSyllableStartCode = '가'.charCodeAt(0);
const hangulSyllableEndCode = '힣'.charCodeAt(0);
const hangulInitialPattern = /[ㄱ-ㅎ]/u;
const searchSeparatorPattern = /[\s\-_.:/]+/gu;

const normalizeSearchValue = (value: string): string => value
  .normalize('NFC')
  .toLocaleLowerCase('ko-KR')
  .replace(searchSeparatorPattern, ' ')
  .trim();

const compactSearchValue = (value: string): string => value.replace(/\s+/gu, '');

const getHangulInitials = (value: string): string => Array.from(value)
  .map((character) => {
    const code = character.charCodeAt(0);

    if (code < hangulSyllableStartCode || code > hangulSyllableEndCode) {
      return character;
    }

    const initialIndex = Math.floor((code - hangulSyllableStartCode) / 588);

    return hangulInitials[initialIndex] ?? character;
  })
  .join('');

const getSearchCandidates = (character: CharacterSummary): string[] => [
  character.id,
  character.id.replaceAll('-', ' '),
  character.name,
  character.baseName,
  character.variantName,
  character.title,
];

const matchesCharacterSearch = (character: CharacterSummary, rawSearchQuery: string): boolean => {
  const searchQuery = normalizeSearchValue(rawSearchQuery);

  if (searchQuery.length === 0) {
    return true;
  }

  const compactSearchQuery = compactSearchValue(searchQuery);
  const shouldMatchHangulInitials = hangulInitialPattern.test(compactSearchQuery);

  return getSearchCandidates(character).some((candidate) => {
    const normalizedCandidate = normalizeSearchValue(candidate);
    const compactCandidate = compactSearchValue(normalizedCandidate);

    return normalizedCandidate.includes(searchQuery)
      || compactCandidate.includes(compactSearchQuery)
      || (
        shouldMatchHangulInitials
        && compactSearchValue(getHangulInitials(normalizedCandidate)).includes(compactSearchQuery)
      );
  });
};

export const getTierRank = (tier: CharacterTier): number => tierRankMap[tier];

export interface CharacterNeighbors {
  previousCharacter?: CharacterSummary;
  nextCharacter?: CharacterSummary;
  currentIndex: number;
  totalCount: number;
}

export const getCharacterNeighbors = (
  characters: CharacterSummary[],
  characterId: string,
): CharacterNeighbors => {
  const currentIndex = characters.findIndex((character) => character.id === characterId);

  if (currentIndex === -1) {
    return {
      currentIndex,
      totalCount: characters.length,
    };
  }

  return {
    previousCharacter: characters[currentIndex - 1],
    nextCharacter: characters[currentIndex + 1],
    currentIndex,
    totalCount: characters.length,
  };
};

export const filterAndSortCharacters = (
  characters: CharacterSummary[],
  filters: CharacterFilters,
): CharacterSummary[] => {
  return [...characters]
    .filter((character) => {
      const matchesSearch = matchesCharacterSearch(character, filters.searchQuery);
      const matchesTrait = filters.trait === 'all' || character.trait === filters.trait;
      const matchesOfficialCategory = filters.officialCategory === 'all'
        || character.officialCategory === filters.officialCategory;
      const matchesRole = filters.role === 'all' || character.role === filters.role;

      return matchesSearch && matchesTrait && matchesOfficialCategory && matchesRole;
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

export const filterAndSortCatalogCharacters = (
  characters: CharacterSummary[],
  filters: CharacterFilters,
  favoriteCharacterIds: string[],
): CharacterSummary[] => {
  const sortedCharacters = filterAndSortCharacters(characters, filters);

  if (!filters.favoritesOnly) {
    return sortedCharacters;
  }

  const favoriteCharacterIdSet = new Set(favoriteCharacterIds);

  return sortedCharacters.filter((character) => favoriteCharacterIdSet.has(character.id));
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

export const groupCharactersByTrait = (
  characters: CharacterSummary[],
  traits: CharacterTrait[],
): Array<{ trait: CharacterTrait; characters: CharacterSummary[] }> => traits
  .map((trait) => ({
    trait,
    characters: characters.filter((character) => character.trait === trait),
  }))
  .filter((group) => group.characters.length > 0);
