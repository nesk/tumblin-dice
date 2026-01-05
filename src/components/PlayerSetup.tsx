import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DieColor } from '@/types/game'
import { DIE_COLORS } from '@/lib/constants'

interface PlayerSetupProps {
  onStart: (players: { name: string; color: DieColor }[]) => void
}

const COLORS: DieColor[] = ['red', 'green', 'blue', 'black']

export function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [players, setPlayers] = useState<{ name: string; color: DieColor }[]>([
    { name: '', color: 'red' },
    { name: '', color: 'green' },
    { name: '', color: 'blue' },
    { name: '', color: 'black' },
  ])

  const updatePlayerName = (index: number, name: string) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? { ...p, name } : p)))
  }

  const updatePlayerColor = (index: number, color: DieColor) => {
    setPlayers((prev) => {
      const currentColor = prev[index].color
      const otherPlayerWithColor = prev.findIndex(
        (p, i) => i !== index && p.color === color
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

  const isValid = players.every((p) => p.name.trim().length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onStart(players.map((p) => ({ ...p, name: p.name.trim() })))
    }
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <Card className="flex-1 max-w-md mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Tumblin' Dice</CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            Entrez les noms des 4 joueurs
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {players.map((player, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">Joueur {index + 1}</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Nom du joueur ${index + 1}`}
                    value={player.name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updatePlayerColor(index, color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        DIE_COLORS[color].bgClass
                      } ${
                        player.color === color
                          ? 'ring-2 ring-offset-2 ring-primary scale-110'
                          : 'opacity-50 hover:opacity-75'
                      }`}
                      aria-label={DIE_COLORS[color].label}
                    />
                  ))}
                </div>
              </div>
            ))}

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={!isValid}
            >
              Commencer la partie
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
