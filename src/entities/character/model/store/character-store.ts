import { create } from 'zustand';
import { characterApi } from '@/entities/character/api/characterApi';
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

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface CharacterStoreState {
  characters: CharacterSummary[];
  characterDetails: Record<string, CharacterDetail>;
  tiers: TierGroup[];
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
  resetFilters: () => void;
}

const initialFilters: CharacterFilters = {
  searchQuery: '',
  trait: 'all',
  officialCategory: 'all',
  role: 'all',
  sortBy: 'tier-desc',
};

export const useCharacterStore = create<CharacterStoreState>((set, get) => ({
  characters: [],
  characterDetails: {},
  tiers: [],
  catalogStatus: 'idle',
  catalogError: null,
  detailStatusById: {},
  detailErrorById: {},
  filters: initialFilters,

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

      set({
        characters,
        tiers,
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

  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
