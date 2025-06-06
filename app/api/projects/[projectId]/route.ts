import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    projectId: string
  }>
}

const updateProjectSchema = z.object({
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

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = params

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: {
            goals: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Transform to include goal count
    const transformedProject = {
      ...project,
      goalCount: project._count.goals,
      _count: undefined,
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, props: RouteParams) {
  const params = await props.params
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = params
    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    // Check if project exists and belongs to the user
    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (existingProject.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        name: validatedData.name,
        url: validatedData.url || null,
        image: validatedData.image || null,
        description: validatedData.description,
        coupons: validatedData.coupons || null,
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
      ...updatedProject,
      goalCount: updatedProject._count.goals,
      _count: undefined,
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = params

    // Check if project exists and belongs to the user
    const existingProject = await db.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: {
            goals: true,
          },
        },
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (existingProject.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if project has linked goals
    if (existingProject._count.goals > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete project with linked goals. Please unlink goals first.',
        },
        { status: 400 }
      )
    }

    await db.project.delete({
      where: { id: projectId },
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
