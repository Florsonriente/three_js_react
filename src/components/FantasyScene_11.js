import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane, PerspectiveCamera, Box, Sphere, useGLTF, useTexture } from '@react-three/drei';
import Rainbow from './Rainbow';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { MeshStandardMaterial, LineBasicMaterial, BufferGeometry, Line } from 'three';
import * as THREE from 'three';  // <-- Add this import to fix the error



// Tree Component: Loads the 3D Tree Model
const TreeModel = ({ position }) => {
  const tree = useLoader(TDSLoader, '/tree1_3ds/Tree1.3ds'); // Corrected path

  const [hovered, setHovered] = useState(false);

  // Apply color/material
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

// DOG
const DogModel = ({ mouse, scrollY }) => {
  const { scene } = useGLTF('/scene.gltf');
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.2;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.2;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.4;

      // Move model down based on scroll
      modelRef.current.position.y = -1 + scrollY * 5; // Adjust intensity of scroll effect
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.5} position={[2, 3, 2.5]} />;
};

const Letter = ({ image, position, mouse, scrollY }) => {
  const texture = useTexture(image);
  const [letterPos, setLetterPos] = useState(position);
  const [scale, setScale] = useState(1); // State to hold the scale of the letter

  useFrame(() => {
    const targetX = mouse.x * 2 + position[0];
    const targetY = mouse.y * 1.5 + position[1] - scrollY * 5;

    setLetterPos((prevPos) => [
      prevPos[0] + (targetX - prevPos[0]) * 0.1,
      prevPos[1] + (targetY - prevPos[1]) * 0.1,
      prevPos[2],
    ]);

    // Apply scaling effect based on scrollY
    const scaleValue = 1 + Math.sin(scrollY * Math.PI) * 0.5; // Oscillate between 1 and 1.5
    console.log("scrollY:", scrollY, "Scale:", scaleValue); // Debugging scrollY and scale value
    setScale(scaleValue);
  });

  if (!texture) return null;

  return (
    <Plane position={letterPos} args={[2, 2]} scale={[scale, scale, scale]}>
      <meshBasicMaterial attach="material" map={texture} transparent={true} opacity={1} />
    </Plane>
  );
};

// 3D Grid Component
// 📏 3D Grid Component
const Grid = () => {
    return <gridHelper args={[20, 30, 'pink', 'gray']} />;
  };

// Gradient box component
const GradientBox = ({ position, rotation, scale, args }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    // Create a canvas to draw the gradient
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 256, 256); // Diagonal gradient
    gradient.addColorStop(0, 'rgb(238, 130, 238)'); // Lilac (pastel purple)
    gradient.addColorStop(0.5, 'rgb(255, 218, 185)'); // Peach
    gradient.addColorStop(1, 'rgb(255, 165, 0)'); // Orange

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    // Set the texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    setTexture(texture);
  }, []);

  return (
    <Box position={position} rotation={rotation} scale={scale} args={args} castShadow receiveShadow>
      {texture && <meshStandardMaterial map={texture} />}
    </Box>
  );
};

const StoneModel = ({ position, scale = [3, 2, 3] }) => {
    const { scene } = useGLTF('/models_stone/scene.gltf');
    return <primitive object={scene} position={position} scale={scale} />;
  };
  

const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0); // Track scroll position
  const cameraRef = useRef();
  const textRef = useRef();

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY / window.innerHeight); // Normalize scroll position
      console.log("scrollY on scroll:", window.scrollY); // Debugging scroll position
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
      cameraRef.current.position.x += (mouse.x * 6 + 1 - cameraRef.current.position.x) * 0.2;
      cameraRef.current.position.y += (mouse.y * 3 - cameraRef.current.position.y) * 0.2;
      cameraRef.current.position.z += ((5 - scrollY * 20) - cameraRef.current.position.z) * 0.2; // Smoothly interpolate zoom
    }
  
    if (textRef.current) {
      const textX = mouse.x * 6 + 1;
      const textY = mouse.y * 3;
      textRef.current.position.x += (textX - textRef.current.position.x) * 0.05;
      textRef.current.position.y += (textY - textRef.current.position.y) * 0.05;
    }
  });
  

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 3, 5]} />

      {/* 3D Grid */}
      <Grid />

      <Rainbow />

      {/* Cloud planes */}
      <Plane position={[-2, 2, -15]} args={[8, 3]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="lila" opacity={0.99} transparent />
      </Plane>
      <Plane position={[6, 3, -10]} args={[3, 1]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="black" opacity={0.99} transparent />
      </Plane>
      <Plane position={[3, 1, -8]} args={[3, 1]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="orange" opacity={0.9} transparent />
      </Plane>

      {/* 3D Objects */}
      <GradientBox
        position={[-1.5, -1.8, -5]}
        rotation={[Math.PI / 3, Math.PI / 2, 0]}
        scale={[1, 1, 1]}
        args={[1, 1, 1]}

      />

      <Sphere position={[1.5, 1.5, 0]} args={[0.5, 32, 32]} />

      {/* Imported 3D Model (Tree) */}
      <TreeModel position={[0, -1, -3]} />

<StoneModel position={[3, -1.8, -4]} />


      {/* Letters as flat images */}
      <Letter image="/letters/H.png" position={[-1.5, 0, 0.5]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/A.png" position={[-1, 0, 0]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/L1.png" position={[0, 0, 0]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/L2.png" position={[0.5, 0, 0]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/O.png" position={[1, 0, -0.5]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/C.png" position={[2, 0, 0]} mouse={mouse} scrollY={scrollY} />
      <Letter image="/letters/H.png" position={[2.5, 0, 0]} mouse={mouse} scrollY={scrollY} />

      {/* Interactive Rotating 3D Model */}
      <DogModel mouse={mouse} scrollY={scrollY} position={[2, 1, -5]} /> 

      {/* Add lighting to reveal the material */}
      <ambientLight intensity={-0.95} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </>
  );
});

export default FantasyScene;
