export type CharacterId = 'yuta' | 'uro' | 'gojo' | 'sukuna' | 'yuji' | 'megumi'
export type PlayerSlot = 'P1' | 'P2'
export type GameMode = 'local' | 'solo'

export interface CharacterStats {
  maxHp: number
  maxEnergy: number
  moveSpeed: number
  jumpPower: number
  attackDamage: number
  strongDamage: number
  defense: number
}

export interface CharacterDefinition {
  id: CharacterId
  name: string
  title: string
  color: number
  accent: string
  stats: CharacterStats
  style: string
}

export const CHARACTER_DEFINITIONS: Record<CharacterId, CharacterDefinition> = {
  yuta: { id: 'yuta', name: '옷코츠 유타', title: '검술 & 복사술식', color: 0x2d9eea, accent: '#73e6ff', stats: { maxHp: 112, maxEnergy: 200, moveSpeed: 250, jumpPower: 590, attackDamage: 12, strongDamage: 22, defense: 1 }, style: '검과 높은 주력의 올라운더' },
  uro: { id: 'uro', name: '우로 타카코', title: '공간 조작', color: 0x9f7cff, accent: '#c6b4ff', stats: { maxHp: 96, maxEnergy: 100, moveSpeed: 285, jumpPower: 640, attackDamage: 10, strongDamage: 18, defense: 0.9 }, style: '변칙적인 중거리 카운터' },
  gojo: { id: 'gojo', name: '고죠 사토루', title: '무하한 & 육안', color: 0x65d9f4, accent: '#9cefff', stats: { maxHp: 105, maxEnergy: 100, moveSpeed: 235, jumpPower: 575, attackDamage: 11, strongDamage: 25, defense: 0.75 }, style: '육안으로 술식 소모를 극한까지 줄이는 원거리형' },
  sukuna: { id: 'sukuna', name: '료멘 스쿠나', title: '참격 & 압박', color: 0xd94d76, accent: '#ff7eaa', stats: { maxHp: 118, maxEnergy: 400, moveSpeed: 265, jumpPower: 570, attackDamage: 14, strongDamage: 26, defense: 1.05 }, style: '유타의 2배 주력으로 압박하는 파이터' },
  yuji: { id: 'yuji', name: '이타도리 유지', title: '신체능력 & 흑섬', color: 0xff835e, accent: '#ffad78', stats: { maxHp: 120, maxEnergy: 100, moveSpeed: 300, jumpPower: 625, attackDamage: 13, strongDamage: 21, defense: 0.95 }, style: '빠르고 쉬운 근접 격투형' },
  megumi: { id: 'megumi', name: '후시구로 메구미', title: '십종영법술', color: 0x526cbd, accent: '#91aaff', stats: { maxHp: 100, maxEnergy: 100, moveSpeed: 235, jumpPower: 570, attackDamage: 10, strongDamage: 20, defense: 1 }, style: '식신으로 전장을 장악하는 소환형' },
}

export const CHARACTER_ORDER: CharacterId[] = ['yuta', 'uro', 'gojo', 'sukuna', 'yuji', 'megumi']
