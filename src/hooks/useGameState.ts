import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { GameState, Player, RoundResult, DieColor } from '@/types/game'
import { STORAGE_KEY, DEFAULT_TARGET_SCORE } from '@/lib/constants'
import {
  calculateTotalScore,
  getPlayerRanking,
  shuffleArray,
  rotatePlayOrder,
} from '@/lib/scoring'

const initialGameState: GameState = {
  players: [],
  rounds: [],
  currentRound: 0,
  isGameOver: false,
  winnerId: null,
  targetScore: DEFAULT_TARGET_SCORE,
}

export function useGameState() {
  const [gameState, setGameState, clearStorage] = useLocalStorage<GameState>(
    STORAGE_KEY,
    initialGameState
  )

  const hasSavedGame = useMemo(() => {
    return gameState.players.length > 0 && gameState.currentRound > 0
  }, [gameState.players.length, gameState.currentRound])

  const initGame = useCallback(
    (players: { name: string; color: DieColor }[], targetScore: number) => {
      const newPlayers: Player[] = players.map((p, index) => ({
        id: `player-${index}`,
        name: p.name,
        color: p.color,
      }))

      const shuffledOrder = shuffleArray(newPlayers.map((p) => p.id))

      setGameState({
        players: newPlayers,
        rounds: [],
        currentRound: 1,
        isGameOver: false,
        winnerId: null,
        targetScore,
      })

      return shuffledOrder
    },
    [setGameState]
  )

  const getCurrentPlayOrder = useCallback((): string[] => {
    if (gameState.rounds.length === 0) {
      return shuffleArray(gameState.players.map((p) => p.id))
    }
    const lastRound = gameState.rounds[gameState.rounds.length - 1]
    return rotatePlayOrder(lastRound.playOrder)
  }, [gameState.rounds, gameState.players])

  const submitRoundResults = useCallback(
    (results: RoundResult[], playOrder: string[]) => {
      setGameState((prev) => {
        const newRound = {
          roundNumber: prev.currentRound,
          playOrder,
          results,
        }

        const newRounds = [...prev.rounds, newRound]
        const newState: GameState = {
          ...prev,
          rounds: newRounds,
          currentRound: prev.currentRound + 1,
        }

        // Check for winner
        const ranking = getPlayerRanking(newState)
        const winner = ranking.find((r) => r.totalScore >= prev.targetScore)

        if (winner) {
          newState.isGameOver = true
          newState.winnerId = winner.playerId
        }

        return newState
      })
    },
    [setGameState]
  )

  const resetGame = useCallback(() => {
    clearStorage()
  }, [clearStorage])

  const restartWithSamePlayers = useCallback(() => {
    if (gameState.players.length === 0) return

    const shuffledOrder = shuffleArray(gameState.players.map((p) => p.id))

    setGameState((prev) => ({
      ...prev,
      rounds: [],
      currentRound: 1,
      isGameOver: false,
      winnerId: null,
    }))

    return shuffledOrder
  }, [gameState.players, setGameState])

  const getPlayerById = useCallback(
    (id: string): Player | undefined => {
      return gameState.players.find((p) => p.id === id)
    },
    [gameState.players]
  )

  const getTotalScore = useCallback(
    (playerId: string): number => {
      return calculateTotalScore(gameState, playerId)
    },
    [gameState]
  )

  const ranking = useMemo(() => getPlayerRanking(gameState), [gameState])

  return {
    gameState,
    hasSavedGame,
    initGame,
    getCurrentPlayOrder,
    submitRoundResults,
    resetGame,
    restartWithSamePlayers,
    getPlayerById,
    getTotalScore,
    ranking,
  }
}
