import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Cloud = () => {
  const cloudRef = useRef();

  useEffect(() => {
    const cloudMesh = cloudRef.current;

    // Change the cloud color to white and demi-transparent
    cloudMesh.material.color.set(0xffffff); // Set color to white
    cloudMesh.material.transparent = true; // Enable transparency
    cloudMesh.material.opacity = 0.5; // Set opacity to 50%
  }, []);

  return (
    <mesh ref={cloudRef} position={[0, 0, 0]} scale={[3, 3, 3]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={0xffffff} transparent opacity={0.5} />
    </mesh>
  );
};

const FantasyScene = React.forwardRef((props, ref) => {
  const cloudRef = useRef();

  useEffect(() => {
    const animateClouds = () => {
      if (cloudRef.current) {
        const elapsedTime = Date.now() * 0.001;
        // Reduce the trembling intensity by adjusting the multiplier
        const trembleIntensity = 0.1; // Change this value to reduce trembling
        const x = Math.sin(elapsedTime) * trembleIntensity;
        const y = Math.cos(elapsedTime) * trembleIntensity;
        cloudRef.current.position.x = x;
        cloudRef.current.position.y = y;
      }
      requestAnimationFrame(animateClouds);
    };
    animateClouds();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Cloud ref={cloudRef} />
      <Stars />
      <OrbitControls />
    </>
  );
});

export default FantasyScene;
