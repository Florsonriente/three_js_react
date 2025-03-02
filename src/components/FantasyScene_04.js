import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Plane, PerspectiveCamera, Box, Sphere, useGLTF, useTexture } from '@react-three/drei';
import Rainbow from './Rainbow';

const Model = ({ mouse }) => {
  const { scene } = useGLTF('/scene.gltf');
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

const Letter = ({ image, position, mouse }) => {
  const texture = useTexture(image);
  const letterRef = useRef();
  const [letterPos, setLetterPos] = useState(position);

  useFrame(() => {
    const targetX = mouse.x * 2 + position[0];
    const targetY = mouse.y * 1.5 + position[1];

    setLetterPos((prevPos) => [
      prevPos[0] + (targetX - prevPos[0]) * 0.1,
      prevPos[1] + (targetY - prevPos[1]) * 0.1,
      prevPos[2],
    ]);

    if (letterRef.current) {
      letterRef.current.rotation.y = mouse.x * Math.PI * 0.1;
      letterRef.current.rotation.x = mouse.y * Math.PI * 0.1;
    }
  });

  if (!texture) return null;

  return (
    <Plane ref={letterRef} position={letterPos} args={[2, 2]}>
      <meshBasicMaterial attach="material" map={texture} transparent={true} opacity={1} />
    </Plane>
  );
};

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
      cameraRef.current.rotation.y = mouse.x * 0.1;
      cameraRef.current.rotation.x = -mouse.y * 0.1;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      <Sky sunPosition={[100, 20, 100]} />
      <Rainbow />

      <Letter image="/letters/H.png" position={[-2, -0.5, 0]} mouse={mouse} />
      <Letter image="/letters/A.png" position={[-1, 0, 0]} mouse={mouse} />
      <Letter image="/letters/L1.png" position={[0, 0.5, 0]} mouse={mouse} />
      <Letter image="/letters/L2.png" position={[1, 0.7, 0]} mouse={mouse} />
      <Letter image="/letters/O.png" position={[2, -0.3, 0]} mouse={mouse} />
      {/* <Letter image="/letters/B.png" position={[2, 0, 0]} mouse={mouse} />
      <Letter image="/letters/L.png" position={[4, 0, 0]} mouse={mouse} />
      <Letter image="/letters/O.png" position={[6, 0, 0]} mouse={mouse} /> */}

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
