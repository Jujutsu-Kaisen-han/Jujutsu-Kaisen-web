const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
const explicitMockFlag = import.meta.env.VITE_USE_MOCK_API;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
export const USE_MOCK_API = explicitMockFlag === 'true'
  || (!API_BASE_URL && explicitMockFlag !== 'false');
