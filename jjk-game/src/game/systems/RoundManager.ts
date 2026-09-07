export interface RoundResult { winner: 'P1' | 'P2' | 'DRAW'; matchOver: boolean; p1Rounds: number; p2Rounds: number }

export class RoundManager {
  round = 1
  p1Rounds = 0
  p2Rounds = 0
  record(winner: 'P1' | 'P2' | 'DRAW'): RoundResult {
    if (winner === 'P1') this.p1Rounds += 1
    if (winner === 'P2') this.p2Rounds += 1
    return { winner, matchOver: this.p1Rounds >= 2 || this.p2Rounds >= 2, p1Rounds: this.p1Rounds, p2Rounds: this.p2Rounds }
  }
  nextRound(): void { this.round += 1 }
}
