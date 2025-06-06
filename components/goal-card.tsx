'use client'

import { GoalStatus } from '@/types/db'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CheckCircle, Clock, Target, XCircle } from 'lucide-react'
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
}

export function GoalCard({
  goal,
  isOwner = false,
  showUser = false,
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
      toast.success('Goal marked as failed')
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
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-yellow-200 bg-yellow-50'
    }
  }

  const isOverdue =
    new Date(goal.targetDate) < new Date() && goal.status === 'active'

  return (
    <Card
      className={`${getStatusColor()} ${isOverdue ? 'border-red-300' : ''}`}
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
              <span className="text-muted-foreground text-sm">
                {goal.user.name}
              </span>
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
              <span className="font-medium text-red-500">(Overdue)</span>
            )}
          </div>

          {isOwner && goal.status === 'active' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => failGoalMutation.mutate()}
                disabled={failGoalMutation.isPending}
                className="text-red-600 hover:text-red-700"
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
      </CardContent>
    </Card>
  )
}
