'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Copy,
  Edit,
  ExternalLink,
  MoreVertical,
  Target,
  Trash2,
  Trophy,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { ProjectForm } from '@/components/project-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  activeGoals: number
  shippedGoals: number
  failedGoals: number
  user?: {
    id: string
    name: string
    image?: string | null
    twitterHandle?: string | null
    twitterAvatarUrl?: string | null
    twitterVerified?: boolean
  }
}

interface ProjectCardProps {
  project: Project
  showUser?: boolean
  canEdit?: boolean
}

export function ProjectCard({
  project,
  showUser = true,
  canEdit = false,
}: ProjectCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete project')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['public-projects'] })
      toast.success('Project deleted successfully')
      setIsDeleteDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleDelete = () => {
    deleteProjectMutation.mutate()
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
  }

  const handleVisitProject = () => {
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyCoupon = async () => {
    if (!project.coupons) return

    try {
      await navigator.clipboard.writeText(project.coupons)
      toast.success('Coupon code copied to clipboard!')
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = project.coupons
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Coupon code copied to clipboard!')
    }
  }

  const getProjectImage = () => {
    if (project.image) {
      return (
        <div className="relative h-36 w-full overflow-hidden rounded-t-lg sm:h-48">
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )
    }

    return (
      <div className="flex h-36 w-full items-center justify-center rounded-t-lg bg-gradient-to-br from-purple-100 to-blue-100 sm:h-48 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="text-center">
          <Target className="text-muted-foreground mx-auto h-8 w-8 sm:h-12 sm:w-12" />
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
            No image
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {getProjectImage()}

      <div className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <div className="space-y-3">
            {/* Title and User Info Row */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="min-w-0 flex-1">
                <CardTitle className="line-clamp-1 text-base sm:text-lg">
                  {project.name}
                </CardTitle>
              </div>
              <div className="flex flex-shrink-0 items-center justify-between gap-2 sm:justify-end">
                {showUser && project.user && (
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6">
                      <AvatarImage
                        src={
                          project.user.twitterAvatarUrl ||
                          project.user.image ||
                          undefined
                        }
                      />
                      <AvatarFallback className="text-xs">
                        {project.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 items-center gap-1">
                      <a
                        href={`/users/${project.user.id}`}
                        className="text-muted-foreground hover:text-foreground truncate text-xs hover:underline sm:text-sm"
                      >
                        {project.user.name}
                      </a>
                      {project.user.twitterHandle && (
                        <>
                          <span className="text-muted-foreground text-xs">
                            •
                          </span>
                          <a
                            href={`https://twitter.com/${project.user.twitterHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            @{project.user.twitterHandle}
                            {project.user.twitterVerified && (
                              <svg
                                className="h-2.5 w-2.5 flex-shrink-0 text-blue-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {canEdit && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                      >
                        <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setIsEditDialogOpen(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="w-full">
              <CardDescription className="line-clamp-3 text-xs leading-relaxed sm:line-clamp-4 sm:text-sm">
                {project.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pt-0 sm:space-y-4">
          {/* Goal Statistics */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.goalCount > 0 && (
              <>
                <Badge variant="secondary" className="flex-shrink-0 text-xs">
                  <Target className="mr-1 h-3 w-3" />
                  {project.goalCount} goal{project.goalCount !== 1 ? 's' : ''}
                </Badge>
                {project.shippedGoals > 0 && (
                  <Badge
                    variant="default"
                    className="flex-shrink-0 bg-green-600 text-xs hover:bg-green-700"
                  >
                    <Trophy className="mr-1 h-3 w-3" />
                    {project.shippedGoals} shipped
                  </Badge>
                )}
                {project.activeGoals > 0 && (
                  <Badge variant="outline" className="flex-shrink-0 text-xs">
                    {project.activeGoals} active
                  </Badge>
                )}
                {project.failedGoals > 0 && (
                  <Badge
                    variant="destructive"
                    className="flex-shrink-0 text-xs"
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    {project.failedGoals} failed
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Special Offers */}
          {project.coupons && (
            <div
              className="group/coupon cursor-pointer rounded-md bg-amber-50 p-2.5 transition-colors hover:bg-amber-100 sm:p-3 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
              onClick={handleCopyCoupon}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCopyCoupon()
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-amber-800 sm:text-sm dark:text-amber-200">
                    🎁 Special Offer
                  </p>
                  <p className="line-clamp-2 text-xs text-amber-700 sm:text-sm dark:text-amber-300">
                    {project.coupons}
                  </p>
                </div>
                <Copy className="ml-2 h-4 w-4 flex-shrink-0 text-amber-600 opacity-0 transition-opacity group-hover/coupon:opacity-100 dark:text-amber-400" />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="mt-auto pt-0">
          {project.url && (
            <Button
              onClick={handleVisitProject}
              className="w-full text-xs sm:text-sm"
              size="sm"
            >
              <ExternalLink className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="sm:hidden">Visit</span>
              <span className="hidden sm:inline">Visit Project</span>
            </Button>
          )}
        </CardFooter>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl sm:max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Edit Project
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update your project information and showcase details.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto sm:max-h-[70vh]">
            <ProjectForm
              project={project}
              mode="edit"
              onSuccess={handleEditSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Are you sure you want to delete &quot;{project.name}&quot;? This
              action cannot be undone.
              {project.goalCount > 0 && (
                <span className="mt-2 block text-amber-600">
                  ⚠️ This project has {project.goalCount} linked goal
                  {project.goalCount !== 1 ? 's' : ''}. You&apos;ll need to
                  unlink them first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:gap-3 sm:space-y-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full text-xs sm:w-auto sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProjectMutation.isPending}
              className="w-full text-xs sm:w-auto sm:text-sm"
            >
              {deleteProjectMutation.isPending
                ? 'Deleting...'
                : 'Delete Project'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
