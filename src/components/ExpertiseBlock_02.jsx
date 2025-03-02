import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import styled from "styled-components";

// Button styling from Timeline
const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #c71654;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #ff4081;
    transform: scale(1.1);
  }
`;

const ExpertiseBlock = () => {
  const handleButtonClick = () => {
    alert("Explore more about expertise!");
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", marginTop:"48em" }}>
      <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} />

        {/* 3D Text and Html button */}
        <group position={[0, 0, 0]}>
          <Text
            fontSize={0.99}
            color="white"
            maxWidth={12}
            lineHeight={1.2}
            textAlign="center"
            font="/fonts/Sunwish Maverick.ttf"
            anchorX="center"
            anchorY="middle"
            whiteSpace="normal"
          >
            I believe in the power of soft skills.
          </Text>

          {/* Html places the button relative to the 3D text */}
          <Html position={[0, -1.2, 0]} center>
            <Button onClick={handleButtonClick}>See References</Button>
          </Html>
        </group>
      </Canvas>
    </div>
  );
};

export default ExpertiseBlock;
