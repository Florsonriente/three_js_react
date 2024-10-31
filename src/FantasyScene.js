import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'; // Add React import
import { useFrame } from '@react-three/fiber';
import { Sky, Cloud, PerspectiveCamera } from '@react-three/drei';
import Rainbow from './Rainbow'; // Ensure Rainbow is correctly imported

const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cameraRef = useRef();

  useImperativeHandle(ref, () => ({
    setMouse: (newMouse) => {
      setMouse(newMouse);
    },
  }));

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x = mouse.x * 5;
      cameraRef.current.position.y = mouse.y * 2;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      <Sky sunPosition={[100, 20, 100]} />
      <Rainbow />
      <Cloud position={[-4, 2, -15]} speed={0.2} opacity={0.7} />
      <Cloud position={[4, 3, -10]} speed={0.2} opacity={0.7} />
      <Cloud position={[1, 1, -8]} speed={0.2} opacity={0.7} />
    </>
  );
});

export FantasyScene; // Ensure you have this line
