'use server'
import { revalidatePath } from 'next/cache'

import { db } from './prisma'
import { auth } from './auth'
import * as Wakatime from '@/types/wakatimeResponse'

export const createPost = async (formData: FormData) => {
  const session = await auth()
  const desc = formData.get('desc') as string
  if (!session || !desc) return
  await db.post.create({
    data: {
      desc: desc,
      userId: session.user.id
    }
  })

  revalidatePath('/guest-book')
}

export const deletePost = async (id: number) => {
  await db.post.delete({
    where: {
      id: id
    }
  })

  revalidatePath('/guest-book')
}

export const weeklyCodingActivity = async () => {
  const res = await fetch('https://wakatime.com/share/@bforbilly/a6fada39-4105-48f9-acef-032cd0643f73.json', {
    cache: 'no-store'
  })
  return res.json() as Promise<Wakatime.WeeklyCodingActivity>
}

export const weeklyCodingLanguanges = async () => {
  const res = await fetch('https://wakatime.com/share/@bforbilly/ff03defd-d3d5-45af-add8-169c75d2577d.json', {
    cache: 'no-store'
  })
  return res.json() as Promise<Wakatime.WeeklyCodingLanguanges>
}

export const weeklyCodeEditor = async () => {
  const res = await fetch('https://wakatime.com/share/@bforbilly/f1aa4090-da07-4eb5-942a-028d0dfdae88.json', {
    cache: 'no-store'
  })
  return res.json() as Promise<Wakatime.WeeklyCodeEditor>
}

export const weeklyOperatingSystems = async () => {
  const res = await fetch('https://wakatime.com/share/@bforbilly/801c81bc-9666-4665-8b2e-4497125089e6.json', {
    cache: 'no-store'
  })
  return res.json() as Promise<Wakatime.WeeklyCodeEditor>
}
