import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

const SliderText = ({ currentText }) => (
  <>
    <ambientLight intensity={0.5} />
    <Text
      position={[0, 0, 0]}
      fontSize={5.7}
      color="white"
      lineHeight={1}
      textAlign="center"
      font="/fonts/Sunwish Maverick.ttf"
      anchorX="center"
      anchorY="middle"
    >
      {currentText}
    </Text>
  </>
);

const BeforeAfterSlider = ({ beforeImage, afterImages, texts }) => {
  const sliderRef = useRef(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const step = 100 / afterImages.length;
    const newIndex = Math.floor((100 - sliderPosition) / step);
    if (newIndex !== currentImageIndex && newIndex < afterImages.length) {
      setCurrentImageIndex(newIndex);
    }
  }, [sliderPosition, afterImages.length, currentImageIndex]);

  const handleMouseMove = (event) => {
    requestAnimationFrame(() => {
      if (!sliderRef.current) return;
      const { left, width } = sliderRef.current.getBoundingClientRect();
      const newPosition = ((event.clientX - left) / width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, newPosition)));
    });
  };

  return (
    <div
      ref={sliderRef}
      style={{
        marginTop: "28em",
        marginBottom: "18em",
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        cursor: "ew-resize",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* 3D Text Canvas */}
      <Canvas
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "20vh",
          zIndex: 3,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.group
            key={currentImageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <SliderText currentText={texts[currentImageIndex]} />
          </motion.group>
        </AnimatePresence>
      </Canvas>

      {/* Before Image */}
      <img
        src={beforeImage}
        alt="Before"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* After Images */}
      {afterImages.map((image, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            zIndex: 2,
          }}
        >
          <img
            src={image}
            alt={`After ${index}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      ))}

      {/* Slider Line */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: `${sliderPosition}%`,
          width: "3px",
          height: "100%",
          background: "white",
          transform: "translateX(-50%)",
          zIndex: 3,
        }}
        animate={{ left: `${sliderPosition}%` }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
    </div>
  );
};

export default BeforeAfterSlider;
