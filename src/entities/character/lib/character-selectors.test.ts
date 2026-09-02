import assert from 'node:assert/strict';
import test from 'node:test';
import type { CharacterSummary } from '../model/types/character.ts';
import {
  filterAndSortCatalogCharacters,
  filterAndSortCharacters,
  getCharacterNeighbors,
  groupCharactersByTrait,
  rebuildTierGroups,
  updateTierAssignments,
} from './character-selectors.ts';

const createCharacter = (overrides: Partial<CharacterSummary>): CharacterSummary => ({
  id: 'sample-character',
  name: '샘플 캐릭터',
  baseName: '샘플 캐릭터',
  variantName: '기본형',
  title: '기본 테스트 유닛',
  image: '/characters/placeholder-character.svg',
  trait: 'illusion',
  combatType: 'cursed',
  role: 'attacker',
  tier: 'A',
  rarity: 'SSR',
  releaseType: '상시',
  officialCategory: 'tokyo-school',
  ...overrides,
});

const characters = [
  createCharacter({
    id: 'gojo-hollow-purple',
    name: '고죠 사토루',
    baseName: '고죠 사토루',
    variantName: '허식 「자」',
    title: '무하한 술식의 정점',
    trait: 'illusion',
    combatType: 'cursed',
    role: 'attacker',
    tier: 'SS',
    officialCategory: 'sorcerer',
  }),
  createCharacter({
    id: 'nanami-ratio',
    name: '나나미 켄토',
    baseName: '나나미 켄토',
    variantName: '십획주법',
    title: '냉정한 1급 술사',
    trait: 'shadow',
    combatType: 'physical',
    role: 'breaker',
    tier: 'S',
    officialCategory: 'sorcerer',
  }),
  createCharacter({
    id: 'yuji-lightfooted',
    name: '이타도리 유지',
    baseName: '이타도리 유지',
    variantName: '경쾌한 몸놀림',
    title: '근접전 어태커',
    trait: 'action',
    combatType: 'physical',
    role: 'attacker',
    tier: 'A',
  }),
] as const satisfies CharacterSummary[];

test('filterAndSortCharacters matches Korean, English, compact text, and Hangul initials', () => {
  assert.deepEqual(
    filterAndSortCharacters(characters, {
      searchQuery: 'ㄱㅈㅅ',
      trait: 'all',
      officialCategory: 'all',
      role: 'all',
      sortBy: 'tier-desc',
      favoritesOnly: false,
    }).map((character) => character.id),
    ['gojo-hollow-purple'],
  );

  assert.deepEqual(
    filterAndSortCharacters(characters, {
      searchQuery: 'hollow purple',
      trait: 'all',
      officialCategory: 'all',
      role: 'all',
      sortBy: 'tier-desc',
      favoritesOnly: false,
    }).map((character) => character.id),
    ['gojo-hollow-purple'],
  );

  assert.deepEqual(
    filterAndSortCharacters(characters, {
      searchQuery: '나나미켄',
      trait: 'all',
      officialCategory: 'all',
      role: 'all',
      sortBy: 'tier-desc',
      favoritesOnly: false,
    }).map((character) => character.id),
    ['nanami-ratio'],
  );
});

test('filterAndSortCatalogCharacters combines filters, favorites, and tier sorting', () => {
  const filteredCharacters = filterAndSortCatalogCharacters(
    characters,
    {
      searchQuery: '',
      trait: 'all',
      officialCategory: 'sorcerer',
      role: 'all',
      sortBy: 'tier-desc',
      favoritesOnly: true,
    },
    ['nanami-ratio', 'yuji-lightfooted', 'gojo-hollow-purple'],
  );

  assert.deepEqual(
    filteredCharacters.map((character) => character.id),
    ['gojo-hollow-purple', 'nanami-ratio'],
  );
});

test('filterAndSortCatalogCharacters ignores favorite ids outside the catalog', () => {
  const filteredCharacters = filterAndSortCatalogCharacters(
    characters,
    {
      searchQuery: '',
      trait: 'all',
      officialCategory: 'all',
      role: 'all',
      sortBy: 'tier-desc',
      favoritesOnly: true,
    },
    ['missing-character'],
  );

  assert.deepEqual(filteredCharacters, []);
});

test('filterAndSortCharacters supports Korean name ordering', () => {
  assert.deepEqual(
    filterAndSortCharacters(characters, {
      searchQuery: '',
      trait: 'all',
      officialCategory: 'all',
      role: 'all',
      sortBy: 'name-asc',
      favoritesOnly: false,
    }).map((character) => character.id),
    ['gojo-hollow-purple', 'nanami-ratio', 'yuji-lightfooted'],
  );
});

test('filterAndSortCharacters supports descending Korean name ordering', () => {
  assert.deepEqual(
    filterAndSortCharacters(characters, {
      searchQuery: '',
      trait: 'all',
      officialCategory: 'all',
      role: 'all',
      sortBy: 'name-desc',
      favoritesOnly: false,
    }).map((character) => character.id),
    ['yuji-lightfooted', 'nanami-ratio', 'gojo-hollow-purple'],
  );
});

test('getCharacterNeighbors returns adjacent entries inside the provided list', () => {
  assert.deepEqual(getCharacterNeighbors(characters, 'nanami-ratio'), {
    previousCharacter: characters[0],
    nextCharacter: characters[2],
    currentIndex: 1,
    totalCount: 3,
  });

  assert.deepEqual(getCharacterNeighbors(characters, 'missing-character'), {
    currentIndex: -1,
    totalCount: 3,
  });
});

test('groupCharactersByTrait preserves requested order and omits empty groups', () => {
  assert.deepEqual(
    groupCharactersByTrait(characters, ['action', 'night', 'illusion']).map((group) => ({
      trait: group.trait,
      ids: group.characters.map((character) => character.id),
    })),
    [
      {
        trait: 'action',
        ids: ['yuji-lightfooted'],
      },
      {
        trait: 'illusion',
        ids: ['gojo-hollow-purple'],
      },
    ],
  );
});

test('tier assignments move characters between groups while preserving tier order', () => {
  const tierGroups = rebuildTierGroups(
    [
      { tier: 'SS', headline: '최상위', characterIds: ['gojo-hollow-purple'] },
      { tier: 'S', headline: '우수', characterIds: ['nanami-ratio'] },
    ],
    [...characters],
    {
      'gojo-hollow-purple': 'B',
      'nanami-ratio': 'S',
      'yuji-lightfooted': 'A',
    },
  );

  assert.deepEqual(tierGroups.map((group) => [group.tier, group.characterIds]), [
    ['SS', []],
    ['S', ['nanami-ratio']],
    ['A', ['yuji-lightfooted']],
    ['B', ['gojo-hollow-purple']],
    ['C', []],
  ]);
  assert.equal(tierGroups[0].headline, '최상위');
});

test('empty tier assignments leave every tier group ready for drops', () => {
  const tierGroups = rebuildTierGroups([], [...characters], {});

  assert.deepEqual(tierGroups.map((group) => group.characterIds), [[], [], [], [], []]);
});

test('tier assignments can place and return a character to the unassigned area', () => {
  const assigned = updateTierAssignments({}, 'gojo-hollow-purple', 'SS');

  assert.deepEqual(assigned, { 'gojo-hollow-purple': 'SS' });
  assert.deepEqual(updateTierAssignments(assigned, 'gojo-hollow-purple', null), {});
});
