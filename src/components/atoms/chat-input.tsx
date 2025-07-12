'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { Textarea } from '@/components/atoms/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/avatar';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

interface ChatInputProps {
	onSendMessage: (message: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	userImage?: string;
	userName?: string;
	isReplyMode?: boolean;
	replyToName?: string;
	onCancelReply?: () => void;

	replyType?: 'self' | 'to-you' | 'you-replied' | 'normal';
}

const guestBookPlaceholders = ['Share your thoughts about my portfolio...', 'Leave feedback or suggestions...', "What's your impression of my work?", 'Tell me about your project ideas...', 'Any advice for my development journey?', 'Connect and say hello...', 'What technologies should I explore?', 'Share your coding experience...'];

export function ChatInput({ onSendMessage, placeholder, disabled = false, className, userImage, userName, isReplyMode = false, replyToName, onCancelReply, replyType = 'normal' }: ChatInputProps) {
	const [message, setMessage] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const [animating, setAnimating] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const newDataRef = useRef<any[]>([]);

	const placeholders = guestBookPlaceholders;

	const draw = useCallback(() => {
		if (!textareaRef.current) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = 800;
		canvas.height = 800;
		ctx.clearRect(0, 0, 800, 800);
		const computedStyles = getComputedStyle(textareaRef.current);

		const fontSize = parseFloat(computedStyles.getPropertyValue('font-size'));
		ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
		ctx.fillStyle = '#FFF';
		ctx.fillText(message, 16, 40);

		const imageData = ctx.getImageData(0, 0, 800, 800);
		const pixelData = imageData.data;
		const newData: any[] = [];

		for (let t = 0; t < 800; t++) {
			let i = 4 * t * 800;
			for (let n = 0; n < 800; n++) {
				let e = i + 4 * n;
				if (pixelData[e] !== 0 && pixelData[e + 1] !== 0 && pixelData[e + 2] !== 0) {
					newData.push({
						x: n,
						y: t,
						color: [pixelData[e], pixelData[e + 1], pixelData[e + 2], pixelData[e + 3]],
					});
				}
			}
		}

		newDataRef.current = newData.map(({ x, y, color }) => ({
			x,
			y,
			r: 1,
			color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
		}));
	}, [message]);

	const animate = (start: number) => {
		const animateFrame = (pos: number = 0) => {
			requestAnimationFrame(() => {
				const newArr = [];
				for (let i = 0; i < newDataRef.current.length; i++) {
					const current = newDataRef.current[i];
					if (current.x < pos) {
						newArr.push(current);
					} else {
						if (current.r <= 0) {
							current.r = 0;
							continue;
						}
						current.x += Math.random() > 0.5 ? 1 : -1;
						current.y += Math.random() > 0.5 ? 1 : -1;
						current.r -= 0.05 * Math.random();
						newArr.push(current);
					}
				}
				newDataRef.current = newArr;
				const ctx = canvasRef.current?.getContext('2d');
				if (ctx) {
					ctx.clearRect(pos, 0, 800, 800);
					newDataRef.current.forEach(t => {
						const { x: n, y: i, r: s, color: color } = t;
						if (n > pos) {
							ctx.beginPath();
							ctx.rect(n, i, s, s);
							ctx.fillStyle = color;
							ctx.strokeStyle = color;
							ctx.stroke();
						}
					});
				}
				if (newDataRef.current.length > 0) {
					animateFrame(pos - 8);
				} else {
					setMessage('');
					setAnimating(false);
				}
			});
		};
		animateFrame(start);
	};

	const vanishAndSubmit = () => {
		if (!message.trim() || disabled || animating) return;

		setAnimating(true);
		draw();

		if (message && textareaRef.current) {
			const maxX = newDataRef.current.reduce((prev, current) => (current.x > prev ? current.x : prev), 0);
			animate(maxX);

			setTimeout(() => {
				onSendMessage(message.trim());
			}, 1000);
		}
	};

	const startAnimation = () => {
		intervalRef.current = setInterval(() => {
			setCurrentPlaceholder(prev => {
				const next = (prev + 1) % placeholders.length;
				return next;
			});
		}, 3000);
	};

	const handleVisibilityChange = () => {
		if (document.visibilityState !== 'visible' && intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		} else if (document.visibilityState === 'visible') {
			startAnimation();
		}
	};

	useEffect(() => {
		startAnimation();
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	useEffect(() => {
		draw();
	}, [message, draw]);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
		}
	}, [message]);

