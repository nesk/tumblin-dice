import { useState, useMemo, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FixedBottomBar } from '@/components/ui/fixed-bottom-bar'
import type { Player, DieResult, DieValue, Zone, RoundResult } from '@/types/game'
import {
  DIE_COLORS,
  DIE_VALUES,
  ZONES,
  DICE_PER_ROUND,
  ZONE_BG_COLORS,
} from '@/lib/constants'
import { calculateRoundScore } from '@/lib/scoring'
import { cn } from '@/lib/utils'

interface DiceInputProps {
  currentRound: number
  playOrder: string[]
  players: Player[]
  onSubmit: (results: RoundResult[], playOrder: string[]) => void
  onCancel: () => void
}

interface PlayerDiceState {
  [playerId: string]: DieResult[]
}

// Composant pour un slot de dé (vide ou rempli)
function DieSlot({
  die,
  onRemove,
}: {
  die: DieResult | null
  onRemove?: () => void
}) {
  if (!die) {
    return (
      <div className="w-12 h-14 rounded-lg border-2 border-dashed border-muted-foreground/30" />
    )
  }

  const zoneConfig = ZONES.find((z) => z.value === die.zone)

  return (
    <button
      onClick={onRemove}
      className={cn(
        'relative w-12 h-14 rounded-lg border-2 transition-all active:scale-95',
        ZONE_BG_COLORS[die.zone],
        'border-transparent hover:border-destructive/50'
      )}
    >
      <span className="text-xl font-bold">{die.value}</span>
      <span className="absolute bottom-0.5 right-1 text-[10px] font-medium opacity-75">
        {zoneConfig?.label}
      </span>
    </button>
  )
}

