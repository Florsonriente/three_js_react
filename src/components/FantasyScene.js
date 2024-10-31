import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'; 
import { useFrame } from '@react-three/fiber';
import { Sky, Plane, PerspectiveCamera, Text, Box, Sphere } from '@react-three/drei';
import Rainbow from './Rainbow'; 

const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cameraRef = useRef();
  const textRef = useRef(); // Reference for the text

  // Set mouse position from parent component
  useImperativeHandle(ref, () => ({
    setMouse: (newMouse) => {
      setMouse(newMouse);
    },
  }));

  useFrame(() => {
    if (cameraRef.current) {
      // Update camera position based on mouse
      cameraRef.current.position.x = mouse.x * 5;
      cameraRef.current.position.y = mouse.y * 2;
    }

    // Update text position to follow the mouse with a slight lag
    if (textRef.current) {
      // Calculate the new position based on mouse
      const textX = mouse.x * 5; // Scale mouse x for text
      const textY = mouse.y * 2; // Scale mouse y for text
      
      // Apply a lag effect similar to clouds
      textRef.current.position.x += (textX - textRef.current.position.x) * 0.1; // Adjust the lag factor (0.1) for speed
      textRef.current.position.y += (textY - textRef.current.position.y) * 0.1; // Adjust the lag factor (0.1) for speed
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      <Sky sunPosition={[100, 20, 100]} />
      <Rainbow />

      {/* Custom cloud planes */}
      <Plane position={[-4, 2, -15]} args={[8, 3]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="white" opacity={0.5} transparent />
      </Plane>
      <Plane position={[4, 3, -10]} args={[3, 1]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="white" opacity={0.5} transparent />
      </Plane>
      <Plane position={[1, 1, -8]} args={[3, 1]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="white" opacity={0.5} transparent />
      </Plane>

      {/* 3D Text component */}
            <Box position={[-1.5, 0, 0]} />
      <Sphere position={[1.5, 0, 0]} args={[0.5, 32, 32]} />
      <Text 
        ref={textRef} 
        position={[0, 0, -5]} // Start in front of the camera
        fontSize={4} // Adjust the font size
        color="peach" // Text color
        anchorX="center" // Center the text horizontally
        anchorY="middle" // Center the text vertically
        opacity={0.9} // Text opacity
        fontFamily="" // Specify the font family if needed
      >
        BLOWMIND
      </Text>
      

    </>
  );
});

export default FantasyScene; // Correct export statement
