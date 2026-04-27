export type CharacterTier = 'SS' | 'S' | 'A' | 'B' | 'C';
export type CharacterElement = 'fire' | 'water' | 'wind' | 'light' | 'dark' | 'earth';
export type CharacterRole = 'attacker' | 'support' | 'breaker' | 'tank' | 'debuffer';
export type CatalogSortOption = 'tier-desc' | 'name-asc' | 'name-desc';

export interface CharacterSkill {
  name: string;
  description: string;
  cooldown?: string;
}

export interface CharacterSummary {
  id: string;
  name: string;
  title: string;
  image: string;
  element: CharacterElement;
  role: CharacterRole;
  tier: CharacterTier;
  releaseType: string;
}

export interface CharacterDetail extends CharacterSummary {
  description: string;
  passive: string;
  skills: CharacterSkill[];
  ultimate: CharacterSkill;
}

export interface TierGroup {
  tier: CharacterTier;
  headline: string;
  characterIds: string[];
}

export interface CharacterFilters {
  searchQuery: string;
  element: CharacterElement | 'all';
  role: CharacterRole | 'all';
  sortBy: CatalogSortOption;
}

export const tierOrder: CharacterTier[] = ['SS', 'S', 'A', 'B', 'C'];

export const elementLabels: Record<CharacterElement, string> = {
  fire: '화속성',
  water: '수속성',
  wind: '풍속성',
  light: '광속성',
  dark: '암속성',
  earth: '토속성',
};

export const roleLabels: Record<CharacterRole, string> = {
  attacker: '어태커',
  support: '서포터',
  breaker: '브레이커',
  tank: '탱커',
  debuffer: '디버퍼',
};
