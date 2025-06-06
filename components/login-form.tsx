'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [isTwitterLoading, setIsTwitterLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/dashboard'

  async function handleTwitterLogin() {
    console.log('🚀 Starting Twitter login...')
    setIsTwitterLoading(true)
    try {
      console.log('🚀 Calling signIn.social with provider: twitter')
      const result = await signIn.social({
        provider: 'twitter',
        callbackURL: from,
      })
      console.log('🚀 Twitter login result:', result)
    } catch (error) {
      console.error('❌ Twitter login failed:', error)
    } finally {
      setIsTwitterLoading(false)
      console.log('🚀 Twitter login process completed')
    }
  }

  async function handleGoogleLogin() {
    console.log('handleGoogleLogin')
    setIsGoogleLoading(true)
    try {
      console.log('signIn.social')
      await signIn.social({
        provider: 'google',
        callbackURL: from,
      })
    } catch (error) {
      console.error('Google login failed:', error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Join the indie hacker community</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Connect with your Twitter account to get started quickly
        </p>
      </div>
      <div className="grid gap-4">
        {/* Twitter Login - Primary */}
        <Button
          variant="default"
          className="h-11 w-full bg-black text-white hover:bg-gray-800"
          onClick={handleTwitterLogin}
          disabled={isTwitterLoading}
        >
          {isTwitterLoading ? (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.206 2.25h3.308l-7.227 8.26 8.503 11.24H16.69l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1 2.25H8.18l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          {isTwitterLoading ? 'Connecting...' : 'Continue with X (Twitter)'}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        {/* Google Login - Secondary */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              />
            </svg>
          )}
          {isGoogleLoading ? 'Loading...' : 'Continue with Google'}
        </Button>
      </div>

      <div className="text-muted-foreground text-center text-xs">
        <p>🚀 Join 10,000+ indie hackers building in public</p>
        <p className="mt-1">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  )
}
