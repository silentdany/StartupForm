import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user's Twitter account
    const twitterAccount = await db.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: 'twitter',
      },
    })

    if (!twitterAccount) {
      return NextResponse.json(
        { error: 'No Twitter account linked' },
        { status: 404 }
      )
    }

    console.log('🚀 ~ Twitter account found:', {
      accountId: twitterAccount.accountId,
      providerId: twitterAccount.providerId,
    })

    // Fetch Twitter profile data using Twitter API v2
    const twitterUserId = twitterAccount.accountId
    const bearerToken = process.env.TWITTER_BEARER

    if (!bearerToken) {
      return NextResponse.json(
        { error: 'Twitter API not configured' },
        { status: 500 }
      )
    }

    const twitterApiUrl = `https://api.twitter.com/2/users/${twitterUserId}?user.fields=description,profile_image_url,public_metrics,verified`

    console.log('🚀 ~ Fetching Twitter profile from:', twitterApiUrl)

    const twitterResponse = await fetch(twitterApiUrl, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })

    if (!twitterResponse.ok) {
      const error = await twitterResponse.text()
      console.error('❌ Twitter API error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch Twitter profile' },
        { status: 500 }
      )
    }

    const twitterData = await twitterResponse.json()
    console.log('🚀 ~ Twitter profile data:', twitterData)

    if (!twitterData.data) {
      return NextResponse.json(
        { error: 'Invalid Twitter response' },
        { status: 500 }
      )
    }

    const profile = twitterData.data

    // Update user with Twitter profile data
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        twitterHandle: profile.username,
        twitterId: profile.id,
        twitterAvatarUrl: profile.profile_image_url,
        twitterBio: profile.description,
        twitterFollowers: profile.public_metrics?.followers_count,
        twitterVerified: profile.verified || false,
      },
    })

    console.log('🚀 ~ User updated with Twitter data:', {
      twitterHandle: updatedUser.twitterHandle,
      twitterVerified: updatedUser.twitterVerified,
      twitterFollowers: updatedUser.twitterFollowers,
    })

    return NextResponse.json({
      success: true,
      user: {
        twitterHandle: updatedUser.twitterHandle,
        twitterId: updatedUser.twitterId,
        twitterAvatarUrl: updatedUser.twitterAvatarUrl,
        twitterBio: updatedUser.twitterBio,
        twitterFollowers: updatedUser.twitterFollowers,
        twitterVerified: updatedUser.twitterVerified,
      },
    })
  } catch (error) {
    console.error('❌ Failed to sync Twitter profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
