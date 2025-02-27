'use client'

import { useEffect, useState } from 'react'
import {
  Book,
  Clock,
  Coffee,
  Film,
  Headphones,
  MessageSquare,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ReadingTimeProps {
  wordCount: number
}

export default function ReadingTime({ wordCount }: ReadingTimeProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Animation when component mounts
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Calculate various times
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200)) // Average reading speed: 200 words per minute

  const speakingTimeMinutes = Math.max(1, Math.ceil(wordCount / 150)) // Average speaking speed: 150 words per minute
  const speakingTimeSeconds = Math.ceil(wordCount / (150 / 60))

  const skimmingTimeMinutes = Math.max(1, Math.ceil(wordCount / 400)) // Average skimming speed: 400 words per minute
  const skimmingTimeSeconds = Math.ceil(wordCount / (400 / 60))

  // Convert to time format
  const formatTime = (minutes: number) => {
    if (minutes < 1) return 'Less than a minute'
    if (minutes === 1) return '1 minute'
    return `${minutes} minutes`
  }

  // Calculate visual indicators
  const getTimeEmoji = (minutes: number) => {
    if (minutes <= 1) return '☕' // Coffee
    if (minutes <= 3) return '🎵' // Music
    if (minutes <= 5) return '🎧' // Podcast
    if (minutes <= 10) return '📺' // Short video
    if (minutes <= 20) return '📱' // Social media session
    return '📚' // Book
  }

  const getProgress = (minutes: number) => {
    // Map 1-30 minutes to 5-100%
    const progress = Math.min(100, Math.max(5, minutes * 3.33))
    return `${progress}%`
  }

  const getProgressColor = (minutes: number) => {
    if (minutes <= 2) return 'bg-green-500'
    if (minutes <= 5) return 'bg-blue-500'
    if (minutes <= 10) return 'bg-yellow-500'
    if (minutes <= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <Card
      className={`transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          Reading & Content Time
          <span className="text-muted-foreground ml-auto text-sm font-normal">
            {wordCount} words
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Single most important reading time */}
        <div className="mb-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Book className="text-primary mr-2 h-4 w-4" />
                    <span className="font-medium">Reading Time</span>
                  </div>
                  <div className="text-2xl font-semibold">
                    {formatTime(readingTimeMinutes)}
                  </div>
                  <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(readingTimeMinutes)}`}
                      style={{ width: getProgress(readingTimeMinutes) }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Based on average reading speed of 200 words per minute</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Other times in horizontal layout */}
        <div className="grid grid-cols-2 gap-3">
          {/* Speaking Time */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <MessageSquare className="text-primary mr-2 h-4 w-4" />
                    <span className="font-medium">Speaking</span>
                  </div>
                  <div className="font-semibold">
                    {formatTime(speakingTimeMinutes)}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {getTimeEmoji(speakingTimeMinutes)} {speakingTimeSeconds}s
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Based on average speaking speed of 150 words per minute</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Skimming Time */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Clock className="text-primary mr-2 h-4 w-4" />
                    <span className="font-medium">Skimming</span>
                  </div>
                  <div className="font-semibold">
                    {formatTime(skimmingTimeMinutes)}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {getTimeEmoji(skimmingTimeMinutes)} {skimmingTimeSeconds}s
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Based on average skimming speed of 400 words per minute</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="border-muted text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-dashed p-4 text-sm">
          <div className="flex items-center">
            <Coffee className="mr-1 h-4 w-4" />
            <span>1 min = ☕ coffee sip</span>
          </div>
          <div className="flex items-center">
            <Headphones className="mr-1 h-4 w-4" />
            <span>5 min = 🎧 short podcast</span>
          </div>
          <div className="flex items-center">
            <Film className="mr-1 h-4 w-4" />
            <span>10 min = 📺 quick video</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
