import { createCharacterPoster } from '@/entities/character/lib/createCharacterPoster';
import type { CharacterDetail, CharacterSummary, TierGroup } from '@/entities/character/model/types/character';

interface CharacterSeed extends Omit<CharacterDetail, 'image'> {
  accent: string;
  shadow: string;
}

const characterSeeds: CharacterSeed[] = [
  {
    id: 'gojo-infinity',
    name: '고죠 사토루',
    title: '무한을 관장하는 최강',
    element: 'light',
    role: 'attacker',
    tier: 'SS',
    releaseType: '한정',
    description: '광역 딜링과 생존, 브레이크 압박을 모두 갖춘 최상위 캐리. 스테이지 범용성이 매우 높다.',
    passive: '체력 70% 이상일 때 치명타 피해가 상승하고, 배리어가 파괴되면 즉시 반격 버프를 얻는다.',
    skills: [
      {
        name: '술식 순전 청',
        description: '전방 범위 적에게 광속성 피해를 주고 방어력 감소를 부여한다.',
        cooldown: '3턴',
      },
      {
        name: '허식 자',
        description: '단일 적을 강하게 압박하며 브레이크 게이지를 크게 감소시킨다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '무량공처',
      description: '전체 적에게 큰 피해를 입히고 행동 불가 디버프를 부여하는 강력한 필살기.',
      cooldown: '궁극기',
    },
    accent: '#67e8f9',
    shadow: '#0f3d58',
  },
  {
    id: 'sukuna-calamity',
    name: '료멘 스쿠나',
    title: '재앙을 찢는 저주의 왕',
    element: 'dark',
    role: 'attacker',
    tier: 'SS',
    releaseType: '한정',
    description: '폭발적인 단일 화력과 출혈 누적 능력을 동시에 제공하는 보스전 특화 딜러.',
    passive: '출혈 상태의 적을 공격하면 추가 타격이 발생하고, 처치 시 궁극기 게이지를 회복한다.',
    skills: [
      {
        name: '해',
        description: '단일 적에게 연속 베기 피해를 주고 출혈을 2중첩 부여한다.',
        cooldown: '2턴',
      },
      {
        name: '화염개방',
        description: '직선 범위 적에게 암속성 폭발 피해를 주며 받는 회복량을 감소시킨다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '복마어주자',
      description: '전장 전체에 영역을 펼쳐 지속 피해를 남기고, 보스에게는 추가 계수를 적용한다.',
      cooldown: '궁극기',
    },
    accent: '#f97316',
    shadow: '#431407',
  },
  {
    id: 'yuta-queen',
    name: '옷코츠 유타',
    title: '리카와 동행하는 특급',
    element: 'light',
    role: 'support',
    tier: 'S',
    releaseType: '한정',
    description: '회복, 보호막, 보조 딜까지 수행하는 하이브리드 유닛으로 장기전 안정성이 좋다.',
    passive: '아군이 체력 50% 이하가 되면 한 번 보호막을 자동 부여하고, 자신의 궁극기 게이지를 획득한다.',
    skills: [
      {
        name: '리카의 가호',
        description: '아군 전체에게 보호막과 공격력 증가를 부여한다.',
        cooldown: '3턴',
      },
      {
        name: '모방 술식',
        description: '선택한 아군 역할에 따라 추가 보정 효과를 제공한다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '사랑의 저주',
      description: '적 전체를 공격한 뒤 아군 전체를 회복하며 약화 효과를 1개 해제한다.',
      cooldown: '궁극기',
    },
    accent: '#fde68a',
    shadow: '#1f2937',
  },
  {
    id: 'toji-shadow',
    name: '후시구로 토우지',
    title: '주력 없는 암살자',
    element: 'wind',
    role: 'breaker',
    tier: 'S',
    releaseType: '한정',
    description: '브레이크 게이지 파괴와 후열 진입 능력이 탁월해 고난도 던전에서 평가가 높다.',
    passive: '브레이크 상태의 적을 공격하면 속도 버프를 얻고, 회피율이 상승한다.',
    skills: [
      {
        name: '천역모',
        description: '적 한 명에게 강한 풍속성 피해를 가하고 브레이크 효율을 상승시킨다.',
        cooldown: '2턴',
      },
      {
        name: '도살 본능',
        description: '자신의 치명타 확률과 행동 게이지를 증가시킨다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '특급 사냥',
      description: '보스에게 추가 계수를 지닌 일격을 가하고, 방어력 무시 효과를 적용한다.',
      cooldown: '궁극기',
    },
    accent: '#22c55e',
    shadow: '#052e16',
  },
  {
    id: 'mahito-idle',
    name: '마히토',
    title: '영혼을 가지고 노는 특급 주령',
    element: 'dark',
    role: 'debuffer',
    tier: 'S',
    releaseType: '일반',
    description: '광역 약화와 지속 피해 누적이 뛰어나 다수전과 장기전에 모두 강하다.',
    passive: '약화 효과가 걸린 적을 타격하면 영혼 침식 스택을 쌓고, 최대치에서 추가 피해가 발동한다.',
    skills: [
      {
        name: '무위전변',
        description: '적 전체에게 공격력 감소와 중독을 부여한다.',
        cooldown: '3턴',
      },
      {
        name: '영혼 압착',
        description: '단일 적에게 암속성 피해를 주고, 이미 걸린 디버프 수에 따라 추가 타격한다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '편살살',
      description: '범위 피해와 함께 적의 버프를 제거하고, 중독 지속 시간을 늘린다.',
      cooldown: '궁극기',
    },
    accent: '#a855f7',
    shadow: '#2e1065',
  },
  {
    id: 'yuji-black-flash',
    name: '이타도리 유지',
    title: '흑섬을 두드리는 돌격수',
    element: 'fire',
    role: 'attacker',
    tier: 'A',
    releaseType: '일반',
    description: '세팅이 단순하고 즉발 화력이 좋아 초중반 진행이 편한 밸런스형 딜러.',
    passive: '치명타 발생 시 다음 스킬 피해가 증가하며, 연속 타격 후 행동 게이지를 회복한다.',
    skills: [
      {
        name: '주먹 연격',
        description: '단일 적에게 연속 타격을 가하고 낮은 확률로 기절을 유발한다.',
        cooldown: '2턴',
      },
      {
        name: '흑섬 준비',
        description: '다음 공격의 치명타율과 피해량을 크게 높인다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '흑섬',
      description: '고배율 단일 피해를 가하고, 치명타 시 추가 폭발 피해를 준다.',
      cooldown: '궁극기',
    },
    accent: '#fb7185',
    shadow: '#4c0519',
  },
  {
    id: 'megumi-shikigami',
    name: '후시구로 메구미',
    title: '십종영법술의 전략가',
    element: 'water',
    role: 'support',
    tier: 'A',
    releaseType: '일반',
    description: '식신 운용을 통한 유틸이 강점이며, 콘텐츠에 따라 가치가 크게 올라가는 조합형 서포터.',
    passive: '식신이 남아 있으면 아군 전체의 속도와 명중이 증가한다.',
    skills: [
      {
        name: '옥견 소환',
        description: '아군 전체의 속도를 올리고, 적 하나에게 추격 효과를 부여한다.',
        cooldown: '3턴',
      },
      {
        name: '누에',
        description: '적 전체에게 수속성 피해를 주고 감전 디버프를 부여한다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '영역전개 미완성',
      description: '식신을 다수 전개해 전체 공격과 함께 아군 버프 지속 시간을 연장한다.',
      cooldown: '궁극기',
    },
    accent: '#60a5fa',
    shadow: '#0f172a',
  },
  {
    id: 'nobara-resonance',
    name: '쿠기사키 노바라',
    title: '공명으로 꿰뚫는 주술사',
    element: 'fire',
    role: 'debuffer',
    tier: 'A',
    releaseType: '일반',
    description: '못 중첩과 방어력 감소를 통해 딜 상승을 보조하는 서브 딜러.',
    passive: '디버프가 많은 적을 공격할수록 추가 피해가 증가한다.',
    skills: [
      {
        name: '추령주법',
        description: '단일 적에게 화속성 피해를 주고 못 스택을 부여한다.',
        cooldown: '2턴',
      },
      {
        name: '공명',
        description: '못 스택을 폭발시켜 방어력 감소와 지속 피해를 적용한다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '비녀',
      description: '전체 적의 못 스택을 모두 폭발시키며 큰 피해를 준다.',
      cooldown: '궁극기',
    },
    accent: '#f43f5e',
    shadow: '#3f0d1b',
  },
  {
    id: 'nanami-overtime',
    name: '나나미 켄토',
    title: '초과근무에 들어간 1급 술사',
    element: 'earth',
    role: 'breaker',
    tier: 'B',
    releaseType: '일반',
    description: '안정적인 단일 브레이크와 중상위 딜링을 제공하는 실전형 캐릭터.',
    passive: '전투 시간이 길어질수록 공격력과 브레이크 효율이 점진적으로 상승한다.',
    skills: [
      {
        name: '십획주법',
        description: '약점을 정확히 찌르는 단일 공격으로 브레이크 수치를 크게 깎는다.',
        cooldown: '2턴',
      },
      {
        name: '냉정한 판단',
        description: '자신의 받는 피해를 감소시키고 다음 공격의 안정성을 높인다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '초과근무',
      description: '강력한 일격으로 보스에게 추가 피해를 입히며, 자신의 속도를 높인다.',
      cooldown: '궁극기',
    },
    accent: '#facc15',
    shadow: '#422006',
  },
  {
    id: 'maki-heavenly',
    name: '젠인 마키',
    title: '육체를 단련한 무기술사',
    element: 'wind',
    role: 'tank',
    tier: 'B',
    releaseType: '일반',
    description: '전열 유지력과 도발 성능이 좋아 파티 안정성을 담당하기 좋다.',
    passive: '도발 상태일 때 피해 감소가 증가하고, 반격 시 브레이크 수치를 감소시킨다.',
    skills: [
      {
        name: '강타',
        description: '적 하나를 공격하고 도발을 건다.',
        cooldown: '2턴',
      },
      {
        name: '무기 전개',
        description: '자신의 방어력과 반격 확률을 상승시킨다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '전력 타격',
      description: '전방 범위 적에게 피해를 주고 아군 전체에게 받는 피해 감소를 부여한다.',
      cooldown: '궁극기',
    },
    accent: '#4ade80',
    shadow: '#14532d',
  },
  {
    id: 'toge-cursed-speech',
    name: '이누마키 토게',
    title: '주언으로 전장을 묶는 서포터',
    element: 'water',
    role: 'support',
    tier: 'C',
    releaseType: '일반',
    description: '행동 제어는 좋지만 화력 기여가 낮아 특정 스테이지에서만 선택되는 편.',
    passive: '행동 불가에 걸린 적이 있으면 아군 전체의 상태이상 적중률이 상승한다.',
    skills: [
      {
        name: '멈춰',
        description: '적 하나에게 행동 불가를 부여한다.',
        cooldown: '3턴',
      },
      {
        name: '도망쳐',
        description: '아군 전체에게 회피율 증가 버프를 준다.',
        cooldown: '4턴',
      },
    ],
    ultimate: {
      name: '폭발해라',
      description: '전체 적에게 수속성 피해를 주고 확률적으로 침묵을 건다.',
      cooldown: '궁극기',
    },
    accent: '#38bdf8',
    shadow: '#082f49',
  },
  {
    id: 'panda-guard',
    name: '판다',
    title: '든든하게 버티는 괴이한 선배',
    element: 'earth',
    role: 'tank',
    tier: 'C',
    releaseType: '일반',
    description: '초반 생존 보조에 유용하지만 후반으로 갈수록 탱커 경쟁력이 떨어진다.',
    passive: '체력이 낮을수록 방어력과 회복 효율이 증가한다.',
    skills: [
      {
        name: '판다 펀치',
        description: '전방 적에게 피해를 주고 자신에게 보호막을 부여한다.',
        cooldown: '2턴',
      },
      {
        name: '수비 태세',
        description: '아군 전체의 방어력을 올리고 자신이 도발한다.',
        cooldown: '3턴',
      },
    ],
    ultimate: {
      name: '고릴라 모드',
      description: '자신의 체력을 회복하고 적 전체의 공격력을 낮춘다.',
      cooldown: '궁극기',
    },
    accent: '#cbd5e1',
    shadow: '#334155',
  },
];

export const mockCharacterDetails: CharacterDetail[] = characterSeeds.map(
  ({ accent, shadow, ...character }) => ({
    ...character,
    image: createCharacterPoster({
      name: character.name,
      title: character.title,
      accent,
      shadow,
    }),
  }),
);

export const mockCharacters: CharacterSummary[] = mockCharacterDetails.map(
  ({ description: _description, passive: _passive, skills: _skills, ultimate: _ultimate, ...summary }) => summary,
);

export const mockTiers: TierGroup[] = [
  {
    tier: 'SS',
    headline: '현 메타 최상위. 대부분의 콘텐츠에서 중심이 되는 핵심 픽.',
    characterIds: ['gojo-infinity', 'sukuna-calamity'],
  },
  {
    tier: 'S',
    headline: '조합 가치가 높고, 고난도에서 선택률이 매우 높은 우수한 캐릭터.',
    characterIds: ['yuta-queen', 'toji-shadow', 'mahito-idle'],
  },
  {
    tier: 'A',
    headline: '범용성이 좋고 육성 효율이 높은 주력 후보군.',
    characterIds: ['yuji-black-flash', 'megumi-shikigami', 'nobara-resonance'],
  },
  {
    tier: 'B',
    headline: '상황에 따라 기용되는 실전형 캐릭터.',
    characterIds: ['nanami-overtime', 'maki-heavenly'],
  },
  {
    tier: 'C',
    headline: '특정 기믹 대응이나 초반 육성 단계에서 고려할 수 있는 픽.',
    characterIds: ['toge-cursed-speech', 'panda-guard'],
  },
];
