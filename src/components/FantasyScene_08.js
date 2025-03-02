import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane, PerspectiveCamera, Box, Sphere, useGLTF, useTexture } from '@react-three/drei';
import Rainbow from './Rainbow';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { MeshStandardMaterial, BufferGeometry } from 'three';
import * as THREE from 'three';

const TreeModel = ({ position }) => {
  const tree = useLoader(TDSLoader, '/tree1_3ds/Tree1.3ds');
  return <primitive object={tree} position={position} scale={[0.1, 0.1, 0.1]} />;
};

const StoneModel = ({ position, scale = [3, 2, 3] }) => {
  const { scene } = useGLTF('/models_stone/scene.gltf');
  return <primitive object={scene} position={position} scale={scale} />;
};

const Model = ({ mouse, scrollY }) => {
  const { scene } = useGLTF('/scene.gltf');
  const modelRef = useRef();
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.2;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.2;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.1;
      modelRef.current.position.y = -1 + scrollY * 5;
    }
  });
  return <primitive ref={modelRef} object={scene} scale={0.5} position={[2, -1, 0]} />;
};

const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const cameraRef = useRef();

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
      <Rainbow />

      <TreeModel position={[0, -1, -3]} />
      <StoneModel position={[-2, -1.5, -3]} />
      <StoneModel position={[1, -1.2, -2]} scale={[0.15, 0.15, 0.15]} />
      <StoneModel position={[3, -1.8, -4]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </>
  );
});

export default FantasyScene;
