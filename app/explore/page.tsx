'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { GoalCard } from '@/components/goal-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Goal {
  id: string
  description: string
  targetDate: string
  status: 'active' | 'shipped' | 'failed'
  createdAt: string
  updatedAt: string
  userId: string
  user: {
    id: string
    name: string
    image?: string | null
  }
}

interface PublicGoalsResponse {
  goals: Goal[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function ExplorePage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-goals', page],
    queryFn: async () => {
      const response = await fetch(
        `/api/goals/public?page=${page}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch public goals')
      }
      return response.json() as Promise<PublicGoalsResponse>
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Goals</h1>
          <p className="text-muted-foreground mt-2">
            See what others are working on and get inspired!
          </p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Failed to load public goals. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { goals, pagination } = data || {
    goals: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Goals</h1>
        <p className="text-muted-foreground mt-2">
          See what others are working on and get inspired! ({pagination.total}{' '}
          total goals)
        </p>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No public goals found. Be the first to create one!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} showUser={true} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <span className="text-muted-foreground text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
