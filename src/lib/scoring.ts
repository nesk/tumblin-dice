import type { DieResult, DieValue, GameState, Zone } from '@/types/game'

export function calculateDieScore(value: DieValue, zone: Zone): number {
  return value * zone
}

export function calculateRoundScore(dice: DieResult[]): number {
  return dice.reduce((total, die) => total + calculateDieScore(die.value, die.zone), 0)
}

export function calculateTotalScore(gameState: GameState, playerId: string): number {
  return gameState.rounds.reduce((total, round) => {
    const result = round.results.find((r) => r.playerId === playerId)
    return total + (result?.roundScore ?? 0)
  }, 0)
}

export interface PlayerRanking {
  playerId: string
  name: string
  color: string
  totalScore: number
  position: number
}

export function getPlayerRanking(gameState: GameState): PlayerRanking[] {
  const scores = gameState.players.map((player) => ({
    playerId: player.id,
    name: player.name,
    color: player.color,
    totalScore: calculateTotalScore(gameState, player.id),
    position: 0,
  }))

  scores.sort((a, b) => b.totalScore - a.totalScore)

  let currentPosition = 1
  for (let i = 0; i < scores.length; i++) {
    if (i > 0 && scores[i].totalScore < scores[i - 1].totalScore) {
      currentPosition = i + 1
    }
    scores[i].position = currentPosition
  }

  return scores
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function rotatePlayOrder(currentOrder: string[]): string[] {
  if (currentOrder.length === 0) return []
  const [first, ...rest] = currentOrder
  return [...rest, first]
}
