import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name too long'),
  url: z.string().url('Invalid URL format').optional().or(z.literal('')),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  coupons: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            goals: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform to include goal count
    const transformedProjects = projects.map((project) => ({
      ...project,
      goalCount: project._count.goals,
      _count: undefined,
    }))

    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await db.project.create({
      data: {
        name: validatedData.name,
        url: validatedData.url || null,
        image: validatedData.image || null,
        description: validatedData.description,
        coupons: validatedData.coupons || null,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            goals: true,
          },
        },
      },
    })

    // Transform to include goal count
    const transformedProject = {
      ...project,
      goalCount: project._count.goals,
      _count: undefined,
    }

    return NextResponse.json(transformedProject, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
