import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Plane, PerspectiveCamera, Box, Sphere, useGLTF, useTexture } from '@react-three/drei';
import Rainbow from './Rainbow';

const Model = ({ mouse }) => {
  const { scene } = useGLTF('/scene.gltf'); 
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      // Rotate the 3D model based on mouse movement
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.2;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.2;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.5} position={[0, -1, 0]} />;
};

// Component for loading letter images
const Letter = ({ image, position }) => {
  const texture = useTexture(image); // Load the image as a texture

  if (!texture) return null; // Ensure texture is loaded before rendering

  return (
    <Plane position={position} args={[2, 2]}>
      {/* Set transparent to true and background to white or transparent */}
      <meshBasicMaterial attach="material" map={texture} transparent={true} opacity={1} />
    </Plane>
  );
};

const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cameraRef = useRef();
  const textRef = useRef();

  useImperativeHandle(ref, () => ({
    setMouse: (newMouse) => {
      setMouse(newMouse);
    },
  }));

  useFrame(() => {
    if (cameraRef.current) {
      // Move the camera slowly based on the mouse
      cameraRef.current.position.x += (mouse.x * 6 - cameraRef.current.position.x) * 0.2;
      cameraRef.current.position.y += (mouse.y * 3 - cameraRef.current.position.y) * 0.2;
    }

    if (textRef.current) {
      // Slow down the letter movement even more by reducing the interpolation factor further
      const textX = mouse.x * 6;
      const textY = mouse.y * 3;
      textRef.current.position.x += (textX - textRef.current.position.x) * 0.01; // Slower movement
      textRef.current.position.y += (textY - textRef.current.position.y) * 0.01; // Slower movement
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      <Sky sunPosition={[100, 20, 100]} />
      <Rainbow />

      {/* Cloud planes */}
      <Plane position={[-4, 2, -15]} args={[8, 3]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="white" opacity={0.5} transparent />
      </Plane>
      <Plane position={[4, 3, -10]} args={[3, 1]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="white" opacity={0.5} transparent />
      </Plane>
      <Plane position={[1, 1, -8]} args={[3, 1]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="white" opacity={0.5} transparent />
      </Plane>

      {/* 3D Text */}
      <Box position={[-1.5, 0, 0]} />
      <Sphere position={[1.5, 0, 0]} args={[0.5, 32, 32]} />

      {/* Letters as flat images */}
      <Letter image="/letters/B.png" position={[-4, 0, 0]} />
      <Letter image="/letters/L.png" position={[-2, 0, 0]} />
      <Letter image="/letters/O.png" position={[0, 0, 0]} />
      {/* <Letter image="/letters/W.png" position={[2, 0, 0]} />
      <Letter image="/letters/M.png" position={[4, 0, 0]} />
      <Letter image="/letters/I.png" position={[6, 0, 0]} />
      <Letter image="/letters/N.png" position={[8, 0, 0]} />
      <Letter image="/letters/D.png" position={[10, 0, 0]} /> */}

      {/* Interactive Rotating 3D Model */}
      <Model mouse={mouse} />
    </>
  );
});

export default FantasyScene;
