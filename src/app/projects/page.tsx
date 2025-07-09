import dynamic from 'next/dynamic'
import { generateSEO } from '@/utils/seo'
import { PAGE_URLS, OG_IMAGES } from '@/types/environment'

// Dynamic import untuk komponen yang butuh client-side
const ProjectsSection = dynamic(() => import('@/components/organisms/projects-section').then(mod => ({ default: mod.ProjectsSection })), {
  ssr: true
})

const title = 'projects'
const description = 'Explore my portfolio of web development projects showcasing modern technologies like React, Next.js, and more. Browse by category, technology, or platform to see my work in different areas.'
const url = PAGE_URLS.PROJECTS
const image = OG_IMAGES.PROJECTS

export const metadata = generateSEO(title, description, image, url)

type SearchParamsProps = {
  searchParams: {
    category?: string
    technology?: string
    platform?: string
    tag?: string
  }
}

export default function ProjectPage({ searchParams }: SearchParamsProps) {
  return <ProjectsSection searchParams={searchParams} />;
}
