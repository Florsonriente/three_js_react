import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useGLTF, Plane, PerspectiveCamera, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import Rainbow from './Rainbow';

// ✅ Corrected TreeModel (Using TDSLoader properly)
const TreeModel = ({ position }) => {
  const loader = new TDSLoader();
  const [tree, setTree] = useState(null);
  
  useEffect(() => {
    loader.load('/tree1_3ds/Tree1.3ds', (model) => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: 'green' });
        }
      });
      setTree(model);
    });
  }, []);

  return tree ? <primitive object={tree} position={position} scale={[0.1, 0.1, 0.1]} /> : null;
};

// ✅ Corrected StoneModel (useGLTF comes from @react-three/drei)
const StoneModel = ({ position, scale = [3, 2, 3] }) => {
  const { scene } = useGLTF('/models_stone/scene.gltf');
  return <primitive object={scene} position={position} scale={scale} />;
};

// ✅ Floating Letter Component
const Letter = ({ image, position, mouse, scrollY }) => {
  const texture = useLoader(THREE.TextureLoader, image);
  const [letterPos, setLetterPos] = useState(position);
  const [scale, setScale] = useState(1);

  useFrame(() => {
    setLetterPos([
      mouse.x * 2 + position[0],
      mouse.y * 1.5 + position[1] - scrollY * 5,
      position[2],
    ]);
    setScale(1 + Math.sin(scrollY * Math.PI) * 0.5);
  });

  return (
    <Plane position={letterPos} args={[2, 2]} scale={[scale, scale, scale]}>
      <meshBasicMaterial attach="material" map={texture} transparent />
    </Plane>
  );
};

// ✅ Grid Component
const Grid = () => {
  const gridRef = useRef();

  useEffect(() => {
    const gridSize = 10;
    const gridSpacing = 0.35;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let x = -gridSize; x <= gridSize; x += gridSpacing) {
      positions.push(x, -gridSize, 0, x, gridSize, 0);
    }
    for (let y = -gridSize; y <= gridSize; y += gridSpacing) {
      positions.push(-gridSize, y, 0, gridSize, y, 0);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    gridRef.current.geometry = geometry;
  }, []);

  return (
    <lineSegments ref={gridRef}>
      <lineBasicMaterial color="pink" />
    </lineSegments>
  );
};

// ✅ Main FantasyScene Component
const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const cameraRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY / window.innerHeight);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useImperativeHandle(ref, () => ({
    setMouse: (newMouse) => setMouse(newMouse),
  }));

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x += (mouse.x * 6 + 1 - cameraRef.current.position.x) * 0.2;
      cameraRef.current.position.y += (mouse.y * 3 - cameraRef.current.position.y) * 0.2;
      cameraRef.current.position.z = 5 - scrollY * 10;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      <Grid />
      <Rainbow />

      {/* Objects */}
      <Box position={[-1.5, -1.8, 0]} rotation={[Math.PI / 3, Math.PI / 2, 0]} scale={[1, 1, 1]}>
        <meshStandardMaterial color="violet" />
      </Box>
      <Sphere position={[1.5, 1.5, 0]} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="orange" />
      </Sphere>

      {/* Trees & Stones */}
      <TreeModel position={[0, -1, -3]} />
      <StoneModel position={[-2, -1.5, -3]} />
      <StoneModel position={[1, -1.2, -2]} scale={[0.15, 0.15, 0.15]} />
      <StoneModel position={[3, -1.8, -4]} />

      {/* Floating Letters */}
      {['H', 'A', 'L1', 'L2', 'O', 'C', 'H'].map((letter, i) => (
        <Letter key={i} image={`/letters/${letter}.png`} position={[-2 + i, 0, 0]} mouse={mouse} scrollY={scrollY} />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </>
  );
});

export default FantasyScene;
