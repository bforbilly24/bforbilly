import { FadeIn } from '@/components/atoms/fade-in';
import { ClientOnly } from '@/components/atoms/client-only';
import { getWakaStatusBar, getWakaStats } from '@/lib/wakatime/actions';
import { PageLoading } from '@/components/atoms/page-loading';

export const CodeEditor = async () => {
  // Filter function to exclude non-code editors
  const isCodeEditor = (editorName: string) => {
    const nonCodeEditors = ['figma', 'sketch', 'framer', 'adobe', 'photoshop', 'illustrator', 'canva'];
    return !nonCodeEditors.some(excluded => 
      editorName.toLowerCase().includes(excluded.toLowerCase())
    );
  };

  // Today
  const todayRes = await getWakaStatusBar();
  const editorsToday = Array.isArray(todayRes?.data?.editors) 
    ? todayRes.data.editors.filter((editor: any) => isCodeEditor(editor.name || ''))
    : [];
  const totalSecondsToday = editorsToday.reduce((sum: number, e: any) => sum + (e.total_seconds || 0), 0);
  const totalMinutesToday = Math.round(totalSecondsToday / 60);
  const totalHoursToday = Math.floor(totalMinutesToday / 60);
  const remainingMinutesToday = totalMinutesToday % 60;
  const transformedToday = editorsToday.map((item: any) => {
    const minutes = Math.round((item.total_seconds || 0) / 60);
    return {
      name: item.name || 'Unknown',
      minutes,
      percent: item.percent || 0,
      color: getWorkspaceColor(item.name || 'unknown'),
    };
  });

  // Last 7 Days
  const stats7dRes = await getWakaStats('last_7_days');
  const editors7d = Array.isArray(stats7dRes?.data?.editors) 
    ? stats7dRes.data.editors.filter((editor: any) => isCodeEditor(editor.name || ''))
    : [];
  const totalSeconds7d = editors7d.reduce((sum: number, e: any) => sum + (e.total_seconds || 0), 0);
  const totalMinutes7d = Math.round(totalSeconds7d / 60);
  const totalHours7d = Math.floor(totalMinutes7d / 60);
  const remainingMinutes7d = totalMinutes7d % 60;
  const transformed7d = editors7d.map((item: any) => {
    const minutes = Math.round((item.total_seconds || 0) / 60);
    return {
      name: item.name || 'Unknown',
      minutes,
      percent: item.percent || 0,
      color: getWorkspaceColor(item.name || 'unknown'),
    };
  });

  return (
    <ClientOnly fallback={<div className='flex-1 h-full flex items-center justify-center'><PageLoading /></div>}>
      <FadeIn>
        <article>
          <div className='mb-2.5 border-b pb-2.5 md:space-y-2'>
            <h1 className='text-xl font-semibold md:text-2xl'>Top Editors</h1>
          </div>
          {/* Today */}
          <h2 className='text-lg font-semibold mb-2'>Today</h2>
          <p className='text-sm text-muted-foreground mb-2'>Total: {totalHoursToday} hrs {remainingMinutesToday} mins</p>
          {transformedToday.length === 0 ? (
            <p className='text-sm text-muted-foreground mb-4'>No editor data for today</p>
          ) : (
            transformedToday.map((item: any) => (
              <pre className='flex items-center justify-between' key={item.name}>
                <code className='flex w-40 shrink-0 items-center gap-x-2 !text-sm text-muted-foreground'>
                  <div
                    className='h-1 w-1 rounded-full'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='truncate'>{item.name}</span>
                </code>
                <div className='hidden h-1 w-full rounded bg-muted md:block'>
                  <div
                    className='h-1 rounded bg-foreground'
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <code className='w-24 text-end !text-sm text-muted-foreground'>{item.percent}%</code>
              </pre>
            ))
          )}

          {/* Last 7 Days */}
          <h2 className='text-lg font-semibold mt-6 mb-2'>Last 7 Days</h2>
          <p className='text-sm text-muted-foreground mb-2'>Total: {totalHours7d} hrs {remainingMinutes7d} mins</p>
          {transformed7d.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No editor data for last 7 days</p>
          ) : (
            transformed7d.map((item: any) => (
              <pre className='flex items-center justify-between' key={item.name}>
                <code className='flex w-40 shrink-0 items-center gap-x-2 !text-sm text-muted-foreground'>
                  <div
                    className='h-1 w-1 rounded-full'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='truncate'>{item.name}</span>
                </code>
                <div className='hidden h-1 w-full rounded bg-muted md:block'>
                  <div
                    className='h-1 rounded bg-foreground'
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <code className='w-24 text-end !text-sm text-muted-foreground'>{item.percent}%</code>
              </pre>
            ))
          )}
        </article>
      </FadeIn>
    </ClientOnly>
  );
};

function getWorkspaceColor(workspace: string): string {
  let hash = 0;
  for (let i = 0; i < workspace.length; i++) {
    hash = workspace.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}