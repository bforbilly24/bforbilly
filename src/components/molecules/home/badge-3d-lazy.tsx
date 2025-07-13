'use client';
import { lazy, Suspense, memo } from 'react';
import { Loader2 } from 'lucide-react';

const Badge3D = lazy(() => import('./badge-3d').then(module => ({ default: module.Badge3D })));

const Badge3DLazy = memo(() => {
	return (
		<Suspense
			fallback={
				<div className='relative h-[32rem] w-full max-w-lg lg:h-full lg:w-full 2xl:h-[48rem] flex items-center justify-center'>
					<Loader2 className='size-8 animate-spin text-muted-foreground' />
				</div>
			}
		>
			<Badge3D />
		</Suspense>
	);
});

Badge3DLazy.displayName = 'Badge3DLazy';

export { Badge3DLazy };
