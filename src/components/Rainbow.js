import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Rainbow = () => {
  const arcRef = useRef();
  
  useFrame(() => {
    if (arcRef.current) arcRef.current.rotation.y += 0.01; // Slow rainbow spin
  });

  return (
    <mesh ref={arcRef} position={[0, 1, -10]} rotation={[1.5, 0, 0]}>
      <torusGeometry args={[4, 0.2, 16, 100]} />
      <meshStandardMaterial color="rgb(199, 22, 184)"  />
    </mesh>
  );
};

export default Rainbow; // Ensure you export the component
