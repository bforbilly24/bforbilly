import { redirect } from 'next/navigation'

import { createOgImageUrl, createPageUrl } from '@/types/environment'
import { generateSEO } from '@/utils/seo'
import { allActivity } from '../all-activities'

type ParamsProps = {
  slug: string
}

export async function generateMetadata({ params }: { params: ParamsProps }) {
  const data = allActivity.find(component => component.slug === params.slug)
  if (!data) return {}

  const title = data.slug + ' | Halim'
  const description = data.desc
  const image = createOgImageUrl(title.split(' ')[0])

  return {
    ...generateSEO(title, description, image, createPageUrl(`/coding-activity/${params.slug}`))
  }
}

export async function generateStaticParams() {
  return allActivity.map(component => ({
    slug: component.slug
  }))
}

export default async function ActivityDetails({ params }: { params: ParamsProps }) {
  const data = allActivity.find(component => component.slug === params.slug)

  if (!data) redirect('/coding-activity')

  return <data.component />
}
