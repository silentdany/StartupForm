import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'recent'
    const filter = searchParams.get('filter') || 'all'
    const skip = (page - 1) * limit

    // Build where clause for filtering
    const whereClause: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        description?: { contains: string; mode: 'insensitive' }
      }>
      goals?: { some: { status?: string } | Record<string, never> }
      coupons?: { not: null }
    } = {}

    // Search functionality
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    // Filter functionality
    switch (filter) {
      case 'with-goals':
        whereClause.goals = {
          some: {},
        }
        break
      case 'with-coupons':
        whereClause.coupons = {
          not: null,
        }
        break
      case 'active-goals':
        whereClause.goals = {
          some: {
            status: 'active',
          },
        }
        break
      case 'shipped-goals':
        whereClause.goals = {
          some: {
            status: 'shipped',
          },
        }
        break
    }

    // Build order by clause for sorting
    let orderBy: Array<{
      createdAt?: 'desc' | 'asc'
      name?: 'desc' | 'asc'
      goals?: { _count: 'desc' | 'asc' }
    }> = [
      {
        createdAt: 'desc',
      },
    ]

    switch (sort) {
      case 'popular':
        orderBy = [
          {
            goals: {
              _count: 'desc',
            },
          },
          {
            createdAt: 'desc',
          },
        ]
        break
      case 'name':
        orderBy = [
          {
            name: 'asc',
          },
        ]
        break
      case 'goals':
        orderBy = [
          {
            goals: {
              _count: 'desc',
            },
          },
          {
            createdAt: 'desc',
          },
        ]
        break
      case 'recent':
      default:
        orderBy = [
          {
            createdAt: 'desc',
          },
        ]
        break
    }

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            twitterHandle: true,
            twitterAvatarUrl: true,
            twitterVerified: true,
          },
        },
        _count: {
          select: {
            goals: true,
          },
        },
        goals: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    const total = await db.project.count({
      where: whereClause,
    })

    // Transform the response to include analytics
    const transformedProjects = projects.map((project) => ({
      ...project,
      goalCount: project._count.goals,
      activeGoals: project.goals.filter((goal) => goal.status === 'active')
        .length,
      shippedGoals: project.goals.filter((goal) => goal.status === 'shipped')
        .length,
      failedGoals: project.goals.filter((goal) => goal.status === 'failed')
        .length,
      // Remove the raw _count and goals from the response
      _count: undefined,
      goals: undefined,
    }))

    return NextResponse.json({
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching public projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
