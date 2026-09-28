import assert from 'node:assert/strict'
import test from 'node:test'
import { CHARACTER_DEFINITIONS } from '../src/game/types/CharacterTypes.ts'

const gojo = CHARACTER_DEFINITIONS.gojo

test('고죠의 기본 공격과 강공격 피해가 상향되어 있다', () => {
  assert.equal(gojo.stats.attackDamage, 15)
  assert.equal(gojo.stats.strongDamage, 32)
  assert.ok(gojo.stats.attackDamage > CHARACTER_DEFINITIONS.yuta.stats.attackDamage)
  assert.ok(gojo.stats.strongDamage > CHARACTER_DEFINITIONS.sukuna.stats.strongDamage)
})

test('고죠의 핵심 술식 피해가 상향되어 있다', async () => {
  const { GOJO_TECHNIQUES } = await import('../src/game/skills/CharacterSkillSystem.ts')

  assert.deepEqual(GOJO_TECHNIQUES.map(({ damage }) => damage), [22, 32, 42, 0, 115])
})
