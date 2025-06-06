'use client'

import { GoalStatus } from '@/types/db'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  ExternalLink,
  Flame,
  FolderOpen,
  Heart,
  MessageCircle,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Goal {
  id: string
  description: string
  targetDate: string
  status: GoalStatus
  createdAt: string
  updatedAt: string
  userId: string
  cheerCount?: number
  isCheeredByUser?: boolean
  flameCount?: number
  user?: {
    id: string
    name: string
    image?: string | null
    twitterHandle?: string | null
    twitterAvatarUrl?: string | null
    twitterVerified?: boolean
  }
  project?: {
    id: string
    name: string
    description?: string | null
    url?: string | null
    image?: string | null
    coupons?: string | null
  } | null
}

interface GoalCardProps {
  goal: Goal
  isOwner?: boolean
  showUser?: boolean
  currentUserId?: string
}

export function GoalCard({
  goal,
  isOwner = false,
  showUser = false,
  currentUserId,
}: GoalCardProps) {
  const queryClient = useQueryClient()

  const shipGoalMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/goals/${goal.id}/ship`, {
        method: 'PUT',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to ship goal')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['public-goals'] })
      toast.success('Goal shipped! 🚀')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const failGoalMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/goals/${goal.id}/fail`, {
        method: 'PUT',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to mark goal as failed')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['public-goals'] })
      toast.success('Goal marked as failed')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const cheerMutation = useMutation({
    mutationFn: async () => {
      const method = goal.isCheeredByUser ? 'DELETE' : 'POST'
      const response = await fetch(`/api/goals/${goal.id}/cheer`, {
        method,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update cheer')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-goals'] })
      const action = goal.isCheeredByUser ? 'removed' : 'added'
      toast.success(`Cheer ${action}!`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const remindMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/goals/${goal.id}/remind`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send reminder')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Reminder sent! ⏰')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const flameMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/goals/${goal.id}/flame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send flame')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-goals'] })
      toast.success('Flame sent! 🔥')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  function getStatusIcon() {
    switch (goal.status) {
      case 'shipped':
        return <Trophy className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600 sm:h-5 sm:w-5" />
      default:
        return <Target className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
    }
  }

  function getStatusColor() {
    switch (goal.status) {
      case 'shipped':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50'
      case 'failed':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50'
      default:
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50'
    }
  }

  const isOverdue =
    new Date(goal.targetDate) < new Date() && goal.status === 'active'
  const canCheer = currentUserId && !isOwner && currentUserId !== goal.userId

  // Check if goal is nearing deadline (within 24 hours) for reminders
  const now = new Date()
  const targetDate = new Date(goal.targetDate)
  const timeDiff = targetDate.getTime() - now.getTime()
  const hoursUntilDeadline = timeDiff / (1000 * 3600)
  const canRemind =
    currentUserId &&
    !isOwner &&
    goal.status === 'active' &&
    hoursUntilDeadline <= 24 &&
    hoursUntilDeadline > 0

  const canFlame =
    currentUserId &&
    !isOwner &&
    (goal.status === 'failed' || (goal.status === 'active' && isOverdue))

  const handleTwitterShare = () => {
    const baseUrl = 'https://twitter.com/intent/tweet'
    let text = ''

    if (goal.status === 'shipped') {
      text = `🚀 Just shipped my goal: "${goal.description}"! #buildinpublic #shipit`
    } else if (goal.status === 'active') {
      text = `🎯 Working on: "${goal.description}" - Target: ${format(new Date(goal.targetDate), 'MMM d, yyyy')} #buildinpublic #goals`
    } else {
      text = `📝 My goal: "${goal.description}" #buildinpublic`
    }

    if (goal.project?.name) {
      text += ` for ${goal.project.name}`
    }

    const url = `${baseUrl}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card
      className={`${getStatusColor()} ${isOverdue ? 'border-red-300 dark:border-red-700' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-base sm:text-lg">
              {goal.status.toUpperCase()}
            </CardTitle>
          </div>
          {showUser && goal.user && (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                <AvatarImage
                  src={
                    goal.user.twitterAvatarUrl || goal.user.image || undefined
                  }
                />
                <AvatarFallback className="text-xs">
                  {goal.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <a
                  href={`/users/${goal.user.id}`}
                  className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                >
                  {goal.user.name}
                </a>
                {goal.user.twitterHandle && (
                  <>
                    <span className="text-muted-foreground text-xs">•</span>
                    <a
                      href={`https://twitter.com/${goal.user.twitterHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      @{goal.user.twitterHandle}
                      {goal.user.twitterVerified && (
                        <svg
                          className="h-3 w-3 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <CardDescription className="text-foreground text-sm font-medium sm:text-base">
          {goal.description}
        </CardDescription>

        {/* Project Showcase */}
        {goal.project && (
          <div className="relative mt-4 overflow-hidden rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            {/* Background Image with Fade */}
            {goal.project.image && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage: `url(${goal.project.image})`,
                  maskImage:
                    'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
                }}
              />
            )}

            <div className="relative z-10 p-4">
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Project Image */}
                  {goal.project.image ? (
                    <div className="flex-shrink-0">
                      <img
                        src={goal.project.image}
                        alt={goal.project.name}
                        className="h-10 w-10 rounded-lg border border-white/20 object-cover shadow-md md:h-12 md:w-12"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-md md:h-12 md:w-12">
                      <FolderOpen className="h-5 w-5 text-white md:h-6 md:w-6" />
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-semibold text-gray-900 md:text-base dark:text-gray-100">
                        {goal.project.name}
                      </h4>
                    </div>

                    {/* Project Description */}
                    {goal.project.description && (
                      <p className="line-clamp-1 text-xs text-gray-600 md:line-clamp-2 md:text-sm dark:text-gray-400">
                        {goal.project.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons - Stack on mobile */}
                <div className="flex flex-col space-y-2 md:flex-shrink-0 md:flex-row md:items-center md:space-y-0 md:space-x-2">
                  {/* Visit Project Button */}
                  {goal.project.url && (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full bg-white/90 text-xs text-gray-900 shadow-md hover:bg-white md:w-auto md:text-sm dark:bg-gray-800/90 dark:text-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        if (goal.project?.url) {
                          window.open(
                            goal.project.url,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                      }}
                    >
                      <ExternalLink className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      Visit Project
                    </Button>
                  )}

                  {/* Coupon/Special Offer */}
                  {goal.project.coupons && (
                    <Badge
                      className="w-full cursor-pointer justify-center bg-amber-100 text-xs text-amber-800 hover:bg-amber-200 md:w-auto md:justify-start dark:bg-amber-900/50 dark:text-amber-200"
                      onClick={() => {
                        if (goal.project?.coupons) {
                          navigator.clipboard.writeText(goal.project.coupons)
                        }
                        toast.success('Coupon code copied!')
                      }}
                    >
                      🎁 {goal.project.coupons}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 dark:to-black/10" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>
              Target: {format(new Date(goal.targetDate), 'MMM d, yyyy h:mm a')}
            </span>
            {isOverdue && (
              <span className="font-medium text-red-500 dark:text-red-400">
                (Overdue)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Twitter Share Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleTwitterShare}
              className="text-xs text-blue-600 hover:text-blue-700 sm:text-sm dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.206 2.25h3.308l-7.227 8.26 8.503 11.24H16.69l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1 2.25H8.18l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="ml-1 hidden sm:inline">Share</span>
            </Button>

            {/* Remind Button */}
            {canRemind && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => remindMutation.mutate()}
                disabled={remindMutation.isPending}
                className="text-xs text-blue-600 hover:text-blue-700 sm:text-sm dark:text-blue-400 dark:hover:text-blue-300"
              >
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 hidden sm:inline">Remind</span>
              </Button>
            )}

            {/* Flame Button */}
            {canFlame && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => flameMutation.mutate()}
                disabled={flameMutation.isPending}
                className="text-xs text-orange-600 hover:text-orange-700 sm:text-sm dark:text-orange-400 dark:hover:text-orange-300"
              >
                <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
                {goal.flameCount !== undefined && goal.flameCount > 0 && (
                  <span className="ml-1">{goal.flameCount}</span>
                )}
              </Button>
            )}

            {/* Cheer Button */}
            {canCheer && (
              <Button
                size="sm"
                variant={goal.isCheeredByUser ? 'default' : 'outline'}
                onClick={() => cheerMutation.mutate()}
                disabled={cheerMutation.isPending}
                className={`text-xs sm:text-sm ${
                  goal.isCheeredByUser ? 'bg-pink-600 hover:bg-pink-700' : ''
                }`}
              >
                <Heart
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${goal.isCheeredByUser ? 'fill-current' : ''}`}
                />
                {goal.cheerCount !== undefined && goal.cheerCount > 0 && (
                  <span className="ml-1">{goal.cheerCount}</span>
                )}
              </Button>
            )}

            {/* Status display for non-owners */}
            {!isOwner && !canCheer && (
              <div className="flex items-center gap-2">
                {goal.cheerCount !== undefined && goal.cheerCount > 0 && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs sm:text-sm">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{goal.cheerCount}</span>
                  </div>
                )}
                {goal.flameCount !== undefined && goal.flameCount > 0 && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs sm:text-sm">
                    <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{goal.flameCount}</span>
                  </div>
                )}
              </div>
            )}

            {/* Owner Action Buttons */}
            {isOwner && goal.status === 'active' && (
              <div className="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:gap-2 sm:space-y-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => failGoalMutation.mutate()}
                  disabled={failGoalMutation.isPending}
                  className="text-xs text-red-600 hover:text-red-700 sm:text-sm dark:text-red-400 dark:hover:text-red-300"
                >
                  <span className="sm:hidden">Fail</span>
                  <span className="hidden sm:inline">Mark Failed</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => shipGoalMutation.mutate()}
                  disabled={shipGoalMutation.isPending}
                  className="bg-green-600 text-xs hover:bg-green-700 sm:text-sm"
                >
                  Ship It! 🚀
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
