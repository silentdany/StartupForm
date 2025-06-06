'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar, Flame, Heart, Target, Trophy } from 'lucide-react'

import { GoalCard } from '@/components/goal-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UserProfile {
  id: string
  name: string
  image?: string | null
  createdAt: string
  stats: {
    totalGoals: number
    shippedGoals: number
    failedGoals: number
    activeGoals: number
    shipRate: number
    totalCheers: number
    totalFlames: number
  }
  goals: {
    active: Goal[]
    shipped: Goal[]
    failed: Goal[]
  }
}

interface Goal {
  id: string
  description: string
  targetDate: string
  status: 'active' | 'shipped' | 'failed'
  createdAt: string
  updatedAt: string
  userId: string
  cheerCount: number
  flameCount: number
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string

  // Get current user info
  const { data: currentUser } = useQuery({
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
    data: userProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }
      return response.json() as Promise<UserProfile>
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              User not found or failed to load profile.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === userProfile.id

  return (
    <div className="container mx-auto py-8">
      {/* Profile Header */}
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userProfile.image || undefined} />
          <AvatarFallback className="text-xl">
            {userProfile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{userProfile.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Joined {format(new Date(userProfile.createdAt), 'MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile.stats.totalGoals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ship Rate</CardTitle>
            <Trophy className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userProfile.stats.shipRate}%
            </div>
            <p className="text-muted-foreground text-xs">
              {userProfile.stats.shippedGoals} shipped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cheers</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {userProfile.stats.totalCheers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flames</CardTitle>
            <Flame className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {userProfile.stats.totalFlames}
            </div>
            <p className="text-muted-foreground text-xs">
              {userProfile.stats.failedGoals} failed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({userProfile.stats.activeGoals})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped ({userProfile.stats.shippedGoals})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed ({userProfile.stats.failedGoals})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {userProfile.goals.active.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No active goals.
                </p>
              </CardContent>
            </Card>
          ) : (
            userProfile.goals.active.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isOwner={isOwnProfile}
                currentUserId={currentUser?.id}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="shipped" className="space-y-4">
          {userProfile.goals.shipped.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No shipped goals yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            userProfile.goals.shipped.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isOwner={isOwnProfile}
                currentUserId={currentUser?.id}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          {userProfile.goals.failed.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No failed goals.
                </p>
              </CardContent>
            </Card>
          ) : (
            userProfile.goals.failed.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isOwner={isOwnProfile}
                currentUserId={currentUser?.id}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
