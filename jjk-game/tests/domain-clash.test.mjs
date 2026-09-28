import assert from 'node:assert/strict'
import test from 'node:test'
import { DomainClashSystem } from '../src/game/systems/DomainClashSystem.ts'

test('영역 충돌은 50:50으로 시작한다', () => {
  const clash = new DomainClashSystem()

  assert.deepEqual(clash.snapshot(), { p1: 50, p2: 50 })
})

test('명중한 공격자의 영역 게이지가 피해량에 비례해 올라간다', () => {
  const clash = new DomainClashSystem()

  const result = clash.applyHit('P1', 25)

  assert.equal(result.shift, 20)
  assert.deepEqual(result.snapshot, { p1: 70, p2: 30 })
  assert.equal(result.winner, null)
})

test('게이지가 완전히 밀리면 즉시 공격자 영역이 승리한다', () => {
  const clash = new DomainClashSystem()

  const result = clash.applyHit('P2', 70)

  assert.deepEqual(result.snapshot, { p1: 0, p2: 100 })
  assert.equal(result.winner, 'P2')
})

test('시간 종료 시 더 높은 게이지가 승리하고 동률은 상쇄된다', () => {
  const p1Lead = new DomainClashSystem()
  p1Lead.applyHit('P1', 10)
  assert.equal(p1Lead.resolve(), 'P1')

  const even = new DomainClashSystem()
  assert.equal(even.resolve(), 'DRAW')
})
