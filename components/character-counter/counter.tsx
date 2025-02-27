'use client'

import { useEffect, useState } from 'react'
import { Copy, Download, Share, Trash, Undo } from 'lucide-react'

// import AdBanner from '@/components/ads/ad-banner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import CounterStats from './counter-stats'
import KeyboardShortcuts from './keyboard-shortcuts'
import ReadingTime from './reading-time'
import SocialMediaLimits from './social-media-limits'
import TextAnalysis from './text-analysis'

export default function CharacterCounter() {
  const [text, setText] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Text statistics
  const characterCount = text.length
  const characterCountNoSpaces = text.replace(/\s/g, '').length
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const sentenceCount =
    text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length
  const paragraphCount =
    text.trim() === '' ? 0 : text.split(/\n+/).filter(Boolean).length
  const averageWordLength =
    wordCount === 0 ? 0 : characterCountNoSpaces / wordCount
  const readingTimeMinutes = Math.ceil(wordCount / 200) // Average reading speed of 200 words per minute

  // Save to history when text changes
  useEffect(() => {
    if (
      text &&
      (history.length === 0 || text !== history[history.length - 1])
    ) {
      // Only save history if debounced text is different from last saved
      const timeoutId = setTimeout(() => {
        setHistory((prev) => [...prev.slice(0, historyIndex + 1), text])
        setHistoryIndex((prev) => prev + 1)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [text, history, historyIndex])

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  // Clear text
  const handleClear = () => {
    // Save current text to history before clearing if it's not empty
    if (text) {
      setHistory((prev) => [...prev, text])
      setHistoryIndex((prev) => prev + 1)
    }
    setText('')
  }

  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  // Download text as .txt file
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'text-content.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Share text
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Character Counter Text',
          text: text,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      handleCopy()
    }
  }

  // Undo last action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setText(history[historyIndex - 1])
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              Enter your text
              <span className="text-muted-foreground ml-auto text-sm font-normal">
                {characterCount} characters
              </span>
            </CardTitle>
            <CardDescription>
              Type or paste your text below to count characters, words, and
              more.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  className="border-input bg-background focus-visible:ring-ring min-h-[300px] w-full resize-y rounded-md border p-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={handleTextChange}
                  aria-label="Text input for character counting"
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        <Trash className="mr-1 h-4 w-4" />
                        Clear
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear all text</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy to clipboard</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download as text file</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share className="mr-1 h-4 w-4" />
                        Share
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share text</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                      >
                        <Undo className="mr-1 h-4 w-4" />
                        Undo
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo last change</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Add Keyboard Shortcuts component */}
                <KeyboardShortcuts
                  onCopy={handleCopy}
                  onClear={handleClear}
                  onUndo={handleUndo}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <CounterStats
          characterCount={characterCount}
          characterCountNoSpaces={characterCountNoSpaces}
          wordCount={wordCount}
          sentenceCount={sentenceCount}
          paragraphCount={paragraphCount}
          averageWordLength={averageWordLength}
          readingTimeMinutes={readingTimeMinutes}
        />

        {/* Text Analysis component */}
        <TextAnalysis
          text={text}
          wordCount={wordCount}
          sentenceCount={sentenceCount}
        />
      </div>

      <div className="space-y-6">
        {/* Moved ReadingTime to right column */}
        <ReadingTime wordCount={wordCount} />

        <SocialMediaLimits currentCount={characterCount} />

        {/* Sidebar Ad */}
        {/* <div className="hidden lg:block">
          <AdBanner position="sidebar" />
        </div> */}
      </div>
    </div>
  )
}
