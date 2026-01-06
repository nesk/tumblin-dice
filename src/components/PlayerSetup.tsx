import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { FixedBottomBar } from '@/components/ui/fixed-bottom-bar'
import type { DieColor } from '@/types/game'
import { DIE_COLORS, DEFAULT_TARGET_SCORE, DICE_PER_ROUND, DICE_PER_ROUND_2P } from '@/lib/constants'

interface PlayerSetupProps {
  onStart: (players: { name: string; color: DieColor }[], targetScore: number, dicePerRound: number) => void
}

const ALL_COLORS: DieColor[] = ['red', 'green', 'blue', 'black']
const TWO_PLAYER_COLORS: DieColor[] = ['blue', 'black']

export function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(4)
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE)
  const [players, setPlayers] = useState<{ name: string; color: DieColor }[]>([
    { name: '', color: 'red' },
    { name: '', color: 'green' },
    { name: '', color: 'blue' },
    { name: '', color: 'black' },
  ])

  const activePlayers = players.slice(0, playerCount)
  const availableColors = playerCount === 2 ? TWO_PLAYER_COLORS : ALL_COLORS

  const handlePlayerCountChange = (value: string) => {
    if (value === '2' || value === '3' || value === '4') {
      const newCount = Number(value) as 2 | 3 | 4

      setPlayers((prev) => {
        const updated = [...prev]

        if (newCount === 2) {
          // Mode 2 joueurs : forcer bleu et noir
          updated[0] = { ...updated[0], color: 'blue' }
          updated[1] = { ...updated[1], color: 'black' }
        } else if (playerCount === 2 && newCount > 2) {
          // Passage de 2 à 3 ou 4 : garder bleu/noir, attribuer les autres
          const usedColors: DieColor[] = ['blue', 'black']
          const freeColors = ALL_COLORS.filter((c) => !usedColors.includes(c))
          
          updated[0] = { ...updated[0], color: 'blue' }
          updated[1] = { ...updated[1], color: 'black' }
          updated[2] = { ...updated[2], color: freeColors[0] }
          if (newCount === 4) {
            updated[3] = { ...updated[3], color: freeColors[1] }
          }
        } else if (newCount > playerCount) {
          // Passage de 3 à 4 : attribuer la première couleur disponible au joueur 4
          const usedColors = updated.slice(0, newCount - 1).map((p) => p.color)
          const availableColor = ALL_COLORS.find((c) => !usedColors.includes(c)) || 'black'
          updated[newCount - 1] = { ...updated[newCount - 1], color: availableColor }
        }

        return updated
      })

      setPlayerCount(newCount)
    }
  }

  const updatePlayerName = (index: number, name: string) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? { ...p, name } : p)))
  }

  const updatePlayerColor = (index: number, color: DieColor) => {
    setPlayers((prev) => {
      const currentColor = prev[index].color
      // Ne chercher que parmi les joueurs actifs
      const otherPlayerWithColor = prev.findIndex(
        (p, i) => i !== index && i < playerCount && p.color === color
      )

      if (otherPlayerWithColor !== -1) {
        // Swap colors
        return prev.map((p, i) => {
          if (i === index) return { ...p, color }
          if (i === otherPlayerWithColor) return { ...p, color: currentColor }
          return p
        })
      }

      return prev.map((p, i) => (i === index ? { ...p, color } : p))
    })
  }

  const isValid =
    activePlayers.every((p) => p.name.trim().length > 0) &&
    targetScore >= 1 &&
    !isNaN(targetScore)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isValid) {
      const dicePerRound = playerCount === 2 ? DICE_PER_ROUND_2P : DICE_PER_ROUND
      onStart(
        activePlayers.map((p) => ({ ...p, name: p.name.trim() })),
        targetScore,
        dicePerRound
      )
    }
  }

  return (
    <div className="p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] flex flex-col gap-4 max-w-md mx-auto">
      {/* Header */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl text-center">Tumblin' Dice</CardTitle>
        </CardHeader>
      </Card>

      {/* Configuration */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Nombre de joueurs</span>
            <ToggleGroup
              type="single"
              variant="outline"
              value={String(playerCount)}
              onValueChange={handlePlayerCountChange}
            >
              <ToggleGroupItem value="2" className="w-10 h-8">
                2
              </ToggleGroupItem>
              <ToggleGroupItem value="3" className="w-10 h-8">
                3
              </ToggleGroupItem>
              <ToggleGroupItem value="4" className="w-10 h-8">
                4
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Score à atteindre</span>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              onFocus={(e) => e.target.select()}
              className="w-24 h-8 text-center"
            />
          </div>
        </CardContent>
      </Card>

      {/* Joueurs */}
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activePlayers.map((player, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Joueur {index + 1}</label>
                  <div className="flex gap-1.5">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updatePlayerColor(index, color)}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          DIE_COLORS[color].bgClass
                        } ${
                          player.color === color
                            ? 'ring-2 ring-offset-1 ring-primary scale-110'
                            : 'opacity-40 hover:opacity-70'
                        }`}
                        aria-label={DIE_COLORS[color].label}
                      />
                    ))}
                  </div>
                </div>
                <Input
                  type="text"
                  placeholder={`Nom du joueur ${index + 1}`}
                  value={player.name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                />
              </div>
            ))}
          </form>
        </CardContent>
      </Card>

      {/* Bouton fixe en bas */}
      <FixedBottomBar>
        <Button
          onClick={() => handleSubmit()}
          className="w-full h-12 text-lg max-w-md mx-auto block"
          disabled={!isValid}
        >
          Commencer la partie
        </Button>
      </FixedBottomBar>
    </div>
  )
}
