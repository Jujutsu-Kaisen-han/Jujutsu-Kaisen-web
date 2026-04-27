import { mockCharacterDetails, mockCharacters, mockTiers } from '@/entities/character/api/mockData';
import type { CharacterDetail, CharacterSummary, TierGroup } from '@/entities/character/model/types/character';
import { fetchJson } from '@/shared/api/http';
import { API_BASE_URL, USE_MOCK_API } from '@/shared/config/env';

const delay = (ms: number) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const withMockLatency = async <T,>(data: T): Promise<T> => {
  await delay(180);

  return JSON.parse(JSON.stringify(data)) as T;
};

const createEndpoint = (path: string) => `${API_BASE_URL}${path}`;

export const characterApi = {
  async getCharacters(): Promise<CharacterSummary[]> {
    if (USE_MOCK_API) {
      return withMockLatency(mockCharacters);
    }

    return fetchJson<CharacterSummary[]>(createEndpoint('/characters'));
  },

  async getCharacterById(characterId: string): Promise<CharacterDetail> {
    if (USE_MOCK_API) {
      const character = mockCharacterDetails.find((item) => item.id === characterId);

      if (!character) {
        throw new Error('요청한 캐릭터 정보를 찾지 못했습니다.');
      }

      return withMockLatency(character);
    }

    return fetchJson<CharacterDetail>(createEndpoint(`/characters/${characterId}`));
  },

  async getTiers(): Promise<TierGroup[]> {
    if (USE_MOCK_API) {
      return withMockLatency(mockTiers);
    }

    return fetchJson<TierGroup[]>(createEndpoint('/tiers'));
  },
};
