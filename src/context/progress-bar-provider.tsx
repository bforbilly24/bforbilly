'use client';

import { AppProgressProvider } from '@bprogress/next';
import { ReactNode } from 'react';
import { useTheme } from 'next-themes';
import NoSSR from '@/components/atoms/no-ssr';

interface BProgressProviderProps {
	children: ReactNode;
}

const BProgressProvider = ({ children }: BProgressProviderProps) => {
	const { resolvedTheme } = useTheme();
	const color = resolvedTheme === 'dark' ? '#004197' : '#006FFF';

	return (
		<NoSSR>
			<AppProgressProvider
				height='4px'
				color={color}
				options={{
					showSpinner: false,
					trickle: true,
					trickleSpeed: 200,
					minimum: 0.08,
					easing: 'ease',
					speed: 200,
					template: '<div class="bar"><div class="peg"></div></div>',
				}}
				shallowRouting
			>
				{children}
			</AppProgressProvider>
		</NoSSR>
	);
};

export { BProgressProvider };
