import { Info } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SocialMediaLimitsProps {
  currentCount: number
}

interface PlatformLimit {
  name: string
  limit: number
  color: string
}

export default function SocialMediaLimits({
  currentCount,
}: SocialMediaLimitsProps) {
  const platforms: PlatformLimit[] = [
    { name: 'Twitter/X', limit: 280, color: 'bg-blue-400 dark:bg-blue-500' },
    { name: 'SMS', limit: 160, color: 'bg-green-400 dark:bg-green-500' },
    {
      name: 'Instagram Caption',
      limit: 2200,
      color: 'bg-pink-400 dark:bg-pink-500',
    },
    { name: 'LinkedIn Post', limit: 3000, color: 'bg-sky-400 dark:bg-sky-500' },
    {
      name: 'Facebook Post',
      limit: 63206,
      color: 'bg-indigo-400 dark:bg-indigo-500',
    },
    {
      name: 'TikTok Caption',
      limit: 2200,
      color: 'bg-purple-400 dark:bg-purple-500',
    },
    {
      name: 'Reddit Title',
      limit: 300,
      color: 'bg-orange-400 dark:bg-orange-500',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          Social Media Limits
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground ml-2 h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Character limits for popular platforms. Bars show how much of
                  the limit you&apos;ve used.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platforms.map((platform) => (
            <PlatformLimitBar
              key={platform.name}
              platform={platform}
              currentCount={currentCount}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PlatformLimitBarProps {
  platform: PlatformLimit
  currentCount: number
}

function PlatformLimitBar({ platform, currentCount }: PlatformLimitBarProps) {
  const percentage = Math.min(
    100,
    Math.round((currentCount / platform.limit) * 100)
  )

  // Determine color class based on percentage
  const getColorClass = () => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 90) return 'bg-amber-500'
    return platform.color
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{platform.name}</span>
        <span className={percentage >= 100 ? 'font-medium text-red-500' : ''}>
          {currentCount} / {platform.limit}
        </span>
      </div>
      <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{percentage}% used</span>
        <span>{platform.limit - currentCount} characters left</span>
      </div>
    </div>
  )
}
