import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Player } from '@/types/game'
import type { PlayerRanking } from '@/lib/scoring'
import { DIE_COLORS, WINNING_SCORE } from '@/lib/constants'

interface GameBoardProps {
  currentRound: number
  playOrder: string[]
  players: Player[]
  ranking: PlayerRanking[]
  onEnterScores: () => void
  onViewHistory: () => void
}

export function GameBoard({
  currentRound,
  playOrder,
  players,
  ranking,
  onEnterScores,
  onViewHistory,
}: GameBoardProps) {
  const getPlayer = (id: string) => players.find((p) => p.id === id)

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">
            Manche {currentRound}
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            Premier à {WINNING_SCORE} points gagne
          </p>
        </CardHeader>
      </Card>

      {/* Play Order */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Ordre de jeu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {playOrder.map((playerId, index) => {
            const player = getPlayer(playerId)
            if (!player) return null
            return (
              <div
                key={playerId}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
              >
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div
                  className={`w-4 h-4 rounded-full ${DIE_COLORS[player.color].bgClass}`}
                />
                <span className="font-medium">{player.name}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Scoreboard */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Classement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ranking.map((r) => {
            const player = getPlayer(r.playerId)
            if (!player) return null
            return (
              <div
                key={r.playerId}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
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

      {/* Actions */}
      <div className="space-y-2">
        <Button onClick={onEnterScores} className="w-full h-14 text-lg">
          Saisir les scores de la manche
        </Button>
        <Button
          onClick={onViewHistory}
          variant="outline"
          className="w-full h-12"
        >
          Voir l'historique
        </Button>
      </div>
    </div>
  )
}
