export type DieColor = 'red' | 'green' | 'blue' | 'black'

export type Zone = -1 | 1 | 2 | 3 | 4

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6

export interface Player {
  id: string
  name: string
  color: DieColor
}

export interface DieResult {
  value: DieValue
  zone: Zone
}

export interface RoundResult {
  playerId: string
  dice: DieResult[]
  roundScore: number
}

export interface Round {
  roundNumber: number
  playOrder: string[]
  results: RoundResult[]
}

export interface GameState {
  players: Player[]
  rounds: Round[]
  currentRound: number
  isGameOver: boolean
  winnerId: string | null
}

export type Screen = 'setup' | 'game' | 'input' | 'history' | 'gameover'
