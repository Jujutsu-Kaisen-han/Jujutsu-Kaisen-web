import { tierOrder, type CharacterDetail, type CharacterSummary, type TierGroup } from '@/entities/character/model/types/character';

type BaseCharacterKey =
  | 'gojo'
  | 'sukuna'
  | 'yuta'
  | 'toji'
  | 'mahito'
  | 'yuji'
  | 'megumi'
  | 'nobara'
  | 'nanami'
  | 'maki'
  | 'toge'
  | 'panda';

const baseCharacters = {
  gojo: {
    baseName: '고죠 사토루',
    image: '/characters/gojo.png',
    officialCategory: 'sorcerer',
  },
  sukuna: {
    baseName: '료멘 스쿠나',
    image: '/characters/sukuna.png',
    officialCategory: 'curse-side',
  },
  yuta: {
    baseName: '옷코츠 유타',
    image: '/characters/yuta.png',
    officialCategory: 'tokyo-school',
  },
  toji: {
    baseName: '후시구로 토우지',
    image: '/characters/toji.png',
    officialCategory: 'curse-side',
  },
  mahito: {
    baseName: '마히토',
    image: '/characters/mahito.png',
    officialCategory: 'curse-side',
  },
  yuji: {
    baseName: '이타도리 유지',
    image: '/characters/yuji.png',
    officialCategory: 'tokyo-school',
  },
  megumi: {
    baseName: '후시구로 메구미',
    image: '/characters/megumi.png',
    officialCategory: 'tokyo-school',
  },
  nobara: {
    baseName: '쿠기사키 노바라',
    image: '/characters/nobara.png',
    officialCategory: 'tokyo-school',
  },
  nanami: {
    baseName: '나나미 켄토',
    image: '/characters/nanami.png',
    officialCategory: 'sorcerer',
  },
  maki: {
    baseName: '젠인 마키',
    image: '/characters/maki.png',
    officialCategory: 'tokyo-school',
  },
  toge: {
    baseName: '이누마키 토게',
    image: '/characters/toge.png',
    officialCategory: 'tokyo-school',
  },
  panda: {
    baseName: '판다',
    image: '/characters/panda.png',
    officialCategory: 'tokyo-school',
  },
} as const;

interface UnitSeed {
  id: string;
  baseKey: BaseCharacterKey;
  variantName: string;
  title: string;
  trait: CharacterDetail['trait'];
  combatType: CharacterDetail['combatType'];
  role: CharacterDetail['role'];
  tier: CharacterDetail['tier'];
  rarity: CharacterDetail['rarity'];
  releaseType: string;
  description: string;
  passive: string;
  skills: CharacterDetail['skills'];
  ultimate: CharacterDetail['ultimate'];
}

const createCharacter = (unit: UnitSeed): CharacterDetail => {
  const base = baseCharacters[unit.baseKey];

  return {
    id: unit.id,
    name: `${unit.variantName} ${base.baseName}`,
    baseName: base.baseName,
    variantName: unit.variantName,
    title: unit.title,
    image: base.image,
    trait: unit.trait,
    combatType: unit.combatType,
    role: unit.role,
    tier: unit.tier,
    rarity: unit.rarity,
    releaseType: unit.releaseType,
    officialCategory: base.officialCategory,
    description: unit.description,
    passive: unit.passive,
    skills: unit.skills,
    ultimate: unit.ultimate,
  };
};

