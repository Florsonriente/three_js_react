import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, PerspectiveCamera, Box, Sphere, useGLTF, OrbitControls } from '@react-three/drei';
import { AmbientLight, DirectionalLight } from 'three'; // Import lights from three.js
import Rainbow from './Rainbow';

// LetterModel Component (3D Model for Each Letter)
const LetterModel = ({ modelPath, position, mouse }) => {
  const { scene } = useGLTF(modelPath); // Load the model using GLTF
  const letterRef = useRef();

  useFrame(() => {
    if (letterRef.current) {
      letterRef.current.rotation.y = mouse.x * 0.2;
      letterRef.current.rotation.x = mouse.y * 0.2;
    }
  });

  return <primitive ref={letterRef} object={scene} position={position} />;
};

// Box with Rotation
const BoxWithRotation = ({ position }) => {
  const boxRef = useRef();

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.02; 
      boxRef.current.rotation.x += 0.02; 
    }
  });

  return (
    <Box ref={boxRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial attach="material" color="blue" />
    </Box>
  );
};

// Sphere with Rotation
const SphereWithRotation = ({ position, args }) => {
  const sphereRef = useRef();

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.03;
      sphereRef.current.rotation.x += 0.03;
    }
  });

  return (
    <Sphere ref={sphereRef} position={position} args={args}>
      <meshStandardMaterial attach="material" color="red" />
    </Sphere>
  );
};

// Model Component (3D Model for a larger object)
const Model = ({ mouse }) => {
  const { scene } = useGLTF('/models/scene.gltf'); // Update this path with the actual model path
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.2;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.2;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.5} position={[2, -1, 0]} />;
};

// Main FantasyScene Component
const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cameraRef = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]; 
        setMouse({
          x: (touch.clientX / window.innerWidth) * 2 - 1,
          y: -(touch.clientY / window.innerHeight) * 2 + 1,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    setMouse: (newMouse) => {
      setMouse(newMouse);
    },
  }));

  useFrame(() => {
    if (cameraRef.current) {
      // Limit the camera's rotation
      cameraRef.current.rotation.y = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, mouse.x * 0.1));
      cameraRef.current.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, -mouse.y * 0.1));
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      <Sky sunPosition={[100, 20, 100]} />
      <Rainbow />

      {/* Add lights */}
      <ambientLight intensity={0.5} />  {/* Ambient light from three.js */}
      <DirectionalLight position={[5, 5, 5]} intensity={1} />  {/* Directional light */}

      {/* Replace Letter components with 3D Letter models */}
      <LetterModel modelPath="/models/A.gltf" position={[-4, 0, 0]} mouse={mouse} />
      <LetterModel modelPath="/models/B.gltf" position={[-2, 0, 0]} mouse={mouse} />
      <LetterModel modelPath="/models/C.gltf" position={[0, 0, 0]} mouse={mouse} />
   
      {/* 🟦 3D Cube */}
      <BoxWithRotation position={[1.5, 0, 0]} />

      {/* 🔴 3D Sphere */}
      <SphereWithRotation position={[3.5, 0, 0]} args={[0.5, 32, 32]} />

      {/* 🎭 Interactive 3D Model */}
      <Model mouse={mouse} />
    </>
  );
});

export default FantasyScene;
