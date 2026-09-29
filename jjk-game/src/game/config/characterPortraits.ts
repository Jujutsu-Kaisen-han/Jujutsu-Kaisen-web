import type { CharacterId } from '../types/CharacterTypes'

/**
 * Character art confirmed from the official Jujutsu Kaisen character pages.
 * The game keeps the vector body as a local fallback when a remote image is
 * unavailable (for example, when a browser blocks cross-origin image loads).
 */
export const CHARACTER_PORTRAIT_URLS: Record<CharacterId, string> = {
  yuta: 'https://jujutsukaisen.jp/images/chara_category1/chara_name13.png',
  uro: 'https://jujutsukaisen.jp/images/chara_shimetsu/chara_name26.png',
  gojo: 'https://jujutsukaisen.jp/images/chara_category1/chara_name7.png',
  sukuna: 'https://jujutsukaisen.jp/images/chara_category4/chara_name99.png',
  yuji: 'https://jujutsukaisen.jp/images/chara_category1/chara_name1.png',
  megumi: 'https://jujutsukaisen.jp/images/chara_category1/chara_name2.png',
}

export function characterPortraitKey(id: CharacterId): string {
  return `character-portrait-${id}`
}
