import type { DieColor, Zone } from '@/types/game'

export const DEFAULT_TARGET_SCORE = 301

export const DICE_PER_ROUND = 4
export const DICE_PER_ROUND_2P = 5

export const DIE_COLORS: Record<DieColor, { label: string; bgClass: string; textClass: string }> = {
  red: {
    label: 'Rouge',
    bgClass: 'bg-red-500',
    textClass: 'text-red-500',
  },
  green: {
    label: 'Vert',
    bgClass: 'bg-green-500',
    textClass: 'text-green-500',
  },
  blue: {
    label: 'Bleu',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-500',
  },
  black: {
    label: 'Noir',
    bgClass: 'bg-gray-900 dark:bg-gray-700',
    textClass: 'text-gray-900 dark:text-gray-300',
  },
}

export const ZONES: { value: Zone; label: string; className: string }[] = [
  { value: -1, label: 'x-1', className: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' },
  { value: 1, label: 'x1', className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600' },
  { value: 2, label: 'x2', className: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
  { value: 3, label: 'x3', className: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
  { value: 4, label: 'x4', className: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' },
]

export const DIE_VALUES = [1, 2, 3, 4, 5, 6] as const

export const STORAGE_KEY = 'tumblin-dice-game'

// Couleurs de fond pour les dés sélectionnés (par zone)
export const ZONE_BG_COLORS: Record<Zone, string> = {
  [-1]: 'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100',
  1: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100',
  2: 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100',
  3: 'bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-100',
  4: 'bg-purple-200 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100',
}
