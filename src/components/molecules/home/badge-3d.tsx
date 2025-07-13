'use client';
import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, Preload } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Loader2 } from 'lucide-react';
import { Band } from '@/components/atoms/band';

const Badge3D = memo(() => {
	return (
		<div
			className='relative h-[32rem] w-full max-w-lg lg:h-full lg:w-full 2xl:h-[48rem]'
			style={{
				touchAction: 'none',
			}}
			onTouchStart={e => {
				e.stopPropagation();
			}}
			onMouseDown={e => {
				e.stopPropagation();
			}}
		>
			<Suspense
				fallback={
					<div className='flex h-full w-full items-center justify-center'>
						<Loader2 className='size-8 animate-spin text-muted-foreground' />
					</div>
				}
			>
				<Canvas
					camera={{ position: [0, 0, 13], fov: 25 }}
					style={{
						backgroundColor: 'transparent',
						touchAction: 'none',
					}}
					gl={{ 
						antialias: false, 
						alpha: true,
						powerPreference: 'high-performance',
						stencil: false,
						depth: true
					}}
					dpr={[1, 2]}
					performance={{ min: 0.5 }}
				>
					<ambientLight intensity={Math.PI} />
					<Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
						<Band />
					</Physics>
					<Environment>
						<Lightformer intensity={2} color='white' position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
						<Lightformer intensity={3} color='white' position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
						<Lightformer intensity={3} color='white' position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
						<Lightformer intensity={10} color='white' position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
					</Environment>
					<Preload all />
				</Canvas>
			</Suspense>
		</div>
	);
});

Badge3D.displayName = 'Badge3D';

export { Badge3D };
