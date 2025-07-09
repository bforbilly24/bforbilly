'use client';

import { useEffect, useRef } from 'react';

const currentYear = new Date().getFullYear();

const ConsoleLogger = () => {
	const hasLogged = useRef(false);

	useEffect(() => {
		if (!hasLogged.current) {
			console.log(`%c Copyright © ${currentYear} %cBforbilly24 %cAll rights reserved.`, 'color: #FFFFFF; background: #0052FE; font-size: 14px; padding: 5px 10px; border-radius: 5px 0 0 5px;', 'color: #0052FE; background: #FFFFFF; font-size: 14px; padding: 5px 10px;', 'color: #FFFFFF; background: #0052FE; font-size: 14px; padding: 5px 10px; border-radius: 0 5px 5px 0;');
			hasLogged.current = true;
		}
	}, []);

	return null;
};

export { ConsoleLogger };
