'use client'

import { Suspense } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { DashboardShell } from '@/components/dashboard-shell'
import { GoalCard } from '@/components/goal-card'
import { GoalForm } from '@/components/goal-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Goal {
  id: string
  description: string
  targetDate: string
  status: 'active' | 'shipped' | 'failed'
  createdAt: string
  updatedAt: string
  userId: string
}

function TwitterSyncButton() {
  const queryClient = useQueryClient()

  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/user/sync-twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to sync Twitter profile')
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast.success('Twitter profile synced successfully!')
      console.log('🚀 ~ Twitter sync success:', data)
      // Invalidate user query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
      console.error('❌ Twitter sync failed:', error)
    },
  })

  return (
    <Button
      onClick={() => syncMutation.mutate()}
      disabled={syncMutation.isPending}
      variant="outline"
      size="sm"
    >
      {syncMutation.isPending ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Syncing...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.206 2.25h3.308l-7.227 8.26 8.503 11.24H16.69l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1 2.25H8.18l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Sync Twitter Profile
        </>
      )}
    </Button>
  )
}

function GoalsList() {
  // Get current user info
  const { data: userInfo } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await fetch('/api/user')
      if (!response.ok) {
        return null
      }
      return response.json()
    },
  })

  const {
    data: goals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await fetch('/api/goals')
      if (!response.ok) {
        throw new Error('Failed to fetch goals')
      }
      return response.json() as Promise<Goal[]>
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Failed to load goals. Please try again.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No goals yet. Create your first goal to get started!
          </p>
        </CardContent>
      </Card>
    )
  }

  const activeGoals = goals.filter((goal) => goal.status === 'active')
  const shippedGoals = goals.filter((goal) => goal.status === 'shipped')
  const failedGoals = goals.filter((goal) => goal.status === 'failed')

  return (
    <div className="space-y-6">
      {activeGoals.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Active Goals ({activeGoals.length})
          </h2>
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isOwner={true}
                currentUserId={userInfo?.id}
              />
            ))}
          </div>
        </div>
      )}

      {shippedGoals.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Shipped Goals ({shippedGoals.length})
          </h2>
          <div className="space-y-4">
            {shippedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isOwner={true}
                currentUserId={userInfo?.id}
              />
            ))}
          </div>
        </div>
      )}

      {failedGoals.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Failed Goals ({failedGoals.length})
          </h2>
          <div className="space-y-4">
            {failedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isOwner={true}
                currentUserId={userInfo?.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardShell breadcrumbs={[{ label: 'Dashboard', isCurrentPage: true }]}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="order-2 lg:order-1 lg:col-span-1">
          <GoalForm />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Goals</CardTitle>
                  <CardDescription>
                    Track your progress and ship your goals on time.
                  </CardDescription>
                </div>
                <TwitterSyncButton />
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                <GoalsList />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
