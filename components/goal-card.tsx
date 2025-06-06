'use client'

import { GoalStatus } from '@/types/db'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  CheckCircle,
  Clock,
  Flame,
  Heart,
  MessageCircle,
  Target,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  }
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
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
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

  return (
    <Card
      className={`${getStatusColor()} ${isOverdue ? 'border-red-300 dark:border-red-700' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">
              {goal.status.toUpperCase()}
            </CardTitle>
          </div>
          {showUser && goal.user && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={goal.user.image || undefined} />
                <AvatarFallback className="text-xs">
                  {goal.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <a
                href={`/users/${goal.user.id}`}
                className="text-muted-foreground hover:text-foreground text-sm hover:underline"
              >
                {goal.user.name}
              </a>
            </div>
          )}
        </div>
        <CardDescription className="text-foreground text-base font-medium">
          {goal.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Target className="h-4 w-4" />
            <span>
              Target: {format(new Date(goal.targetDate), 'MMM d, yyyy h:mm a')}
            </span>
            {isOverdue && (
              <span className="font-medium text-red-500 dark:text-red-400">
                (Overdue)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Remind Button */}
            {canRemind && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => remindMutation.mutate()}
                disabled={remindMutation.isPending}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="ml-1">Remind</span>
              </Button>
            )}

            {/* Flame Button */}
            {canFlame && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => flameMutation.mutate()}
                disabled={flameMutation.isPending}
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                <Flame className="h-4 w-4" />
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
                className={
                  goal.isCheeredByUser ? 'bg-pink-600 hover:bg-pink-700' : ''
                }
              >
                <Heart
                  className={`h-4 w-4 ${goal.isCheeredByUser ? 'fill-current' : ''}`}
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
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4" />
                    <span>{goal.cheerCount}</span>
                  </div>
                )}
                {goal.flameCount !== undefined && goal.flameCount > 0 && (
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Flame className="h-4 w-4" />
                    <span>{goal.flameCount}</span>
                  </div>
                )}
              </div>
            )}

            {/* Owner Action Buttons */}
            {isOwner && goal.status === 'active' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => failGoalMutation.mutate()}
                  disabled={failGoalMutation.isPending}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Mark Failed
                </Button>
                <Button
                  size="sm"
                  onClick={() => shipGoalMutation.mutate()}
                  disabled={shipGoalMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
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
