'use client'

import { Languages } from '@/app/coding-activity/partials';
import { FadeIn, FadeInStagger } from '@/components/atoms/fade-in';

export function CodingActivitySection() {
	return (
		<div className='space-y-6'>
			<FadeInStagger>
				<FadeIn>
					<Languages />
				</FadeIn>
			</FadeInStagger>
		</div>
	);
}
