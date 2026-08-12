export const routes = {
  home: '/',
  characters: '/characters',
  series: '/series',
  characterDetail: (characterId: string) => `/characters/${characterId}`,
} as const;

export const routePatterns = {
  characterDetail: '/characters/:characterId',
} as const;
