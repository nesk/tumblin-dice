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
    <div className="p-3 pb-32 flex flex-col gap-3">
      {/* Header */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-lg text-center">
            Manche {currentRound}
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            Premier à {WINNING_SCORE} points gagne
          </p>
        </CardHeader>
      </Card>

      {/* Play Order */}
      <Card>
        <CardHeader className="pb-1 pt-2">
          <CardTitle className="text-base">Ordre de jeu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 pb-3">
          {playOrder.map((playerId, index) => {
            const player = getPlayer(playerId)
            if (!player) return null
            return (
              <div
                key={playerId}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-muted/50"
              >
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${DIE_COLORS[player.color].bgClass}`}
                />
                <span className="font-medium text-sm">{player.name}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Scoreboard */}
      <Card>
        <CardHeader className="pb-1 pt-2">
          <CardTitle className="text-base">Classement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 pb-3">
          {ranking.map((r) => {
            const player = getPlayer(r.playerId)
            if (!player) return null
            return (
              <div
                key={r.playerId}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <Badge
                  variant={r.position === 1 ? 'default' : 'secondary'}
                  className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs"
                >
                  {r.position}
                </Badge>
                <div
                  className={`w-3 h-3 rounded-full ${DIE_COLORS[player.color].bgClass}`}
                />
                <span className="font-medium flex-1 text-sm">{player.name}</span>
                <span className="text-lg font-bold tabular-nums">
                  {r.totalScore}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions - Fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t space-y-2">
        <Button onClick={onEnterScores} className="w-full h-12 text-base">
          Saisir les scores
        </Button>
        <Button
          onClick={onViewHistory}
          variant="outline"
          className="w-full h-10"
        >
          Historique
        </Button>
      </div>
    </div>
  )
}
