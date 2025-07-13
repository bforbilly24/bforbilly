'use client';

import { useEffect, useState } from 'react';

export function useMobile(breakpoint = 640) {
	const [isMobile, setIsMobile] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, [breakpoint]);

	return isClient ? isMobile : false;
}
