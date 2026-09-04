import { create } from 'zustand';
import { characterApi } from '@/entities/character/api/characterApi';
import { isResourceNotFoundError } from '@/shared/api/http';
import {
  rebuildTierGroups,
  updateTierCharacterOrder,
  updateTierAssignments,
} from '@/entities/character/lib/character-selectors';
import { tierOrder, type TierCharacterOrder } from '@/entities/character/model/types/character';
import type {
  CatalogSortOption,
  CharacterCombatType,
  CharacterDetail,
  CharacterFilters,
  CharacterTrait,
  CharacterRole,
  CharacterSummary,
  OfficialCategory,
  TierGroup,
  CharacterTier,
} from '@/entities/character/model/types/character';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-found';

interface CharacterStoreState {
  characters: CharacterSummary[];
  characterDetails: Record<string, CharacterDetail>;
  tiers: TierGroup[];
  sourceCharacters: CharacterSummary[];
  sourceTiers: TierGroup[];
  tierAssignments: Record<string, CharacterTier>;
  tierCharacterOrder: TierCharacterOrder;
  favoriteCharacterIds: string[];
  catalogStatus: AsyncStatus;
  catalogError: string | null;
  detailStatusById: Record<string, AsyncStatus>;
  detailErrorById: Record<string, string | null>;
  filters: CharacterFilters;
  loadCatalog: (force?: boolean) => Promise<void>;
  loadCharacterById: (characterId: string, force?: boolean) => Promise<CharacterDetail | null>;
  setSearchQuery: (searchQuery: string) => void;
  setTraitFilter: (trait: CharacterTrait | 'all') => void;
  setOfficialCategoryFilter: (officialCategory: OfficialCategory | 'all') => void;
  setRoleFilter: (role: CharacterRole | 'all') => void;
  setSortBy: (sortBy: CatalogSortOption) => void;
  setFilters: (filters: CharacterFilters) => void;
  setCharacterTier: (characterId: string, tier: CharacterTier | null) => void;
  moveCharacterWithinTier: (characterId: string, direction: 'up' | 'down') => void;
  resetTierAssignments: () => void;
  toggleFavoriteCharacter: (characterId: string) => void;
  resetFilters: () => void;
}

export const defaultCharacterFilters: CharacterFilters = {
  searchQuery: '',
  trait: 'all',
  officialCategory: 'all',
  role: 'all',
  sortBy: 'tier-desc',
  favoritesOnly: false,
};

const favoriteStorageKey = 'jujutsu-fan-archive:favorites';
const tierAssignmentsStorageKey = 'jujutsu-fan-archive:tier-assignments';
const tierCharacterOrderStorageKey = 'jujutsu-fan-archive:tier-character-order';

const getLocalStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const normalizeFavoriteIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const favoriteIds = value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim());

  return Array.from(new Set(favoriteIds));
};

const readStoredFavoriteCharacterIds = (): string[] => {
  const storage = getLocalStorage();

  if (!storage) {
    return [];
  }

  try {
    return normalizeFavoriteIds(JSON.parse(storage.getItem(favoriteStorageKey) ?? '[]'));
  } catch {
    return [];
  }
};

const writeStoredFavoriteCharacterIds = (favoriteCharacterIds: string[]) => {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(favoriteStorageKey, JSON.stringify(favoriteCharacterIds));
  } catch {
    // Ignore storage failures so favorites remain an optional enhancement.
  }
};

const normalizeTierAssignments = (value: unknown): Record<string, CharacterTier> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, CharacterTier>>((assignments, [characterId, tier]) => {
    if (typeof tier === 'string' && tierOrder.includes(tier as CharacterTier)) {
      assignments[characterId] = tier as CharacterTier;
    }

    return assignments;
  }, {});
};

const readStoredTierAssignments = (): Record<string, CharacterTier> => {
  const storage = getLocalStorage();

  if (!storage) {
    return {};
  }

  try {
    const storedValue = storage.getItem(tierAssignmentsStorageKey) ?? '{}';

    return normalizeTierAssignments(JSON.parse(storedValue));
  } catch {
    return {};
  }
};

const createEmptyTierCharacterOrder = (): TierCharacterOrder => tierOrder.reduce<TierCharacterOrder>(
  (order, tier) => ({ ...order, [tier]: [] }),
  {} as TierCharacterOrder,
);

const normalizeTierCharacterOrder = (value: unknown): TierCharacterOrder => {
  const emptyOrder = createEmptyTierCharacterOrder();

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return emptyOrder;
  }

  tierOrder.forEach((tier) => {
    const tierValue = (value as Record<string, unknown>)[tier];

    if (Array.isArray(tierValue)) {
      emptyOrder[tier] = Array.from(new Set(
        tierValue.filter((item): item is string => typeof item === 'string' && item.trim().length > 0),
      ));
    }
  });

  return emptyOrder;
};

