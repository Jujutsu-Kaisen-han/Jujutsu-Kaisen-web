export class CooldownSystem {
  private readonly endsAt = new Map<string, number>()
  start(id: string, now: number, duration: number): void { this.endsAt.set(id, now + duration) }
  remaining(id: string, now: number): number { return Math.max(0, (this.endsAt.get(id) ?? 0) - now) }
  ready(id: string, now: number): boolean { return this.remaining(id, now) === 0 }
}
