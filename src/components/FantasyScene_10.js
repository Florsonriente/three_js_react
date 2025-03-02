import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane, PerspectiveCamera, Box, Sphere, useGLTF, useTexture } from '@react-three/drei';
import Rainbow from './Rainbow';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { MeshStandardMaterial, BufferGeometry } from 'three';
import * as THREE from 'three';  

// 🌳 Tree Model
const TreeModel = ({ position }) => {
  const tree = useLoader(TDSLoader, '/tree1_3ds/Tree1.3ds');  
  const [hovered, setHovered] = useState(false);

  tree.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: hovered ? 'yellow' : 'green' });
    }
  });

  return (
    <primitive
      object={tree}
      position={position}
      scale={[0.1, 0.1, 0.1]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
};

// 🐶 3D Dog Model
const Model = ({ mouse, scrollY }) => {
  const { scene } = useGLTF('/scene.gltf');
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.5;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.5;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.8;

      // Move model smoothly with scroll
      modelRef.current.position.y = -1 + scrollY * 2;  
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.5} position={[2, -1, 2.5]} />;
};

// 🅰️ Animated Letters
const Letter = ({ image, position, mouse, scrollY }) => {
  const texture = useTexture(image);
  const [letterPos, setLetterPos] = useState(position);
  const [scale, setScale] = useState(1);

  useFrame(() => {
    const targetX = mouse.x * 2 + position[0];
    const targetY = mouse.y * 1.5 + position[1] - scrollY * 3;

    setLetterPos((prevPos) => [
      prevPos[0] + (targetX - prevPos[0]) * 0.1,
      prevPos[1] + (targetY - prevPos[1]) * 0.1,
      prevPos[2],
    ]);

    const scaleValue = 1 + Math.sin(scrollY * Math.PI) * 0.3; 
    setScale(scaleValue);
  });

  return (
    <Plane position={letterPos} args={[2, 2]} scale={[scale, scale, scale]}>
      <meshBasicMaterial attach="material" map={texture} transparent opacity={1} />
    </Plane>
  );
};

// 📏 3D Grid Component
const Grid = () => {
  return <gridHelper args={[10, 10, 'pink', 'gray']} />;
};

// 🎨 Gradient Box
const GradientBox = ({ position }) => {
  return (
    <Box position={position} scale={[1, 1, 1]}>
      <meshStandardMaterial color="violet" />
    </Box>
  );
};

// 🪨 Stone Model
const StoneModel = ({ position, scale = [3, 2, 3] }) => {
  const { scene } = useGLTF('/models_stone/scene.gltf');
  return <primitive object={scene} position={position} scale={scale} />;
};

// 🌈 Fantasy Scene
const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const cameraRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY / window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useImperativeHandle(ref, () => ({
    setMouse: (newMouse) => {
      setMouse(newMouse);
    },
  }));

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x += (mouse.x * 6 - cameraRef.current.position.x) * 0.2;
      cameraRef.current.position.y += (mouse.y * 3 - cameraRef.current.position.y) * 0.2;
      cameraRef.current.position.z = 5 - scrollY * 5; 
    }

    if (textRef.current) {
      const textX = mouse.x * 6;
      const textY = mouse.y * 3;
      textRef.current.position.x += (textX - textRef.current.position.x) * 0.05;
      textRef.current.position.y += (textY - textRef.current.position.y) * 0.05;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />

      {/* Grid & Rainbow */}
      <Grid />
      <Rainbow />

      {/* Cloud Planes */}
      <Plane position={[-2, 2, -15]} args={[8, 3]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="lila" opacity={0.99} transparent />
      </Plane>
      <Plane position={[6, 3, -10]} args={[3, 1]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="black" opacity={0.99} transparent />
      </Plane>

      {/* 3D Objects */}
      <GradientBox position={[-1.5, -1.8, 0]} />
      <Sphere position={[1.5, 1.5, 0]} />

      {/* Stones & Trees */}
      <StoneModel position={[-2, -1.5, -3]} />
      <StoneModel position={[1, -1.2, -2]} scale={[0.15, 0.15, 0.15]} />
      <StoneModel position={[3, -1.8, -4]} />

      <TreeModel position={[-3, -1.2, -2]} />
      <TreeModel position={[2, -1.5, -3]} />
      <TreeModel position={[4, -1.8, -5]} />

      {/* Letters */}
      <Letter image="/letters/H.png" position={[-1.5, 0, 0.5]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/A.png" position={[-1, 0, 0]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/L1.png" position={[0, 0, 0]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/L2.png" position={[0.5, 0, 0]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/O.png" position={[1, 0, -0.5]} mouse={mouse} scrollY={scrollY} />

      {/* 3D Model */}
      <Model mouse={mouse} scrollY={scrollY} />

      {/* Lighting */}
      <ambientLight intensity={0.95} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </>
  );
});

export default FantasyScene;