const readStoredTierCharacterOrder = (): TierCharacterOrder => {
  const storage = getLocalStorage();

  if (!storage) {
    return createEmptyTierCharacterOrder();
  }

  try {
    return normalizeTierCharacterOrder(JSON.parse(
      storage.getItem(tierCharacterOrderStorageKey) ?? '{}',
    ));
  } catch {
    return createEmptyTierCharacterOrder();
  }
};

const writeStoredTierCharacterOrder = (tierCharacterOrder: TierCharacterOrder) => {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(tierCharacterOrderStorageKey, JSON.stringify(tierCharacterOrder));
  } catch {
    // Ignore storage failures so custom ordering remains an optional enhancement.
  }
};

const writeStoredTierAssignments = (tierAssignments: Record<string, CharacterTier>) => {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(tierAssignmentsStorageKey, JSON.stringify(tierAssignments));
  } catch {
    // Ignore storage failures so custom tiers remain an optional enhancement.
  }
};

const pruneFavoriteCharacterIds = (
  favoriteCharacterIds: string[],
  characters: CharacterSummary[],
): string[] => {
  const knownCharacterIds = new Set(characters.map((character) => character.id));

  return favoriteCharacterIds.filter((characterId) => knownCharacterIds.has(characterId));
};

const pruneTierAssignments = (
  tierAssignments: Record<string, CharacterTier>,
  characters: CharacterSummary[],
): Record<string, CharacterTier> => {
  const knownCharacterIds = new Set(characters.map((character) => character.id));

  return Object.fromEntries(
    Object.entries(tierAssignments).filter(([characterId]) => knownCharacterIds.has(characterId)),
  );
};

const pruneTierCharacterOrder = (
  tierCharacterOrder: TierCharacterOrder,
  characters: CharacterSummary[],
): TierCharacterOrder => {
  const knownCharacterIds = new Set(characters.map((character) => character.id));

  return tierOrder.reduce<TierCharacterOrder>((order, tier) => ({
    ...order,
    [tier]: tierCharacterOrder[tier].filter((characterId) => knownCharacterIds.has(characterId)),
  }), {} as TierCharacterOrder);
};

