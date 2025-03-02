import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";

const ExpertiseBlock_01 = () => {
  const styles = {
    container: {
        marginTop:"18em" ,
      position: 'relative',
      width: '100vw',
      height: '100vh',
    //   backgroundColor: '#1a202c',
      overflow: 'hidden',
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    overlayText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      fontSize: 'clamp(3rem, 10vw, 10rem)',
      whiteSpace: 'wrap',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <Canvas style={styles.canvas}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} />

        <Text
          position={[0, -2, 0]}
          fontSize={0.1}
          color="white"
        maxWidth={12}
          lineHeight={1.2}
          textAlign="center"
          font="/fonts/Sunwish Maverick.ttf"
          anchorX="center"
          anchorY="middle"
          whiteSpace="normal"
        >
          made with Love to me, to AI, to what I do.
          by Alenka.
        </Text>
      </Canvas>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={styles.overlayText}
      >
        {/* <p>This is a placeholder for your 3D full-screen experience.</p> */}
      </motion.div>
    </div>
  );
};

export default ExpertiseBlock_01;
