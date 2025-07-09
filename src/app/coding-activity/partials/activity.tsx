import { FadeIn } from '@/components/atoms/fade-in'
import { ClientOnly } from '@/components/atoms/client-only'
import { getWakaStatusBar, getWakaStats } from '@/lib/wakatime/actions'
import { PageLoading } from '@/components/atoms/page-loading'

export const Activity = async () => {
  // Fetch today
  const statsRes = await getWakaStatusBar()
  const projectsToday = Array.isArray(statsRes?.data?.projects) ? statsRes.data.projects : []

  // Fetch last 7 days
  const stats7dRes = await getWakaStats('last_7_days')
  const projects7d = Array.isArray(stats7dRes?.data?.projects) ? stats7dRes.data.projects : []

  const maxToday = projectsToday.length > 0 ? Math.max(...projectsToday.map((p: any) => p.total_seconds)) : 0
  const minToday = projectsToday.length > 0 ? Math.min(...projectsToday.filter((p: any) => p.total_seconds > 0).map((p: any) => p.total_seconds)) : 0

  const max7d = projects7d.length > 0 ? Math.max(...projects7d.map((p: any) => p.total_seconds)) : 0
  const min7d = projects7d.length > 0 ? Math.min(...projects7d.filter((p: any) => p.total_seconds > 0).map((p: any) => p.total_seconds)) : 0

  if (projectsToday.length === 0 && projects7d.length === 0) {
    return (
      <ClientOnly fallback={<div>Loading activity...</div>}>
        <FadeIn>
          <article>
            <div className='md:space-y-2 mb-2.5 pb-2.5 border-b'>
              <h1 className='md:text-2xl text-xl font-semibold'>Activity</h1>
            </div>
            <p className='text-muted-foreground'>No activity data available.</p>
          </article>
        </FadeIn>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly fallback={<div className='flex-1 h-full flex items-center justify-center'><PageLoading /></div>}>
      <FadeIn>
        <article>
          <div className='md:space-y-2 mb-2.5 pb-2.5 border-b'>
            <h1 className='md:text-2xl text-xl font-semibold'>Activity</h1>
          </div>
          {/* Today */}
          <h2 className='text-lg font-semibold mb-2'>Today</h2>
          {projectsToday.length === 0 ? (
            <p className='text-muted-foreground mb-4'>No activity today.</p>
          ) : (
            projectsToday.map((item: any) => (
              <pre className='flex items-center justify-between gap-2' key={item.name}>
                <code className='text-muted-foreground w-40 truncate shrink-0 !text-sm'>{item.name}</code>
                <div className='w-full h-1 bg-muted rounded md:block hidden'>
                  <div
                    className='h-1 bg-foreground rounded'
                    style={{
                      width: `${maxToday === minToday ? 100 : ((item.total_seconds - minToday) / (maxToday - minToday)) * 100}%`
                    }}
                  />
                </div>
                <code className='w-32 text-end text-muted-foreground ml-4 md:ml-0 shrink-0 !text-sm'>
                  {item.text || `${Math.floor(item.total_seconds / 3600)} hrs ${Math.round((item.total_seconds % 3600) / 60)} mins`}
                </code>
              </pre>
            ))
          )}

          {/* Last 7 Days */}
          <h2 className='text-lg font-semibold mt-6 mb-2'>Last 7 Days</h2>
          {projects7d.length === 0 ? (
            <p className='text-muted-foreground'>No activity in the last 7 days.</p>
          ) : (
            projects7d.map((item: any) => (
              <pre className='flex items-center justify-between gap-2' key={item.name}>
                <code className='text-muted-foreground w-40 truncate shrink-0 !text-sm'>{item.name}</code>
                <div className='w-full h-1 bg-muted rounded md:block hidden'>
                  <div
                    className='h-1 bg-foreground rounded'
                    style={{
                      width: `${max7d === min7d ? 100 : ((item.total_seconds - min7d) / (max7d - min7d)) * 100}%`
                    }}
                  />
                </div>
                <code className='w-32 text-end text-muted-foreground ml-4 md:ml-0 shrink-0 !text-sm'>
                  {item.text || `${Math.floor(item.total_seconds / 3600)} hrs ${Math.round((item.total_seconds % 3600) / 60)} mins`}
                </code>
              </pre>
            ))
          )}
        </article>
      </FadeIn>
    </ClientOnly>
  )
}