export const useCharacterStore = create<CharacterStoreState>((set, get) => ({
  characters: [],
  characterDetails: {},
  tiers: [],
  sourceCharacters: [],
  sourceTiers: [],
  tierAssignments: readStoredTierAssignments(),
  tierCharacterOrder: readStoredTierCharacterOrder(),
  favoriteCharacterIds: readStoredFavoriteCharacterIds(),
  catalogStatus: 'idle',
  catalogError: null,
  detailStatusById: {},
  detailErrorById: {},
  filters: defaultCharacterFilters,

  loadCatalog: async (force = false) => {
    if (get().catalogStatus === 'loading') {
      return;
    }

    if (
      !force
      && get().catalogStatus === 'success'
      && get().characters.length > 0
      && get().tiers.length > 0
    ) {
      return;
    }

    set({ catalogStatus: 'loading', catalogError: null });

    try {
      const [characters, tiers] = await Promise.all([
        characterApi.getCharacters(),
        characterApi.getTiers(),
      ]);
      const tierAssignments = pruneTierAssignments(get().tierAssignments, characters);
      const tierCharacterOrder = pruneTierCharacterOrder(get().tierCharacterOrder, characters);
      const favoriteCharacterIds = pruneFavoriteCharacterIds(get().favoriteCharacterIds, characters);

      if (favoriteCharacterIds.length !== get().favoriteCharacterIds.length) {
        writeStoredFavoriteCharacterIds(favoriteCharacterIds);
      }

      if (Object.keys(tierAssignments).length !== Object.keys(get().tierAssignments).length) {
        writeStoredTierAssignments(tierAssignments);
      }

      if (JSON.stringify(tierCharacterOrder) !== JSON.stringify(get().tierCharacterOrder)) {
        writeStoredTierCharacterOrder(tierCharacterOrder);
      }

      set({
        characters,
        tiers: rebuildTierGroups(tiers, characters, tierAssignments, tierCharacterOrder),
        sourceCharacters: characters,
        sourceTiers: tiers,
        tierAssignments,
        tierCharacterOrder,
        favoriteCharacterIds,
        catalogStatus: 'success',
        catalogError: null,
      });
    } catch (error) {
      set({
        catalogStatus: 'error',
        catalogError: error instanceof Error
          ? error.message
          : '캐릭터 데이터를 불러오지 못했습니다.',
      });
    }
  },

  loadCharacterById: async (characterId, force = false) => {
    if (!force && get().characterDetails[characterId]) {
      return get().characterDetails[characterId];
    }

    const currentStatus = get().detailStatusById[characterId];

    if (currentStatus === 'loading') {
      return get().characterDetails[characterId] ?? null;
    }

    set((state) => ({
      detailStatusById: {
        ...state.detailStatusById,
        [characterId]: 'loading',
      },
      detailErrorById: {
        ...state.detailErrorById,
        [characterId]: null,
      },
    }));

    try {
      const character = await characterApi.getCharacterById(characterId);

      set((state) => ({
        characterDetails: {
          ...state.characterDetails,
          [characterId]: character,
        },
        detailStatusById: {
          ...state.detailStatusById,
          [characterId]: 'success',
        },
        detailErrorById: {
          ...state.detailErrorById,
          [characterId]: null,
        },
      }));

      return character;
    } catch (error) {
      if (isResourceNotFoundError(error)) {
        set((state) => ({
          detailStatusById: {
            ...state.detailStatusById,
            [characterId]: 'not-found',
          },
          detailErrorById: {
            ...state.detailErrorById,
            [characterId]: null,
          },
        }));

        return null;
      }

      const message = error instanceof Error
        ? error.message
        : '캐릭터 상세 정보를 불러오지 못했습니다.';

      set((state) => ({
        detailStatusById: {
          ...state.detailStatusById,
          [characterId]: 'error',
        },
        detailErrorById: {
          ...state.detailErrorById,
          [characterId]: message,
        },
      }));

      return null;
    }
  },

  setSearchQuery: (searchQuery) => {
    set((state) => ({
      filters: {
        ...state.filters,
        searchQuery,
      },
    }));
  },

  setTraitFilter: (trait) => {
    set((state) => ({
      filters: {
        ...state.filters,
        trait,
      },
    }));
  },

  setOfficialCategoryFilter: (officialCategory) => {
    set((state) => ({
      filters: {
        ...state.filters,
        officialCategory,
      },
    }));
  },

  setRoleFilter: (role) => {
    set((state) => ({
      filters: {
        ...state.filters,
        role,
      },
    }));
  },

  setSortBy: (sortBy) => {
    set((state) => ({
      filters: {
        ...state.filters,
        sortBy,
      },
    }));
  },

  setFilters: (filters) => {
    set({ filters });
  },

  setCharacterTier: (characterId, tier) => {
    set((state) => {
      const character = state.characters.find((item) => item.id === characterId);
      const currentTierAssignment = state.tierAssignments[characterId];

      if (!character || (tier === null ? !currentTierAssignment : currentTierAssignment === tier)) {
        return state;
      }

      const tierAssignments = updateTierAssignments(state.tierAssignments, characterId, tier);
      const tierCharacterOrder = updateTierCharacterOrder(
        state.tierCharacterOrder,
        characterId,
        tier,
      );

      writeStoredTierAssignments(tierAssignments);
      writeStoredTierCharacterOrder(tierCharacterOrder);

      return {
        tiers: rebuildTierGroups(state.tiers, state.characters, tierAssignments, tierCharacterOrder),
        tierAssignments,
        tierCharacterOrder,
      };
    });
  },

  moveCharacterWithinTier: (characterId, direction) => {
    set((state) => {
      const currentTier = state.tierAssignments[characterId];

      if (!currentTier) {
        return state;
      }

      const currentGroup = state.tiers.find((group) => group.tier === currentTier);

      if (!currentGroup) {
        return state;
      }

      const currentIndex = currentGroup.characterIds.indexOf(characterId);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= currentGroup.characterIds.length) {
        return state;
      }

      const nextIds = [...currentGroup.characterIds];
      [nextIds[currentIndex], nextIds[targetIndex]] = [nextIds[targetIndex], nextIds[currentIndex]];
      const tierCharacterOrder = {
        ...state.tierCharacterOrder,
        [currentTier]: nextIds,
      };

      writeStoredTierCharacterOrder(tierCharacterOrder);

      return {
        tiers: rebuildTierGroups(
          state.tiers,
          state.characters,
          state.tierAssignments,
          tierCharacterOrder,
        ),
        tierCharacterOrder,
      };
    });
  },

  resetTierAssignments: () => {
    set((state) => {
      if (Object.keys(state.tierAssignments).length === 0) {
        return state;
      }

      writeStoredTierAssignments({});
      const tierCharacterOrder = createEmptyTierCharacterOrder();
      writeStoredTierCharacterOrder(tierCharacterOrder);

      return {
        tiers: rebuildTierGroups(state.sourceTiers, state.sourceCharacters, {}, tierCharacterOrder),
        tierAssignments: {},
        tierCharacterOrder,
      };
    });
  },

  toggleFavoriteCharacter: (characterId) => {
    set((state) => {
      const hasFavorite = state.favoriteCharacterIds.includes(characterId);
      const favoriteCharacterIds = hasFavorite
        ? state.favoriteCharacterIds.filter((favoriteCharacterId) => favoriteCharacterId !== characterId)
        : [...state.favoriteCharacterIds, characterId];

      writeStoredFavoriteCharacterIds(favoriteCharacterIds);

      return { favoriteCharacterIds };
    });
  },

  resetFilters: () => {
    set({ filters: defaultCharacterFilters });
  },
}));
