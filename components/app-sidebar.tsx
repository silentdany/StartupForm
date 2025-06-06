'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Command,
  Compass,
  FolderOpen,
  LifeBuoy,
  Send,
  Settings2,
  Target,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useSession } from '@/lib/auth-client'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Target,
      isActive: true,
      items: [
        {
          title: 'My Goals',
          url: '/dashboard',
        },
        {
          title: 'My Projects',
          url: '/dashboard/projects',
        },
      ],
    },
    {
      title: 'Explore',
      url: '/explore',
      icon: Compass,
      items: [
        {
          title: 'Public Goals',
          url: '/explore',
        },
        {
          title: 'Projects',
          url: '/projects',
        },
      ],
    },
    {
      title: 'Projects',
      url: '/dashboard/projects',
      icon: FolderOpen,
      items: [
        {
          title: 'My Projects',
          url: '/dashboard/projects',
        },
        {
          title: 'Discover',
          url: '/projects',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/dashboard/account',
      icon: Settings2,
      items: [
        {
          title: 'Account',
          url: '/dashboard/account',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Ship It or Weep
                  </span>
                  <span className="truncate text-xs">Goal Tracker</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {session?.user && (
          <NavUser
            user={{
              name: session.user.name ?? 'Unknown User',
              email: session.user.email ?? '',
              avatar: session.user.image ?? '',
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
