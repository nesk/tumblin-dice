import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Player, Round } from '@/types/game'
import { DIE_COLORS, ZONES } from '@/lib/constants'
import { calculateTotalScore } from '@/lib/scoring'
import type { GameState } from '@/types/game'

interface RoundHistoryProps {
  gameState: GameState
  players: Player[]
  rounds: Round[]
  onBack: () => void
}

export function RoundHistory({
  gameState,
  players,
  rounds,
  onBack,
}: RoundHistoryProps) {
  const getPlayer = (id: string) => players.find((p) => p.id === id)

  const getZoneLabel = (zone: number) => {
    const z = ZONES.find((z) => z.value === zone)
    return z?.label ?? zone.toString()
  }

  const getCumulativeScore = (playerId: string, upToRound: number): number => {
    const partialState: GameState = {
      ...gameState,
      rounds: gameState.rounds.slice(0, upToRound),
    }
    return calculateTotalScore(partialState, playerId)
  }

  if (rounds.length === 0) {
    return (
      <div className="min-h-screen p-4 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Aucune manche jouée pour le moment.
            </p>
          </CardContent>
        </Card>
        <Button onClick={onBack} className="w-full h-12">
          Retour
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">Historique</CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            {rounds.length} manche{rounds.length > 1 ? 's' : ''} jouée
            {rounds.length > 1 ? 's' : ''}
          </p>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto">
        <Accordion type="single" collapsible className="space-y-2">
          {[...rounds].reverse().map((round) => (
            <AccordionItem
              key={round.roundNumber}
              value={`round-${round.roundNumber}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">Manche {round.roundNumber}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {round.results.map((result) => {
                    const player = getPlayer(result.playerId)
                    if (!player) return null
                    const cumulativeScore = getCumulativeScore(
                      result.playerId,
                      round.roundNumber
                    )
                    return (
                      <div
                        key={result.playerId}
                        className="p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${DIE_COLORS[player.color].bgClass}`}
                          />
                          <span className="font-medium flex-1">
                            {player.name}
                          </span>
                          <span
                            className={`font-bold ${
                              result.roundScore < 0 ? 'text-red-500' : ''
                            }`}
                          >
                            {result.roundScore > 0 ? '+' : ''}
                            {result.roundScore}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            (Total: {cumulativeScore})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.dice.map((die, i) => (
                            <span
                              key={i}
                              className="text-xs bg-background px-2 py-1 rounded border"
                            >
                              {die.value} {getZoneLabel(die.zone)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Button onClick={onBack} className="w-full h-12">
        Retour
      </Button>
    </div>
  )
}
