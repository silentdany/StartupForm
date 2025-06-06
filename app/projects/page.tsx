'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { ProjectCard } from '@/components/project-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
  activeGoals: number
  shippedGoals: number
  failedGoals: number
  user: {
    id: string
    name: string
    image?: string | null
  }
}

interface PublicProjectsResponse {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [filterBy, setFilterBy] = useState('all')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const limit = 12

  // Reset page when search/filter changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery, sortBy, filterBy])

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }

    if (sortBy !== 'recent') {
      params.set('sort', sortBy)
    }

    if (filterBy !== 'all') {
      params.set('filter', filterBy)
    }

    return params.toString()
  }, [page, searchQuery, sortBy, filterBy])

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-projects', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/projects/public?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      return response.json() as Promise<PublicProjectsResponse>
    },
  })

  const clearFilters = () => {
    setSearchQuery('')
    setSortBy('recent')
    setFilterBy('all')
  }

  const hasActiveFilters =
    searchQuery || sortBy !== 'recent' || filterBy !== 'all'

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Discover Projects</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Explore amazing projects built by the community
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Failed to load projects. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { projects, pagination } = data || {
    projects: [],
    pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Discover Projects</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Explore amazing projects built by the community. Find inspiration,
          discover new tools, and support fellow builders! (
          {pagination?.total || 0} projects)
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-4 pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm font-medium">
                Sort by:
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]" id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="goals">Most Goals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Label htmlFor="filter" className="text-sm font-medium">
                Filter:
              </Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[140px]" id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="with-goals">With Goals</SelectItem>
                  <SelectItem value="with-coupons">With Offers</SelectItem>
                  <SelectItem value="active-goals">Active Goals</SelectItem>
                  <SelectItem value="shipped-goals">Shipped Goals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filters Button & Clear Filters */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}

            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filter Projects</SheetTitle>
                  <SheetDescription>
                    Refine your search to find the perfect projects
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="mobile-sort"
                      className="text-sm font-medium"
                    >
                      Sort by
                    </Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="mt-2" id="mobile-sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="goals">Most Goals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="mobile-filter"
                      className="text-sm font-medium"
                    >
                      Filter by
                    </Label>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="mt-2" id="mobile-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="with-goals">With Goals</SelectItem>
                        <SelectItem value="with-coupons">
                          With Offers
                        </SelectItem>
                        <SelectItem value="active-goals">
                          Active Goals
                        </SelectItem>
                        <SelectItem value="shipped-goals">
                          Shipped Goals
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Active filters:
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Search: &quot;{searchQuery}&quot;
              </Badge>
            )}
            {sortBy !== 'recent' && (
              <Badge variant="secondary" className="text-xs">
                Sort:{' '}
                {sortBy === 'popular'
                  ? 'Most Popular'
                  : sortBy === 'name'
                    ? 'Name A-Z'
                    : 'Most Goals'}
              </Badge>
            )}
            {filterBy !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Filter:{' '}
                {filterBy === 'with-goals'
                  ? 'With Goals'
                  : filterBy === 'with-coupons'
                    ? 'With Offers'
                    : filterBy === 'active-goals'
                      ? 'Active Goals'
                      : 'Shipped Goals'}
              </Badge>
            )}
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                No projects found. Be the first to showcase your project!
              </p>
              <Button asChild>
                <a href="/dashboard/projects">Create Project</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} showUser={true} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <span className="text-muted-foreground text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="w-full sm:w-auto"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
