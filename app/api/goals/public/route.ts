import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const goals = await db.goal.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            cheers: true,
            flames: true,
          },
        },
        ...(session && {
          cheers: {
            where: {
              userId: session.user.id,
            },
            select: {
              id: true,
            },
          },
        }),
      },
      orderBy: [
        {
          cheers: {
            _count: 'desc',
          },
        },
        {
          createdAt: 'desc',
        },
      ],
      skip,
      take: limit,
    })

    const total = await db.goal.count()

    // Transform the response to include cheer info more cleanly
    const transformedGoals = goals.map((goal) => ({
      ...goal,
      cheerCount: goal._count.cheers,
      flameCount: goal._count.flames,
      isCheeredByUser: session ? goal.cheers.length > 0 : false,
      // Remove the raw _count and cheers from the response
      _count: undefined,
      cheers: undefined,
    }))

    return NextResponse.json({
      goals: transformedGoals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching public goals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
