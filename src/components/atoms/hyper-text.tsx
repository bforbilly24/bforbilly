'use client';

import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

type CharacterSet = string[] | readonly string[];

interface HyperTextProps extends MotionProps {
	children: string;
	className?: string;
	duration?: number;
	delay?: number;
	as?: React.ElementType;
	startOnView?: boolean;
	animateOnHover?: boolean;
	characterSet?: CharacterSet;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function HyperText({
	children,
	className,
	duration = 800,
	delay = 0,
	as: Component = 'div',
	animateOnHover = true,
	characterSet = LETTERS.split(''),
	...props
}: HyperTextProps) {
	const [displayText, setDisplayText] = useState(() => children.split(''));
	const [isAnimating, setIsAnimating] = useState(false);
	const ref = useRef<HTMLElement | null>(null);

	// Scramble effect logic
	const scramble = useCallback(() => {
		let iteration = 0;
		const original: string[] = children.split('');
		function animate() {
			setDisplayText(prevText =>
				prevText.map((char, idx) => {
					if (char === ' ') return ' ';
					if (idx < iteration) return original[idx];
					// fallback ke original[idx] jika characterSet kosong
					return characterSet.length > 0 ? characterSet[Math.floor(Math.random() * characterSet.length)] : original[idx];
				}) as string[],
			);
			if (iteration < original.length) {
				iteration += 1 / 3;
				setTimeout(animate, 30);
			} else {
				setDisplayText(original);
				setIsAnimating(false);
			}
		}
		animate();
	}, [children, characterSet]);

	// Hover effect
	const handleMouseOver = useCallback(() => {
		if (isAnimating) return;
		setIsAnimating(true);
		scramble();
	}, [isAnimating, scramble]);

	// Animate on mount if not hover
	useEffect(() => {
		if (!animateOnHover) {
			setIsAnimating(true);
			scramble();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [animateOnHover, scramble]);

	// Attach/detach hover event
	useEffect(() => {
		if (!animateOnHover) return;
		const current = ref.current;
		if (current) {
			current.addEventListener('mouseover', handleMouseOver);
		}
		return () => {
			if (current) {
				current.removeEventListener('mouseover', handleMouseOver);
			}
		};
	}, [animateOnHover, handleMouseOver]);

	return (
		<Component
			ref={ref}
			className={cn('overflow-hidden py-2 text-3xl font-medium sm:text-4xl md:text-6xl', className)}
			{...props}
		>
			{displayText.map((letter, index) => (
				<span key={index} className={cn('font-mono', letter === ' ' ? 'w-3' : '')}>
					{letter.toUpperCase()}
				</span>
			))}
		</Component>
	);
}
