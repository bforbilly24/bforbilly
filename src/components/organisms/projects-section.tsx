'use client'

import { allProjects } from 'contentlayer/generated'
import dynamic from 'next/dynamic'

import { FadeIn, FadeInStagger, AnimatePresence } from '@/components/atoms/fade-in'

// Dynamic import untuk ProjectCard agar tidak block initial load
const ProjectCard = dynamic(() => import('@/components/molecules/project-card').then(mod => ({ default: mod.ProjectCard })), {
  loading: () => <div className="animate-pulse bg-muted rounded-lg aspect-video" />,
  ssr: true
})

type SearchParamsProps = {
  searchParams: {
    category?: string
    technology?: string
    platform?: string
    tag?: string
  }
}

export function ProjectsSection({ searchParams }: SearchParamsProps) {
  const { category, technology, platform, tag } = searchParams
  
  let filteredProjects = allProjects
  
  if (category) {
    const decodedCategory = decodeURIComponent(category)
    filteredProjects = filteredProjects.filter(project => 
      project.category && project.category.includes(decodedCategory)
    )
  }
  
  if (technology) {
    const decodedTechnology = decodeURIComponent(technology)
    filteredProjects = filteredProjects.filter(project => 
      project.technology && project.technology.includes(decodedTechnology)
    )
  }
  
  if (platform) {
    const decodedPlatform = decodeURIComponent(platform)
    filteredProjects = filteredProjects.filter(project => 
      project.platform && project.platform.includes(decodedPlatform)
    )
  }
  
  if (tag) {
    const decodedTag = decodeURIComponent(tag)
    filteredProjects = filteredProjects.filter(project => 
      project.tag && project.tag.includes(decodedTag)
    )
  }

  return (
    <FadeInStagger className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5' faster>
      <AnimatePresence mode='wait'>
        {filteredProjects.map(project => (
          <FadeIn layout key={project.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ProjectCard data={project} />
          </FadeIn>
        ))}
      </AnimatePresence>
    </FadeInStagger>
  )
}
