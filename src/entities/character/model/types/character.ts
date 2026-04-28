export type CharacterTier = 'SS' | 'S' | 'A' | 'B' | 'C';
export type CharacterTrait = 'action' | 'illusion' | 'shadow' | 'night';
export type CharacterCombatType = 'physical' | 'cursed' | 'hybrid';
export type CharacterRole = 'attacker' | 'support' | 'breaker' | 'defender' | 'debuffer' | 'healer';
export type CharacterRarity = 'SSR' | 'SR' | 'R';
export type OfficialCategory =
  | 'tokyo-school'
  | 'kyoto-school'
  | 'sorcerer'
  | 'curse-side'
  | 'other'
  | 'fanpare-original';
export type CatalogSortOption = 'tier-desc' | 'name-asc' | 'name-desc';

export interface CharacterSkill {
  name: string;
  description: string;
  cooldown?: string;
}

export interface CharacterSummary {
  id: string;
  name: string;
  baseName: string;
  variantName: string;
  title: string;
  image: string;
  trait: CharacterTrait;
  combatType: CharacterCombatType;
  role: CharacterRole;
  tier: CharacterTier;
  rarity: CharacterRarity;
  releaseType: string;
  officialCategory: OfficialCategory;
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
  trait: CharacterTrait | 'all';
  officialCategory: OfficialCategory | 'all';
  role: CharacterRole | 'all';
  sortBy: CatalogSortOption;
}

export const tierOrder: CharacterTier[] = ['SS', 'S', 'A', 'B', 'C'];

export const traitLabels: Record<CharacterTrait, string> = {
  action: '행',
  illusion: '환',
  shadow: '영',
  night: '야',
};

export const combatTypeLabels: Record<CharacterCombatType, string> = {
  physical: '체술',
  cursed: '술식',
  hybrid: '복합',
};

export const roleLabels: Record<CharacterRole, string> = {
  attacker: '어태커',
  support: '서포터',
  breaker: '브레이커',
  defender: '방어',
  debuffer: '디버퍼',
  healer: '회복',
};

export const officialCategoryLabels: Record<OfficialCategory, string> = {
  'tokyo-school': '도쿄교',
  'kyoto-school': '교토교',
  sorcerer: '술사',
  'curse-side': '주저사/주령',
  other: '기타',
  'fanpare-original': '팬파레 오리지널',
};
