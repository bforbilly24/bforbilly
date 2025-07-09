'use client';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Band } from '../atoms/band';
import { Loader2 } from 'lucide-react';


const Badge3D = () => {
	return (
		<div className='relative max-w-lg h-[32rem] w-full lg:h-full 2xl:h-[48rem] lg:w-full'>
			<Suspense
				fallback={
					<div className='flex h-full w-full items-center justify-center'>
						<Loader2 className='size-8 animate-spin text-muted-foreground' />
					</div>
				}
			>
				<Canvas camera={{ position: [0, 0, 13], fov: 25 }} style={{ backgroundColor: 'transparent' }}>
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
				</Canvas>
			</Suspense>
		</div>
	);
}


export { Badge3D }