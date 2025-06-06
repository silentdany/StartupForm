'use client'

import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'

import { DashboardShell } from '@/components/dashboard-shell'
import { GoalCard } from '@/components/goal-card'
import { GoalForm } from '@/components/goal-form'
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

function GoalsList() {
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
              <GoalCard key={goal.id} goal={goal} isOwner={true} />
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
              <GoalCard key={goal.id} goal={goal} isOwner={true} />
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
              <GoalCard key={goal.id} goal={goal} isOwner={true} />
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
        <div className="lg:col-span-1">
          <GoalForm />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>
                Track your progress and ship your goals on time.
              </CardDescription>
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
