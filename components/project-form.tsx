'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters'),
  url: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid URL (e.g., https://example.com)'),
  image: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid image URL'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters'),
  coupons: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  onSuccess?: () => void
  project?: {
    id: string
    name: string
    url?: string | null
    image?: string | null
    description: string
    coupons?: string | null
  }
  mode?: 'create' | 'edit'
}

export function ProjectForm({
  onSuccess,
  project,
  mode = 'create',
}: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          url: project.url || '',
          image: project.image || '',
          description: project.description,
          coupons: project.coupons || '',
        }
      : undefined,
  })

  const descriptionValue = watch('description', '')

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const url =
        mode === 'edit' && project
          ? `/api/projects/${project.id}`
          : '/api/projects'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${mode} project`)
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['public-projects'] })
      if (mode === 'create') {
        reset()
      }
      toast.success(
        `Project ${mode === 'edit' ? 'updated' : 'created'} successfully! 🚀`
      )
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  function onSubmit(data: ProjectFormData) {
    setIsSubmitting(true)
    createProjectMutation.mutate(data)
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'edit' ? 'Edit Project' : 'Create New Project'}
        </CardTitle>
        <CardDescription>
          {mode === 'edit'
            ? 'Update your project information and showcase details.'
            : 'Showcase your project to the community and link it to your goals.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g., TaskMaster Pro"
              className={errors.name ? 'border-red-500' : ''}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Project URL (Optional)</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://your-project.com"
              className={errors.url ? 'border-red-500' : ''}
              {...register('url')}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Where people can visit your live project
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image URL (Optional)</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              className={errors.image ? 'border-red-500' : ''}
              {...register('image')}
            />
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
            <p className="text-muted-foreground text-xs">
              A screenshot or logo for your project
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <div className="relative">
              <Input
                id="description"
                placeholder="Describe what your project does and why it's awesome..."
                className={errors.description ? 'border-red-500' : ''}
                {...register('description')}
              />
              <div className="mt-1 flex justify-between">
                <div>
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {descriptionValue.length}/500
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupons">Special Offers/Coupons (Optional)</Label>
            <Input
              id="coupons"
              placeholder="e.g., Use code EARLY20 for 20% off!"
              {...register('coupons')}
            />
            <p className="text-muted-foreground text-xs">
              Attract visitors with exclusive deals or early access
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || createProjectMutation.isPending}
            className="w-full"
          >
            {isSubmitting || createProjectMutation.isPending
              ? `${mode === 'edit' ? 'Updating' : 'Creating'} Project...`
              : `${mode === 'edit' ? 'Update Project' : 'Create Project'} ✨`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
