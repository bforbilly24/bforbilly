import { notFound } from 'next/navigation'
import { allProjects } from 'contentlayer/generated'

import { MDXComponent } from '@/components/molecules/mdx-component'
import { createOgImageUrl, createPageUrl } from '@/types/environment'
import { generateSEO } from '@/utils/seo'

type ParamsProps = {
  title: string
}

async function getProjectFromParams(params: ParamsProps) {
  const post = allProjects.find(post => post.title.toLowerCase() === params.title)
  if (!post) null

  return post
}

export async function generateMetadata({ params }: { params: ParamsProps }) {
  const project = await getProjectFromParams(params)
  if (!project) return {}

  const title = project.title + ' | Halim'
  const description = project.summary
  const image = createOgImageUrl(title.split(' ')[0])

  return {
    ...generateSEO(title, description, image, createPageUrl(`/projects/${params.title}`))
  }
}

export async function generateStaticParams() {
  return allProjects.map(post => ({
    title: post.title.toLowerCase()
  }))
}

export default async function ProjectDetail({ params }: { params: ParamsProps }) {
  const about = await getProjectFromParams(params)
  if (!about) return notFound()

  return (
    <MDXComponent
      code={about.body.code}
      className={
        'prose-h2:text-foreground font-sans prose-h3:text-foreground prose-p:text-muted-foreground prose-a:text-foreground prose-li:text-muted-foreground prose-img:w-2/3 prose-img:mx-auto prose-strong:text-foreground prose-h4:text-foreground prose-a:no-underline'
      }
    />
  )
}
