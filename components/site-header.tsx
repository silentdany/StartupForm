'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GalleryVerticalEnd } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Testimonials', href: '/#testimonials' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Hide on dashboard routes
  if (pathname?.startsWith('/dashboard')) return null

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return pathname === '/' && href.endsWith(window.location.hash)
    }
    return pathname === href
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault()
      const element = document.getElementById(href.split('#')[1])
      element?.scrollIntoView({ behavior: 'smooth' })
      // Update URL without scroll
      window.history.pushState({}, '', href)
    }
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full justify-center border-b backdrop-blur">
      <div className="w-screen-2xl container flex h-14 items-center justify-between">
        <div className="flex flex-1 justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GalleryVerticalEnd className="h-6 w-6" />
            <span>Acme Inc.</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-center gap-2 md:justify-end">
          <ThemeToggle />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image ?? ''}
                      alt={session.user?.name ?? ''}
                    />
                    <AvatarFallback>
                      {session.user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="text-sm font-medium">
                    {session.user?.name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {session.user?.email}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onSelect={() => signOut()}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
