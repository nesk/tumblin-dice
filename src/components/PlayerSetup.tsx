import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { DieColor } from '@/types/game'
import { DIE_COLORS, DEFAULT_TARGET_SCORE } from '@/lib/constants'

interface PlayerSetupProps {
  onStart: (players: { name: string; color: DieColor }[], targetScore: number) => void
}

const COLORS: DieColor[] = ['red', 'green', 'blue', 'black']

export function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState<3 | 4>(4)
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE)
  const [players, setPlayers] = useState<{ name: string; color: DieColor }[]>([
    { name: '', color: 'red' },
    { name: '', color: 'green' },
    { name: '', color: 'blue' },
    { name: '', color: 'black' },
  ])

  const activePlayers = players.slice(0, playerCount)

  const handlePlayerCountChange = (value: string) => {
    if (value === '3' || value === '4') {
      const newCount = Number(value) as 3 | 4

      if (newCount === 4 && playerCount === 3) {
        // Passage de 3 à 4 : attribuer la première couleur disponible au joueur 4
        const usedColors = players.slice(0, 3).map((p) => p.color)
        const availableColor = COLORS.find((c) => !usedColors.includes(c)) || 'black'

        setPlayers((prev) => {
          const updated = [...prev]
          updated[3] = { ...updated[3], color: availableColor }
          return updated
        })
      }

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
      onStart(
        activePlayers.map((p) => ({ ...p, name: p.name.trim() })),
        targetScore
      )
    }
  }

  return (
    <div className="p-4 pb-24 flex flex-col gap-4 max-w-md mx-auto">
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
                    {COLORS.map((color) => (
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
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t">
        <Button
          onClick={() => handleSubmit()}
          className="w-full h-12 text-lg max-w-md mx-auto block"
          disabled={!isValid}
        >
          Commencer la partie
        </Button>
      </div>
    </div>
  )
}
