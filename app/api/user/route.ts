import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const patchUserSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        twitterHandle: true,
        twitterId: true,
        twitterAvatarUrl: true,
        twitterBio: true,
        twitterFollowers: true,
        twitterVerified: true,
      },
    })

    // Also fetch linked accounts for debugging
    const accounts = await db.account.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        providerId: true,
        accountId: true,
        accessToken: false, // Don't expose the actual token for security
        createdAt: true,
      },
    })

    console.log('🚀 ~ GET /api/user ~ session:', session)
    console.log('🚀 ~ GET /api/user ~ user from DB:', user)
    console.log('🚀 ~ GET /api/user ~ linked accounts:', accounts)

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to get user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = patchUserSchema.parse(json)

    const user = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: body.name,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await db.user.delete({
      where: {
        id: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
