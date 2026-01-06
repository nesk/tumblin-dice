import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FixedBottomBar } from '@/components/ui/fixed-bottom-bar'
import type { Player } from '@/types/game'
import type { PlayerRanking } from '@/lib/scoring'
import { DIE_COLORS } from '@/lib/constants'

interface GameOverProps {
  winner: Player
  ranking: PlayerRanking[]
  players: Player[]
  roundsPlayed: number
  onRestartSamePlayers: () => void
  onNewGame: () => void
}

export function GameOver({
  winner,
  ranking,
  players,
  roundsPlayed,
  onRestartSamePlayers,
  onNewGame,
}: GameOverProps) {
  const getPlayer = (id: string) => players.find((p) => p.id === id)

  useEffect(() => {
    const end = Date.now() + 500

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return (
    <div className="min-h-dvh p-4 pb-[calc(8rem+env(safe-area-inset-bottom))] flex flex-col gap-4">
      {/* Winner announcement */}
      <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-300 dark:border-yellow-700">
        <CardHeader>
          <CardTitle className="text-center">
            <span className="text-4xl block mb-2">Victoire !</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className={`w-8 h-8 rounded-full ${DIE_COLORS[winner.color].bgClass}`}
            />
            <span className="text-3xl font-bold">{winner.name}</span>
          </div>
          <p className="text-muted-foreground">
            en {roundsPlayed} manche{roundsPlayed > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Final ranking */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Classement final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ranking.map((r) => {
            const player = getPlayer(r.playerId)
            if (!player) return null
            const isWinner = r.playerId === winner.id
            return (
              <div
                key={r.playerId}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isWinner
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700'
                    : 'bg-muted/50'
                }`}
              >
                <Badge
                  variant={r.position === 1 ? 'default' : 'secondary'}
                  className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                >
                  {r.position}
                </Badge>
                <div
                  className={`w-4 h-4 rounded-full ${DIE_COLORS[player.color].bgClass}`}
                />
                <span className="font-medium flex-1">{player.name}</span>
                <span className="text-xl font-bold tabular-nums">
                  {r.totalScore}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions - Fixed bottom */}
      <FixedBottomBar className="space-y-2">
        <Button onClick={onRestartSamePlayers} className="w-full h-14 text-lg">
          Rejouer (mêmes joueurs)
        </Button>
        <Button
          onClick={onNewGame}
          variant="outline"
          className="w-full h-12"
        >
          Nouvelle partie
        </Button>
      </FixedBottomBar>
    </div>
  )
}
