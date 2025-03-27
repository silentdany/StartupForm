import { Info } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { appConfig } from '@/lib/config/app-config'

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
  // Use platforms from app configuration
  const platforms: PlatformLimit[] = appConfig.socialMedia.platforms

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
