export const routes = {
  home: '/',
  characters: '/characters',
  characterDetail: (characterId: string) => `/characters/${characterId}`,
} as const;

export const routePatterns = {
  characterDetail: '/characters/:characterId',
} as const;
