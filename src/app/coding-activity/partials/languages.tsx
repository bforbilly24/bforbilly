'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { FadeIn } from '@/components/atoms/fade-in';
import { ClientOnly } from '@/components/atoms/client-only';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/atoms/select';
import { PageLoading } from '@/components/atoms/page-loading';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from '@/components/atoms/chart';
import { ENDPOINTS } from '@/api/endpoints';

const RANGE_OPTIONS = [
	{ label: 'Today', value: 'today' },
	{ label: 'Last 7 Days', value: 'last_7_days' },
	{ label: 'Last 30 Days', value: 'last_30_days' },
];

const Languages = () => {
	const [state, setState] = useState({
		range: 'last_7_days',
		languages: [],
		loading: true,
	});

	useEffect(() => {
		let isMounted = true;
		setState(prev => ({ ...prev, loading: true }));
		
		// Use API route instead of server action
		fetch(ENDPOINTS.LOCAL.LANGUAGES(state.range))
			.then(res => res.json())
			.then((result: any) => {
				if (isMounted) {
					if (result.success) {
						setState(prev => ({ ...prev, languages: result.data || [], loading: false }));
					} else {
						console.error('API failed:', result.error);
						setState(prev => ({ ...prev, languages: [], loading: false }));
					}
				}
			})
			.catch((error: any) => {
				console.error('Error fetching languages:', error);
				if (isMounted) setState(prev => ({ ...prev, languages: [], loading: false }));
			});
		return () => {
			isMounted = false;
		};
	}, [state.range]);

	const transformedData = state.languages
		.filter((lang: any) => lang?.name?.toLowerCase() !== 'html') // Remove HTML
		.map((lang: any, index: number) => {
			const normalizedName = lang?.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'unknown';
			
			// Use CSS variables from globals.css for blue colors
			const blueColorVars = [
				'hsl(var(--chart-typescript))', // TypeScript blue
				'hsl(var(--chart-css))', // CSS blue
				'hsl(var(--chart-python))', // Python blue
				'hsl(var(--chart-markdown))', // Markdown blue
				'hsl(var(--chart-1))', // Chart blue 1
				'hsl(var(--chart-2))', // Chart blue 2
				'hsl(var(--chart-3))', // Chart blue 3
				'hsl(var(--chart-4))', // Chart blue 4
				'hsl(var(--chart-5))', // Chart blue 5
				'hsl(var(--chart-cpp))', // C++ blue
			];
			
			return {
				name: lang?.name || 'Unknown',
				hours: Math.round((lang?.total_seconds ?? 0) / 3600 * 100) / 100,
				percent: typeof lang?.percent === 'number' ? lang.percent : 0,
				fill: blueColorVars[index % blueColorVars.length],
				normalizedName,
			};
		}).slice(0, 10);

	const totalHours = transformedData.reduce((acc, curr) => acc + curr.hours, 0);

	const chartConfig = {
		hours: {
			label: "Hours",
		},
		// Programming languages colors from globals.css
		typescript: {
			label: "TypeScript",
			color: "var(--chart-typescript)",
		},
		javascript: {
			label: "JavaScript", 
			color: "var(--chart-javascript)",
		},
		html: {
			label: "HTML",
			color: "var(--chart-html)",
		},
		css: {
			label: "CSS",
			color: "var(--chart-css)",
		},
		python: {
			label: "Python",
			color: "var(--chart-python)",
		},
		json: {
			label: "JSON",
			color: "var(--chart-json)",
		},
		markdown: {
			label: "Markdown",
			color: "var(--chart-markdown)",
		},
		bash: {
			label: "Bash",
			color: "var(--chart-bash)",
		},
		shell: {
			label: "Shell",
			color: "var(--chart-shell)",
		},
		imagesvg: {
			label: "Image (svg)",
			color: "var(--chart-1)",
		},
		text: {
			label: "Text",
			color: "var(--chart-2)",
		},
		other: {
			label: "Other",
			color: "var(--chart-3)",
		},
		mdx: {
			label: "MDX",
			color: "var(--chart-markdown)",
		},
		sshconfig: {
			label: "SSH Config",
			color: "var(--chart-4)",
		},
		php: {
			label: "PHP",
			color: "var(--chart-php)",
		},
		ini: {
			label: "INI",
			color: "var(--chart-5)",
		},
		tsconfig: {
			label: "TSConfig",
			color: "var(--chart-typescript)",
		},
		toml: {
			label: "TOML",
			color: "var(--chart-1)",
		},
		scss: {
			label: "SCSS",
			color: "var(--chart-scss)",
		},
		gitconfig: {
			label: "Git Config",
			color: "var(--chart-2)",
		},
	} satisfies ChartConfig;

	return (
		<ClientOnly
			fallback={
				<div className='flex h-full flex-1 items-center justify-center'>
					<PageLoading />
				</div>
			}
		>
			<FadeIn>
				<Card>
					<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
						<div className="grid flex-1 gap-1">
							<CardTitle>Programming Languages</CardTitle>
							<CardDescription>
								Coding activity breakdown by programming language
							</CardDescription>
						</div>
						<Select value={state.range} onValueChange={val => setState(prev => ({ ...prev, range: val }))}>
							<SelectTrigger className="w-[160px] rounded-lg">
								<SelectValue placeholder="Select range" />
							</SelectTrigger>
							<SelectContent className="rounded-xl">
								{RANGE_OPTIONS.map(opt => (
									<SelectItem key={opt.value} value={opt.value} className="rounded-lg">
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardHeader>
					<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
						{state.loading ? (
							<div className='flex h-[250px] items-center justify-center'>
								<PageLoading />
							</div>
						) : transformedData.length === 0 ? (
							<div className="flex h-[250px] items-center justify-center">
								<p className='text-sm text-muted-foreground'>No language data available</p>
							</div>
						) : (
							<ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
								<BarChart 
									accessibilityLayer 
									data={transformedData}
									layout="vertical"
									margin={{
										left: 20,
									}}
								>
									<CartesianGrid horizontal={false} />
									<XAxis 
										type="number" 
										dataKey="hours"
										tickLine={false}
										axisLine={false}
										tickMargin={10}
									/>
									<YAxis
										dataKey="name"
										type="category"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										width={120}
										tickFormatter={(value) => String(value).slice(0, 15)}
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Bar 
										dataKey="hours" 
										radius={5}
									>
										{transformedData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.fill} />
										))}
									</Bar>
								</BarChart>
							</ChartContainer>
						)}
					</CardContent>
					<CardFooter className="flex-col items-start gap-2 text-sm">
						<div className="flex gap-2 leading-none font-medium">
							{transformedData.length > 0 && (
								<>
									{transformedData[0].name} leads with {transformedData[0].hours}h 
									<TrendingUp className="h-4 w-4" />
								</>
							)}
						</div>
						<div className="text-muted-foreground leading-none">
							Showing programming language usage for {RANGE_OPTIONS.find(opt => opt.value === state.range)?.label.toLowerCase()}
						</div>
					</CardFooter>
				</Card>
			</FadeIn>
		</ClientOnly>
	);
};

export { Languages };
