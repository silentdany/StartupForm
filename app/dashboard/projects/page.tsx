'use client'

import { Suspense, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Target, Trophy, XCircle } from 'lucide-react'

import { DashboardShell } from '@/components/dashboard-shell'
import { ProjectCard } from '@/components/project-card'
import { ProjectForm } from '@/components/project-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface Project {
  id: string
  name: string
  url?: string | null
  image?: string | null
  description: string
  coupons?: string | null
  createdAt: string
  updatedAt: string
  userId: string
  goalCount: number
  activeGoals?: number
  shippedGoals?: number
  failedGoals?: number
}

function ProjectsList() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      return response.json() as Promise<Project[]>
    },
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Failed to load projects. Please try again.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Target className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Start showcasing your work to the community!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate overall stats
  const totalGoals = projects.reduce(
    (sum, project) => sum + project.goalCount,
    0
  )
  const totalProjects = projects.length

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Target className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linked Goals</CardTitle>
            <Trophy className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-muted-foreground text-xs">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Goals/Project
            </CardTitle>
            <XCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0
                ? (totalGoals / totalProjects).toFixed(1)
                : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={{
              ...project,
              activeGoals: 0,
              shippedGoals: 0,
              failedGoals: 0,
            }}
            showUser={false}
            canEdit={true}
          />
        ))}
      </div>
    </div>
  )
}

export default function DashboardProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleProjectCreated = () => {
    setIsDialogOpen(false)
  }

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Projects', isCurrentPage: true },
      ]}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground">
            Manage and showcase your projects to the community
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to showcase your work and attract visitors.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto">
              <ProjectForm onSuccess={handleProjectCreated} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <ProjectsList />
        </Suspense>
      </div>
    </DashboardShell>
  )
}
