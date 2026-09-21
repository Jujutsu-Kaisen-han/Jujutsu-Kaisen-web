export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

export function easeOutCubic(value: number): number {
  const t = clamp01(value)
  return 1 - (1 - t) ** 3
}

export function easeInOutSine(value: number): number {
  return -(Math.cos(Math.PI * clamp01(value)) - 1) / 2
}

export function easeOutBack(value: number, overshoot = 1.70158): number {
  const clamped = clamp01(value)
  if (clamped === 0 || clamped === 1) return clamped
  const t = clamped - 1
  return 1 + (overshoot + 1) * t ** 3 + overshoot * t ** 2
}

/** Frame-rate independent smoothing for velocities and visual offsets. */
export function damp(current: number, target: number, sharpness: number, deltaSeconds: number): number {
  return current + (target - current) * (1 - Math.exp(-sharpness * Math.max(0, deltaSeconds)))
}

export interface AttackMotionPhase {
  anticipation: number
  impact: number
  recovery: number
}

export function attackMotionPhase(progress: number): AttackMotionPhase {
  const t = clamp01(progress)
  return {
    anticipation: 1 - easeOutCubic(Math.min(1, t / 0.25)),
    impact: Math.sin(Math.PI * clamp01((t - 0.2) / 0.42)),
    recovery: easeInOutSine(Math.max(0, (t - 0.58) / 0.42)),
  }
}
