import assert from 'node:assert/strict'
import test from 'node:test'
import { attackMotionPhase, damp, easeOutBack } from '../src/game/animation/MotionMath.ts'

test('모션 이징은 입력 범위를 안전하게 유지한다', () => {
  assert.equal(easeOutBack(-1), 0)
  assert.equal(easeOutBack(2), 1)
  assert.equal(attackMotionPhase(0).anticipation, 1)
  assert.equal(attackMotionPhase(1).recovery, 1)
})

test('댐핑은 현재값과 목표값 사이를 프레임 독립적으로 좁힌다', () => {
  const next = damp(0, 100, 18, 1 / 60)

  assert.ok(next > 0)
  assert.ok(next < 100)
  assert.equal(damp(100, 100, 18, 1 / 60), 100)
})
