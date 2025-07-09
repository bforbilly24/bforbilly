import { useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame, ReactThreeFiber, extend } from '@react-three/fiber';
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint, RapierRigidBody } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

declare global {
	namespace JSX {
		interface IntrinsicElements {
			meshLineGeometry: ReactThreeFiber.Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
			meshLineMaterial: ReactThreeFiber.Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
		}
	}
}

const segmentProps = {
	type: 'dynamic',
	canSleep: true,
	colliders: false,
	angularDamping: 2,
	linearDamping: 2,
} as const;

const Band = ({ maxSpeed = 50, minSpeed = 10 }: { maxSpeed?: number; minSpeed?: number }) => {
	const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
	const fixed = useRef<RapierRigidBody>(null);
	const j1 = useRef<RapierRigidBody>(null);
	const j2 = useRef<RapierRigidBody>(null);
	const j3 = useRef<RapierRigidBody>(null);

	const card = useRef<RapierRigidBody>(null);
	const vec = new THREE.Vector3();
	const ang = new THREE.Vector3();
	const rot = new THREE.Vector3();
	const dir = new THREE.Vector3();
	const [dragged, drag] = useState<THREE.Vector3 | false>(false);
	const [hovered, hover] = useState(false);

	const { nodes, materials } = useGLTF('/3d-badge/tag.glb');
	const texture = useTexture('https://res.cloudinary.com/bforbilly/image/upload/bforbilly/3d-badge/band');

	const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));

	useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
	useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
	useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);

	useSphericalJoint(j3, card, [
		[0, 0, 0],
		[0, 1.45, 0],
	]);

	useEffect(() => {
		if (hovered) {
			document.body.style.cursor = dragged ? 'grabbing' : 'grab';
			return () => void (document.body.style.cursor = 'auto');
		}
		return () => void (document.body.style.cursor = 'auto');
	}, [hovered, dragged]);

	useFrame((state, delta) => {
		if (!fixed.current || !j1.current || !j2.current || !j3.current || !band.current || !card.current) return;

		if (dragged) {
			vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
			dir.copy(vec).sub(state.camera.position).normalize();
			vec.add(dir.multiplyScalar(state.camera.position.length()));
			[card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
			card.current?.setNextKinematicTranslation(vec.sub(dragged));
		}

		if (fixed.current) {
			const [j1Lerped, j2Lerped] = [j1, j2].map(ref => {
				if (ref.current) {
					const translation = ref.current.translation();
					const lerped = new THREE.Vector3(translation.x, translation.y, translation.z);

					const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(new THREE.Vector3(translation.x, translation.y, translation.z))));

					return lerped.lerp(new THREE.Vector3(translation.x, translation.y, translation.z), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
				}
			});

			// Convert Rapier Vector to THREE.Vector3
			const j3Translation = j3.current.translation();
			curve.points[0].copy(new THREE.Vector3(j3Translation.x, j3Translation.y, j3Translation.z));
			curve.points[1].copy(j2Lerped ?? new THREE.Vector3(j2.current.translation().x, j2.current.translation().y, j2.current.translation().z));
			curve.points[2].copy(j1Lerped ?? new THREE.Vector3(j1.current.translation().x, j1.current.translation().y, j1.current.translation().z));
			
			const fixedTranslation = fixed.current.translation();
			curve.points[3].copy(new THREE.Vector3(fixedTranslation.x, fixedTranslation.y, fixedTranslation.z));
			band.current.geometry.setPoints(curve.getPoints(32));

			// Convert Rapier angular velocity and rotation to THREE.Vector3
			const angularVel = card.current.angvel();
			const rotation = card.current.rotation();
			ang.copy(new THREE.Vector3(angularVel.x, angularVel.y, angularVel.z));
			rot.copy(new THREE.Vector3(rotation.x, rotation.y, rotation.z));
			card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, false);
		}
	});

	curve.curveType = 'chordal';
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	return (
		<>
			<group position={[0, 4.6, 0]}>
				<RigidBody ref={fixed} {...segmentProps} type='fixed' />
				<RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
					<BallCollider args={[0.1]} />
				</RigidBody>

				<RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
					<CuboidCollider args={[0.8, 1.125, 0.01]} />
					<group
						scale={2.25}
						position={[0, -1.25, -0.05]}
						onPointerOver={() => hover(true)}
						onPointerOut={() => hover(false)}
						onPointerUp={e => ((e.target as Element)?.releasePointerCapture(e.pointerId), drag(false))}
						onPointerDown={e => {
							(e.target as Element)?.setPointerCapture(e.pointerId);
							if (card.current) {
								const cardTranslation = card.current.translation();
								const cardPos = new THREE.Vector3(cardTranslation.x, cardTranslation.y, cardTranslation.z);
								drag(new THREE.Vector3().copy(e.point).sub(cardPos));
							}
						}}
					>
						{/* @ts-expect-error geometry/map are not declared? */}
						<mesh geometry={nodes.card.geometry}>
							<meshPhysicalMaterial
								// @ts-expect-error geometry/map are not declared?
								map={materials.base.map}
								map-anisotropy={16}
								clearcoat={1}
								clearcoatRoughness={0.15}
								roughness={0.3}
								metalness={0.5}
							/>
						</mesh>
						<mesh
							// @ts-expect-error geometry/map are not declared?
							geometry={nodes.clip.geometry}
							material={materials.metal}
							material-roughness={0.3}
						/>
						{/* @ts-expect-error geometry/map are not declared? */}
						<mesh geometry={nodes.clamp.geometry} material={materials.metal} />
					</group>
				</RigidBody>
			</group>
			<mesh ref={band}>
				<meshLineGeometry />
				<meshLineMaterial color='white' depthTest={false} resolution={new THREE.Vector2(2, 1)} useMap={1} map={texture} repeat={new THREE.Vector2(-3, 1)} lineWidth={1} />
			</mesh>
		</>
	);
};

export { Band };