const characterSeeds: UnitSeed[] = [
  {
    id: 'gojo-domain',
    baseKey: 'gojo',
    variantName: '무량공처',
    title: '광역 제압과 최고급 마무리 성능을 겸비한 핵심 한정 유닛',
    trait: 'illusion',
    combatType: 'hybrid',
    role: 'attacker',
    tier: 'SS',
    rarity: 'SSR',
    releaseType: '한정',
    description: '리세마라 상위권에서 가장 먼저 언급되는 고죠 변형 중 하나로, 영역 전개 중심의 전투 흐름을 장악하는 카드입니다.',
    passive: '전투 시작 시 자신의 술식과 체술 위력을 끌어올리고, 영역 전개 후에는 적 전체의 행동 효율을 크게 떨어뜨립니다.',
    skills: [
      {
        name: '아오',
        description: '적 전체의 위치를 무너뜨리며 피해와 행동 억제를 동시에 부여합니다.',
        cooldown: '3턴',
      },
      {
        name: '아카',
        description: '단일 적을 강하게 압박하고, 다음 필살기의 계수를 끌어올립니다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '무량공처',
      description: '전장 전체를 장악하는 대표 필살기로, 광역 피해와 강한 구속 효과를 함께 가합니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'yuji-zone',
    baseKey: 'yuji',
    variantName: '존',
    title: '2회 행동과 폭발적인 피니시를 가진 대표 리세마라 어태커',
    trait: 'action',
    combatType: 'physical',
    role: 'attacker',
    tier: 'SS',
    rarity: 'SSR',
    releaseType: '한정',
    description: '현재 리세마라와 범용 딜러 추천에서 자주 올라오는 유지 변형으로, 존 진입 이후의 턴 압박이 강력합니다.',
    passive: '존 상태에 진입하면 행동 게이지와 회심 효율을 끌어올려 연속 공세를 이어갑니다.',
    skills: [
      {
        name: '돌진 연격',
        description: '빠르게 파고들어 단일 대상에게 체술 피해를 누적합니다.',
        cooldown: '2턴',
      },
      {
        name: '흑섬 태세',
        description: '다음 공격의 회심 확률과 피해량을 동시에 끌어올립니다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '존 블랙 플래시',
      description: '존 상태에서 위력이 크게 상승하는 결정타 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'yuta-queen',
    baseKey: 'yuta',
    variantName: '여왕',
    title: '리카 연계로 공격과 보호를 함께 가져가는 최상위 특급 유닛',
    trait: 'shadow',
    combatType: 'hybrid',
    role: 'support',
    tier: 'SS',
    rarity: 'SSR',
    releaseType: '한정',
    description: '리세마라와 장기 운용 가치가 모두 높은 유타 변형으로, 공격과 지원을 동시에 충족시키는 올라운더입니다.',
    passive: '리카가 동행 중일 때 아군 보호막과 자신의 스킬 위력이 함께 상승합니다.',
    skills: [
      {
        name: '리카의 참격',
        description: '적을 절단하며 동시에 아군 전체의 피해 저항을 강화합니다.',
        cooldown: '3턴',
      },
      {
        name: '반전 지원',
        description: '체력이 낮은 아군을 우선 보조하고 디버프를 완화합니다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '사랑의 특급 주력',
      description: '광역 공격 뒤 아군을 회복하며 리카 연계를 강화합니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'sukuna-fuga',
    baseKey: 'sukuna',
    variantName: '후가',
    title: '현 메타 상위권 광역 마무리와 지속 압박을 가진 저주의 왕',
    trait: 'shadow',
    combatType: 'cursed',
    role: 'attacker',
    tier: 'SS',
    rarity: 'SSR',
    releaseType: '한정',
    description: '최신 최강 캐릭터 표에서 꾸준히 상단을 차지하는 숙나 변형으로, 스킬 배율과 필살기 마감력이 모두 뛰어납니다.',
    passive: '영역 전개 계열 스킬 사용 뒤 술식 위력을 누적시키고, 적의 지속 피해를 강화합니다.',
    skills: [
      {
        name: '해',
        description: '적을 절단하며 열상 효과를 부여합니다.',
        cooldown: '2턴',
      },
      {
        name: '화염 개방',
        description: '전방 범위를 태워 광역 술식 피해를 가합니다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '후가',
      description: '거대한 화염으로 전장을 태우는 숙나의 결정타 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'mahito-soul',
    baseKey: 'mahito',
    variantName: '영혼',
    title: '환 특성 디버프 메타를 여는 광역 약화 핵심 유닛',
    trait: 'illusion',
    combatType: 'hybrid',
    role: 'debuffer',
    tier: 'S',
    rarity: 'SSR',
    releaseType: '한정',
    description: '최신 지원형 메타에서 상위권으로 평가되는 마히토 변형으로, 환 특성 파티의 딜 증폭 기점이 됩니다.',
    passive: '적에게 걸린 약화 효과 수만큼 자신의 피해와 디버프 적중률이 상승합니다.',
    skills: [
      {
        name: '무위전변',
        description: '적 전체에 약화 중첩을 남기고 피해를 증폭시킵니다.',
        cooldown: '3턴',
      },
      {
        name: '영혼 침식',
        description: '단일 적의 영혼을 깎아 추가 피해 조건을 만듭니다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '영혼 파형',
      description: '광역 디버프와 폭발 피해를 함께 넣는 마히토의 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'toji-sorcerer-killer',
    baseKey: 'toji',
    variantName: '술사 살해자',
    title: '고배율 체술과 무주력 연계가 강한 단일 브레이커',
    trait: 'illusion',
    combatType: 'physical',
    role: 'breaker',
    tier: 'S',
    rarity: 'SSR',
    releaseType: '한정',
    description: '고난도 보스전에서 높은 타점과 브레이크 압박을 보여주는 토우지의 대표 변형입니다.',
    passive: '주력 소비 없이 행동할수록 체술 배율과 브레이크 효율이 상승합니다.',
    skills: [
      {
        name: '천역모 일격',
        description: '방어를 무시하며 강한 단일 체술 피해를 가합니다.',
        cooldown: '2턴',
      },
      {
        name: '흔적 없는 침투',
        description: '행동 게이지를 회복하고 다음 타격을 강화합니다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '특급 사냥',
      description: '단일 적을 확실히 마무리하는 고배율 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'megumi-incomplete-domain',
    baseKey: 'megumi',
    variantName: '불완전한 영역',
    title: '식신 전개와 유틸이 강한 범용 서브 캐리',
    trait: 'shadow',
    combatType: 'cursed',
    role: 'support',
    tier: 'S',
    rarity: 'SSR',
    releaseType: '한정',
    description: '식신 운용과 보조 화력을 함께 가져가는 메구미 변형으로, 다양한 편성에 넣기 좋은 유닛입니다.',
    passive: '식신이 남아있는 동안 아군 속도와 명중 보정을 끌어올립니다.',
    skills: [
      {
        name: '옥견 연계',
        description: '단일 적을 추격하며 아군 전체의 속도를 보조합니다.',
        cooldown: '3턴',
      },
      {
        name: '누에 전개',
        description: '적 전체에 술식 피해와 감전 계열 약화를 남깁니다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '불완전한 영역',
      description: '식신 다수를 동원해 전장 지배력을 높이는 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'nobara-steel',
    baseKey: 'nobara',
    variantName: '철골',
    title: '단일 고점이 높은 못 특화 디버프 어태커',
    trait: 'action',
    combatType: 'cursed',
    role: 'attacker',
    tier: 'A',
    rarity: 'SSR',
    releaseType: '일반',
    description: '초중반부터 확실한 단일 타점을 보여주는 노바라 변형으로, 보스전 압박 능력이 좋습니다.',
    passive: '못 중첩이 쌓일수록 대상이 받는 피해와 자신의 회심 효율이 상승합니다.',
    skills: [
      {
        name: '추령주법',
        description: '단일 대상에 못 스택과 술식 피해를 부여합니다.',
        cooldown: '2턴',
      },
      {
        name: '공명 준비',
        description: '다음 공명 계열 피해를 크게 증폭시킵니다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '비녀 공명',
      description: '중첩된 못을 폭발시켜 큰 단일 피해를 가합니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'nanami-overtime',
    baseKey: 'nanami',
    variantName: '시간외 노동',
    title: '안정적인 체술 누적과 후반 고점이 특징인 1급 술사',
    trait: 'action',
    combatType: 'hybrid',
    role: 'attacker',
    tier: 'A',
    rarity: 'SSR',
    releaseType: '일반',
    description: '꾸준한 브레이크 압박과 후반 폭발력을 갖춘 나나미 변형으로, 무난하게 데려가기 좋은 공격 카드입니다.',
    passive: '전투가 길어질수록 자신의 피해량과 치명 계수가 증가합니다.',
    skills: [
      {
        name: '십획 베기',
        description: '약점을 정밀하게 찌르며 브레이크를 유도합니다.',
        cooldown: '2턴',
      },
      {
        name: '초과근무 선언',
        description: '다음 턴 동안 자신의 공격 템포를 끌어올립니다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '시간외 일격',
      description: '고배율 일격으로 단일 적을 압박하는 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'maki-rebellious',
    baseKey: 'maki',
    variantName: '반골',
    title: '무주력 피지컬을 살린 초중반 전투형 어태커',
    trait: 'illusion',
    combatType: 'physical',
    role: 'attacker',
    tier: 'B',
    rarity: 'SSR',
    releaseType: '일반',
    description: '자원 부담이 적고 단순한 운영이 가능한 마키 변형으로, 초반 전개에서 쓰기 편한 카드입니다.',
    passive: '주력 소모 없이 공격할수록 다음 턴의 체술 위력이 상승합니다.',
    skills: [
      {
        name: '장병기 강타',
        description: '전방 대상에게 묵직한 물리 피해를 줍니다.',
        cooldown: '2턴',
      },
      {
        name: '거리 압박',
        description: '적의 체술 저항을 깎고 자신에게 방어 보정을 부여합니다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '반골의 전력 베기',
      description: '중거리에서 강한 일격을 날리는 체술 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'toge-determination',
    baseKey: 'toge',
    variantName: '각오',
    title: '상태 제어와 보조를 동시에 수행하는 주언형 서포터',
    trait: 'action',
    combatType: 'cursed',
    role: 'support',
    tier: 'B',
    rarity: 'SSR',
    releaseType: '일반',
    description: '행동 불가와 아군 보조를 함께 담당하는 토게 변형으로, 특정 기믹 대응에 강합니다.',
    passive: '상태이상에 걸린 적이 있으면 아군 전체의 술식 효율이 증가합니다.',
    skills: [
      {
        name: '멈춰',
        description: '단일 적의 행동을 봉쇄합니다.',
        cooldown: '3턴',
      },
      {
        name: '도망쳐',
        description: '아군에게 생존 보조 버프를 부여합니다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '부서져라',
      description: '전체 적을 밀어내며 상태이상 확률을 끌어올리는 필살기입니다.',
      cooldown: '궁극기',
    },
  },
  {
    id: 'panda-doll',
    baseKey: 'panda',
    variantName: '변이 주해',
    title: '도발과 반격으로 파티 전열을 지켜주는 안정형 방어 카드',
    trait: 'night',
    combatType: 'physical',
    role: 'defender',
    tier: 'C',
    rarity: 'SSR',
    releaseType: '일반',
    description: '초반 탱킹과 반격 운영을 담당하는 판다 변형으로, 버티는 전투에서 장점이 있습니다.',
    passive: '피격 횟수에 따라 반격률과 방어 계수가 누적 상승합니다.',
    skills: [
      {
        name: '판다 펀치',
        description: '전방 적을 밀어내며 도발을 유도합니다.',
        cooldown: '2턴',
      },
      {
        name: '수비 전환',
        description: '자신에게 방어 버프와 약한 회복 효과를 부여합니다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '고릴라 모드',
      description: '탱킹과 반격을 동시에 강화하는 판다의 필살기입니다.',
      cooldown: '궁극기',
    },
  },
];

export const mockCharacterDetails: CharacterDetail[] = characterSeeds.map(createCharacter);

export const mockCharacters: CharacterSummary[] = mockCharacterDetails.map(
  ({ description: _description, passive: _passive, skills: _skills, ultimate: _ultimate, ...summary }) => summary,
);

const tierHeadlines: Record<CharacterDetail['tier'], string> = {
  SS: '최신 리세마라와 메타 상위권에서 최우선으로 거론되는 변형 유닛.',
  S: '리세마라 상위권이거나 장기 운용 가치가 높은 우수한 핵심 카드.',
  A: '안정적으로 기용하기 좋은 범용 실전 카드.',
  B: '상황과 편성에 따라 채용 가치가 올라가는 보조 카드.',
  C: '초반 운영이나 특정 기믹 대응에 적합한 카드.',
};

export const mockTiers: TierGroup[] = tierOrder.map((tier) => ({
  tier,
  headline: tierHeadlines[tier],
  characterIds: mockCharacterDetails
    .filter((character) => character.tier === tier)
    .map((character) => character.id),
}));
