import { create } from 'zustand';
import { characterApi } from '@/entities/character/api/characterApi';
import { isResourceNotFoundError } from '@/shared/api/http';
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
} from '@/entities/character/model/types/character';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-found';

interface CharacterStoreState {
  characters: CharacterSummary[];
  characterDetails: Record<string, CharacterDetail>;
  tiers: TierGroup[];
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

const pruneFavoriteCharacterIds = (
  favoriteCharacterIds: string[],
  characters: CharacterSummary[],
): string[] => {
  const knownCharacterIds = new Set(characters.map((character) => character.id));

  return favoriteCharacterIds.filter((characterId) => knownCharacterIds.has(characterId));
};

export const useCharacterStore = create<CharacterStoreState>((set, get) => ({
  characters: [],
  characterDetails: {},
  tiers: [],
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
      const favoriteCharacterIds = pruneFavoriteCharacterIds(get().favoriteCharacterIds, characters);

      if (favoriteCharacterIds.length !== get().favoriteCharacterIds.length) {
        writeStoredFavoriteCharacterIds(favoriteCharacterIds);
      }

      set({
        characters,
        tiers,
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
