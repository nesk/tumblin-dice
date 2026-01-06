import { cn } from '@/lib/utils'

interface FixedBottomBarProps {
  children: React.ReactNode
  className?: string
}

export function FixedBottomBar({ children, className }: FixedBottomBarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-background border-t',
        className
      )}
    >
      {children}
    </div>
  )
}
