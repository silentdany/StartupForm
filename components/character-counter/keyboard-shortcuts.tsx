'use client'

import { useEffect } from 'react'
import { Keyboard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface KeyboardShortcutsProps {
  onClear: () => void
  onCopy: () => void
  onUndo: () => void
}

export default function KeyboardShortcuts({
  onClear,
  onCopy,
  onUndo,
}: KeyboardShortcutsProps) {
  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for modifier keys (Ctrl or Command)
      const isModifierKey = e.ctrlKey || e.metaKey

      if (isModifierKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            if (window.getSelection()?.toString() === '') {
              e.preventDefault()
              onCopy()
            }
            break
          case 'backspace':
            e.preventDefault()
            onClear()
            break
          case 'z':
            e.preventDefault()
            onUndo()
            break
          default:
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClear, onCopy, onUndo])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Keyboard className="mr-1 h-4 w-4" />
                Shortcuts
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-3" align="end">
              <div className="space-y-3">
                <p className="text-sm font-medium">Keyboard Shortcuts</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ShortcutKey>Ctrl/⌘</ShortcutKey>
                      <span>+</span>
                      <ShortcutKey>C</ShortcutKey>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      Copy all text
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ShortcutKey>Ctrl/⌘</ShortcutKey>
                      <span>+</span>
                      <ShortcutKey>⌫</ShortcutKey>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      Clear text
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ShortcutKey>Ctrl/⌘</ShortcutKey>
                      <span>+</span>
                      <ShortcutKey>Z</ShortcutKey>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      Undo changes
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>View keyboard shortcuts</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Helper component for styling keyboard keys
function ShortcutKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-muted text-muted-foreground inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none">
      {children}
    </kbd>
  )
}