	const handleSend = () => {
		vanishAndSubmit();
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey && !animating) {
			e.preventDefault();
			vanishAndSubmit();
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
		}
	}, [message]);

	return (
		<div className={cn('relative', className)}>
			{/* Reply Mode Indicator with consistent 3-color system */}
			{isReplyMode && replyToName && (
				<div
					className={cn(
						'flex items-center gap-2 border-b px-3 py-2',
						replyType === 'self'
							? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
							: replyType === 'to-you'
								? 'border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/30'
								: replyType === 'you-replied'
									? 'border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30'
									: 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30',
					)}
				>
					<div className={cn('h-2 w-2 rounded-full', replyType === 'self' ? 'bg-green-500' : replyType === 'to-you' ? 'bg-purple-500' : replyType === 'you-replied' ? 'bg-orange-500' : 'bg-blue-500')}></div>
					<span className={cn('text-xs font-medium sm:text-sm', replyType === 'self' ? 'text-green-600 dark:text-green-400' : replyType === 'to-you' ? 'text-purple-600 dark:text-purple-400' : replyType === 'you-replied' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400')}>Replying to {replyToName}</span>
					{onCancelReply && (
						<button
							onClick={onCancelReply}
							className={cn(
								'ml-auto flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors',
								replyType === 'self'
									? 'text-green-500 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20'
									: replyType === 'to-you'
										? 'text-purple-500 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/20'
										: replyType === 'you-replied'
											? 'text-orange-500 hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-900/20'
											: 'text-blue-500 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/20',
							)}
						>
							<span className='sr-only'>Cancel reply</span>✕
						</button>
					)}
				</div>
			)}

			{/* Input Container */}
			<div className={cn('flex items-center border-t bg-background p-3 transition-all duration-300 ease-in-out', isFocused ? 'gap-1 md:gap-3' : 'gap-3')}>
				{/* User Avatar */}
				{userImage && (
					<div className={cn('flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out', isFocused ? 'w-0 opacity-0 md:w-8 md:opacity-100' : 'w-8 opacity-100')}>
						<Avatar className='h-8 w-8'>
							<AvatarImage src={userImage} alt={userName || 'User'} />
							<AvatarFallback className='bg-blue-100 text-xs text-blue-600'>{userName?.charAt(0) || 'U'}</AvatarFallback>
						</Avatar>
					</div>
				)}

				{/* Message Input with Animated Placeholder */}
				<div className={cn('relative transition-all duration-300 ease-in-out', isFocused ? 'flex-1' : 'flex-1', userImage && isFocused ? 'md:ml-0' : '')}>
					<div className='relative'>
						{/* Canvas for vanish effect */}
						<canvas className={cn('pointer-events-none absolute left-4 top-2 z-40 origin-top-left scale-50 transform border-none text-base invert filter dark:invert-0', !animating ? 'opacity-0' : 'opacity-100')} ref={canvasRef} />

						<Textarea
							ref={textareaRef}
							value={message}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								if (!animating) {
									setMessage(e.target.value);
								}
							}}
							onKeyPress={handleKeyPress}
							onFocus={handleFocus}
							onBlur={handleBlur}
							placeholder=''
							disabled={disabled || animating}
							className={cn(
								'relative z-20 max-h-[100px] min-h-[40px] resize-none rounded-xl border-gray-300 bg-background px-3 pr-10 text-xs text-foreground transition-colors focus:border-blue-500 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 sm:max-h-[120px] sm:min-h-[44px] sm:px-4 sm:pr-12 sm:text-sm md:text-base dark:border-gray-600 dark:focus:border-gray-500',
								animating && 'text-transparent',
							)}
							rows={1}
						/>

						{/* Animated Placeholder */}
						{!message && !animating && (
							<div className='pointer-events-none absolute inset-0 z-30 flex items-center bg-background/20 pl-3 sm:pl-4'>
								<AnimatePresence mode='wait'>
									<motion.span
										key={`placeholder-${currentPlaceholder}`}
										initial={{
											y: 5,
											opacity: 0,
										}}
										animate={{
											y: 0,
											opacity: 1,
										}}
										exit={{
											y: -15,
											opacity: 0,
										}}
										transition={{
											duration: 0.3,
											ease: 'linear',
										}}
										className='max-w-[calc(100%-3rem)] truncate text-xs font-normal text-gray-500 sm:max-w-[calc(100%-4rem)] sm:text-sm md:text-base'
									>
										{placeholders[currentPlaceholder]}
									</motion.span>
								</AnimatePresence>
							</div>
						)}
					</div>
				</div>

				{/* Send Button */}
				<Button onClick={handleSend} disabled={!message.trim() || disabled || animating} className='h-11 w-11 flex-shrink-0 rounded-xl bg-blue-500 p-0 transition-colors hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600'>
					<Send className='h-5 w-5 text-white' />
				</Button>
			</div>
		</div>
	);
}
