import { FadeIn } from '@/components/atoms/fade-in'
import { ClientOnly } from '@/components/atoms/client-only'
import { getWakaStats, getWakaStatusBar } from '@/lib/wakatime/actions'
import { PageLoading } from '@/components/atoms/page-loading'

export const OperatingSystems = async () => {
  // Today
  const todayRes = await getWakaStatusBar()
  const osToday = Array.isArray(todayRes?.data?.operating_systems) ? todayRes.data.operating_systems : []
  const transformedToday = osToday.map((os: any) => ({
    name: os?.name || 'Unknown',
    minutes: Math.round((os?.total_seconds ?? 0) / 60),
    percent: typeof os?.percent === 'number' ? os.percent : 0,
    color: getPlatformColor(os?.name || 'Unknown')
  }))

  // Last 7 days
  const statsRes = await getWakaStats('last_7_days')
  const os7d = Array.isArray(statsRes?.data?.operating_systems) ? statsRes.data.operating_systems : []
  const transformed7d = os7d.map((os: any) => ({
    name: os?.name || 'Unknown',
    minutes: Math.round((os?.total_seconds ?? 0) / 60),
    percent: typeof os?.percent === 'number' ? os.percent : 0,
    color: getPlatformColor(os?.name || 'Unknown')
  }))

  return (
    <ClientOnly fallback={<div className='flex-1 h-full flex items-center justify-center'><PageLoading /></div>}>
      <FadeIn>
        <article>
          <div className='space-y-2 mb-2.5 pb-2.5 border-b'>
            <h1 className='md:text-2xl text-xl font-semibold'>Operating Systems</h1>
          </div>
          {/* Last 7 days */}
          {transformed7d.length === 0 ? null : (
            transformed7d.map((item: any) => (
              <pre className='flex items-center justify-between' key={item.name + '-7d'}>
                <code className='text-muted-foreground w-44 shrink-0 flex items-center gap-x-2 !text-sm'>
                  <div
                    className='w-1 h-1 rounded-full'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='truncate'>{item.name}</span>
                </code>
                <div className='w-full h-1 bg-muted rounded md:block hidden'>
                  <div
                    className='h-1 bg-foreground rounded'
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <code className='w-20 text-end text-muted-foreground shrink-0 !text-sm'>{item.percent}%</code>
              </pre>
            ))
          )}
          {transformedToday.length === 0 && transformed7d.length === 0 && (
            <p className='text-muted-foreground text-sm'>No operating system data available</p>
          )}
        </article>
      </FadeIn>
    </ClientOnly>
  )
}

function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    macos: '#000000',
    windows: '#00a1f1',
    linux: '#fcc624',
    ubuntu: '#e95420',
    debian: '#a81d33',
    fedora: '#294172',
    arch: '#1793d1',
    centos: '#932279',
    ios: '#007aff',
    android: '#3ddc84',
  }
  return colors[platform.toLowerCase()] || '#6b7280'
}
