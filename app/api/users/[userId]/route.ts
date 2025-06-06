import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    userId: string
  }>
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params
  try {
    const { userId } = params

    // Get user with their goals
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        goals: {
          include: {
            _count: {
              select: {
                cheers: true,
                flames: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate stats
    const totalGoals = user.goals.length
    const shippedGoals = user.goals.filter(
      (goal) => goal.status === 'shipped'
    ).length
    const failedGoals = user.goals.filter(
      (goal) => goal.status === 'failed'
    ).length
    const activeGoals = user.goals.filter(
      (goal) => goal.status === 'active'
    ).length
    const shipRate =
      totalGoals > 0 ? Math.round((shippedGoals / totalGoals) * 100) : 0
    const totalCheers = user.goals.reduce(
      (sum, goal) => sum + goal._count.cheers,
      0
    )
    const totalFlames = user.goals.reduce(
      (sum, goal) => sum + goal._count.flames,
      0
    )

    // Transform goals to include cheer count
    const transformedGoals = user.goals.map((goal) => ({
      ...goal,
      cheerCount: goal._count.cheers,
      flameCount: goal._count.flames,
      _count: undefined,
    }))

    const userProfile = {
      id: user.id,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      stats: {
        totalGoals,
        shippedGoals,
        failedGoals,
        activeGoals,
        shipRate,
        totalCheers,
        totalFlames,
      },
      goals: {
        active: transformedGoals.filter((goal) => goal.status === 'active'),
        shipped: transformedGoals.filter((goal) => goal.status === 'shipped'),
        failed: transformedGoals.filter((goal) => goal.status === 'failed'),
      },
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