// Composant pour l'écran de récap
function RoundRecap({
  currentRound,
  playOrder,
  players,
  allDice,
  onModify,
  onValidate,
}: {
  currentRound: number
  playOrder: string[]
  players: Player[]
  allDice: PlayerDiceState
  onModify: () => void
  onValidate: () => void
}) {
  const getPlayer = (id: string) => players.find((p) => p.id === id)

  return (
    <div className="p-3 pb-[calc(8rem+env(safe-area-inset-bottom))] flex flex-col gap-3">
      <Card>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-lg text-center">
            Récap Manche {currentRound}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-3">
          {playOrder.map((playerId) => {
            const player = getPlayer(playerId)
            if (!player) return null
            const dice = allDice[playerId] || []
            const score = calculateRoundScore(dice)
            return (
              <div
                key={playerId}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full',
                    DIE_COLORS[player.color].bgClass
                  )}
                />
                <span className="font-medium flex-1">{player.name}</span>
                <span
                  className={cn(
                    'text-lg font-bold tabular-nums',
                    score < 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'
                  )}
                >
                  {score > 0 ? '+' : ''}
                  {score}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions - Fixed bottom */}
      <FixedBottomBar className="space-y-2">
        <Button onClick={onValidate} className="w-full h-12 text-lg">
          Valider la manche
        </Button>
        <Button variant="outline" onClick={onModify} className="w-full h-10">
          Modifier
        </Button>
      </FixedBottomBar>
    </div>
  )
}

export function DiceInput({
  currentRound,
  playOrder,
  players,
  onSubmit,
  onCancel,
}: DiceInputProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [showRecap, setShowRecap] = useState(false)
  const [allDice, setAllDice] = useState<PlayerDiceState>(() => {
    const initial: PlayerDiceState = {}
    playOrder.forEach((playerId) => {
      initial[playerId] = []
    })
    return initial
  })

  const currentPlayerId = playOrder[currentPlayerIndex]
  const currentPlayer = players.find((p) => p.id === currentPlayerId)
  const currentDice = allDice[currentPlayerId] || []

  const currentRoundScore = useMemo(
    () => calculateRoundScore(currentDice),
    [currentDice]
  )

  const isLastPlayer = currentPlayerIndex === playOrder.length - 1
  const hasFourDice = currentDice.length === DICE_PER_ROUND

  // Ajouter un dé
  const addDie = useCallback(
    (value: DieValue) => {
      if (selectedZone === null || currentDice.length >= DICE_PER_ROUND) return

      const newDie: DieResult = { value, zone: selectedZone }
      setAllDice((prev) => ({
        ...prev,
        [currentPlayerId]: [...(prev[currentPlayerId] || []), newDie],
      }))
    },
    [selectedZone, currentDice.length, currentPlayerId]
  )

  // Retirer un dé
  const removeDie = useCallback(
    (index: number) => {
      setAllDice((prev) => ({
        ...prev,
        [currentPlayerId]: prev[currentPlayerId].filter((_, i) => i !== index),
      }))
    },
    [currentPlayerId]
  )

  // Reset zone quand on change de joueur
  useEffect(() => {
    setSelectedZone(null)
  }, [currentPlayerIndex])

  const handlePrevious = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1)
    }
  }

  const handleNext = () => {
    if (isLastPlayer) {
      setShowRecap(true)
    } else {
      setCurrentPlayerIndex((prev) => prev + 1)
    }
  }

  const handleSubmit = () => {
    const results: RoundResult[] = playOrder.map((playerId) => ({
      playerId,
      dice: allDice[playerId],
      roundScore: calculateRoundScore(allDice[playerId]),
    }))
    onSubmit(results, playOrder)
  }

  if (!currentPlayer) return null

  // Écran de récap
  if (showRecap) {
    return (
      <RoundRecap
        currentRound={currentRound}
        playOrder={playOrder}
        players={players}
        allDice={allDice}
        onModify={() => {
          setShowRecap(false)
          setCurrentPlayerIndex(0)
        }}
        onValidate={handleSubmit}
      />
    )
  }

  return (
    <div className="p-3 pb-[calc(5rem+env(safe-area-inset-bottom))] flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 py-1">
        <span className="font-semibold">Manche {currentRound}</span>
        <span className="text-muted-foreground">—</span>
        <div
          className={cn(
            'w-4 h-4 rounded-full',
            DIE_COLORS[currentPlayer.color].bgClass
          )}
        />
        <span className="font-medium">{currentPlayer.name}</span>
        <span className="text-muted-foreground text-sm">
          ({currentPlayerIndex + 1}/{playOrder.length})
        </span>
      </div>

      {/* Dés sélectionnés */}
      <Card>
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Dés ({currentDice.length}/{DICE_PER_ROUND})
            </span>
            <span
              className={cn(
                'text-lg font-bold tabular-nums',
                currentRoundScore < 0
                  ? 'text-red-500'
                  : currentRoundScore > 0
                    ? 'text-green-600 dark:text-green-400'
                    : ''
              )}
            >
              {currentRoundScore > 0 ? '+' : ''}
              {currentRoundScore} pts
            </span>
          </div>
          <div className="flex justify-center gap-2">
            {Array.from({ length: DICE_PER_ROUND }).map((_, index) => (
              <DieSlot
                key={index}
                die={currentDice[index] || null}
                onRemove={
                  currentDice[index] ? () => removeDie(index) : undefined
                }
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1.5">
            Touchez un dé pour le retirer
          </p>
        </CardContent>
      </Card>

      {/* Sélecteur de zones */}
      <Card>
        <CardContent className="pt-3 pb-3">
          <label className="text-sm text-muted-foreground mb-1 block">
            Zone
          </label>
          <div className="flex justify-center gap-1.5">
            {ZONES.map((zone) => (
              <button
                key={zone.value}
                onClick={() => setSelectedZone(zone.value)}
                disabled={currentDice.length >= DICE_PER_ROUND}
                className={cn(
                  'w-11 h-10 rounded-lg text-xs font-bold border-2 transition-all',
                  zone.className,
                  selectedZone === zone.value
                    ? 'ring-2 ring-primary ring-offset-1 scale-105'
                    : 'opacity-70 hover:opacity-100',
                  currentDice.length >= DICE_PER_ROUND && 'opacity-40 cursor-not-allowed'
                )}
              >
                {zone.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur de valeurs */}
      <Card>
        <CardContent className="pt-3 pb-3">
          <label className="text-sm text-muted-foreground mb-1 block">
            Valeur du dé
          </label>
          <div className="flex justify-center gap-1.5">
            {DIE_VALUES.map((value) => (
              <button
                key={value}
                onClick={() => addDie(value)}
                disabled={
                  selectedZone === null || currentDice.length >= DICE_PER_ROUND
                }
                className={cn(
                  'w-11 h-11 rounded-lg text-lg font-bold border-2 transition-all',
                  selectedZone !== null && currentDice.length < DICE_PER_ROUND
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 active:scale-95'
                    : 'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50'
                )}
              >
                {value}
              </button>
            ))}
          </div>
          {selectedZone === null && currentDice.length < DICE_PER_ROUND && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Sélectionnez d'abord une zone
            </p>
          )}
        </CardContent>
      </Card>

      {/* Navigation - Fixed bottom */}
      <FixedBottomBar className="flex gap-2">
        {currentPlayerIndex === 0 ? (
          <Button variant="outline" onClick={onCancel} className="flex-1 h-11">
            Annuler
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex-1 h-11"
          >
            Précédent
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!hasFourDice}
          className="flex-1 h-11"
        >
          {isLastPlayer ? 'Terminer' : 'Suivant'}
        </Button>
      </FixedBottomBar>
    </div>
  )
}
