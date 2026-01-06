import { useState, useEffect, useMemo } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { PlayerSetup } from '@/components/PlayerSetup'
import { GameBoard } from '@/components/GameBoard'
import { DiceInput } from '@/components/DiceInput'
import { RoundHistory } from '@/components/RoundHistory'
import { GameOver } from '@/components/GameOver'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Screen, DieColor, RoundResult } from '@/types/game'
import { shuffleArray } from '@/lib/scoring'

function App() {
  const {
    gameState,
    hasSavedGame,
    initGame,
    getCurrentPlayOrder,
    submitRoundResults,
    resetGame,
    restartWithSamePlayers,
    getPlayerById,
    ranking,
  } = useGameState()

  const [screen, setScreen] = useState<Screen>('setup')
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [currentPlayOrder, setCurrentPlayOrder] = useState<string[]>([])

  // Check for saved game on mount
  useEffect(() => {
    if (hasSavedGame && !gameState.isGameOver) {
      setShowResumeDialog(true)
    }
  }, [])

  // Compute play order for current round
  const playOrder = useMemo(() => {
    if (currentPlayOrder.length > 0) return currentPlayOrder
    if (gameState.players.length === 0) return []
    return getCurrentPlayOrder()
  }, [gameState.players, gameState.rounds, currentPlayOrder, getCurrentPlayOrder])

  const handleResumeGame = () => {
    setShowResumeDialog(false)
    setCurrentPlayOrder(getCurrentPlayOrder())
    setScreen('game')
  }

  const handleNewGame = () => {
    setShowResumeDialog(false)
    resetGame()
    setCurrentPlayOrder([])
    setScreen('setup')
  }

  const handleStartGame = (players: { name: string; color: DieColor }[], targetScore: number, dicePerRound: number) => {
    initGame(players, targetScore, dicePerRound)
    const order = shuffleArray(players.map((_, i) => `player-${i}`))
    setCurrentPlayOrder(order)
    setScreen('game')
  }

  const handleEnterScores = () => {
    setScreen('input')
  }

  const handleSubmitRound = (results: RoundResult[], order: string[]) => {
    submitRoundResults(results, order)
    setCurrentPlayOrder([]) // Will be recalculated
    // Screen transition handled by useEffect watching gameState.isGameOver
    setScreen('game')
  }

  const handleRestartSamePlayers = () => {
    const order = restartWithSamePlayers()
    if (order) {
      setCurrentPlayOrder(order)
      setScreen('game')
    }
  }

  // Handle screen based on game state
  useEffect(() => {
    if (gameState.isGameOver && screen !== 'gameover') {
      setScreen('gameover')
    }
  }, [gameState.isGameOver, screen])

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const winner = gameState.winnerId
    ? getPlayerById(gameState.winnerId)
    : undefined

  return (
    <div className="min-h-dvh bg-background">
      {/* Resume Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partie en cours</DialogTitle>
            <DialogDescription>
              Une partie est déjà en cours (Manche {gameState.currentRound}).
              Voulez-vous la reprendre ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleNewGame} className="w-full sm:w-auto">
              Nouvelle partie
            </Button>
            <Button onClick={handleResumeGame} className="w-full sm:w-auto">
              Reprendre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Screens */}
      {screen === 'setup' && <PlayerSetup onStart={handleStartGame} />}

      {screen === 'game' && (
        <GameBoard
          currentRound={gameState.currentRound}
          playOrder={playOrder}
          players={gameState.players}
          ranking={ranking}
          targetScore={gameState.targetScore}
          onEnterScores={handleEnterScores}
          onViewHistory={() => setScreen('history')}
        />
      )}

      {screen === 'input' && (
        <DiceInput
          currentRound={gameState.currentRound}
          playOrder={playOrder}
          players={gameState.players}
          dicePerRound={gameState.dicePerRound}
          onSubmit={handleSubmitRound}
          onCancel={() => setScreen('game')}
        />
      )}

      {screen === 'history' && (
        <RoundHistory
          gameState={gameState}
          players={gameState.players}
          rounds={gameState.rounds}
          onBack={() => setScreen('game')}
        />
      )}

      {screen === 'gameover' && winner && (
        <GameOver
          winner={winner}
          ranking={ranking}
          players={gameState.players}
          roundsPlayed={gameState.rounds.length}
          onRestartSamePlayers={handleRestartSamePlayers}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  )
}

export default App
