import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Image, Html } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";

const AnimatedImage = ({ url, position, scrollRotation, scrollScale }) => {
  const [hovered, setHovered] = useState(false);
  const imageRef = useRef();

  useFrame(() => {
    if (imageRef.current) {
      imageRef.current.rotation.y = Math.sin(scrollRotation) * 0.5;
    }
  });

  const { scale } = useSpring({
    scale: hovered ? 1.8 : scrollScale,
    config: { mass: 1, tension: 170, friction: 20 },
  });

  return (
    <a.mesh
      ref={imageRef}
      position={position}
      scale={scale.to((s) => [s, s, 1])}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Image
        url={url}
        scale={[3.2, 1.8, 1]}
        transparent
        style={{
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "15px",
        }}
      />
    </a.mesh>
  );
};

const ImageBlock = () => {
  const [scrollRotation, setScrollRotation] = useState(0);
  const [scrollScale, setScrollScale] = useState(1.4);
  const [filter, setFilter] = useState("All");

  const images = [
    { url: "/about/man_dancing.jpg", category: "AI", position: [-4.5, 2, 0] },
    { url: "/about/girls_dancing.jpg", category: "Marketing", position: [0.5, 2, 0] },
    { url: "/about/image3.png", category: "Web Development", position: [5.5, 2, 0] },
    { url: "/about/girls_dancing.jpg", category: "Marketing", position: [-3.5, -2, 0] },
    { url: "/about/man_dancing.jpg", category: "AI", position: [1.5, -2, 0] },
    { url: "/about/image3.png", category: "Web Development", position: [6.5, -2, 0] },
    { url: "/about/man_dancing.jpg", category: "AI", position: [-2.5, -6, 0] },
    { url: "/about/girls_dancing.jpg", category: "Marketing", position: [2.5, -6, 0] },
    { url: "/about/image3.png", category: "Web Development", position: [7.5, -6, 0] },
    // { url: "/about/man_dancing.jpg", category: "AI", position: [-2.5, -9, 0] },
    // { url: "/about/girls_dancing.jpg", category: "Marketing", position: [2.5, -9, 0] },
    // { url: "/about/image3.png", category: "Web Development", position: [7.5, -9, 0] },
  ];

  const filteredImages = filter === "All" ? images : images.filter((img) => img.category === filter);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     setScrollRotation(scrollY * 0.02);
  //     setScrollScale(1 + Math.sin(scrollY * 0.005) * 0.2);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <div style={{ marginTop: "1em", position: "relative" }}>
      <Canvas
        orthographic
        camera={{ zoom: 100, position: [0, 0, 10] }}
        style={{ width: "100%", height: "165vh" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <Text
          position={[0, 6, 0]}
          fontSize={1.7}
          color="white"
          maxWidth={15}
          lineHeight={0.9}
          textAlign="center"
          font="/fonts/Sunwish Maverick.ttf"
          anchorX="center"
          anchorY="middle"
        >
          My Projects
        </Text>

        <Html position={[0, 4.5, 0]} center>
          <div
            style={{
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0)",
              padding: "10px 20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "0px solid #ccc",
                cursor: "pointer",
              }}
            >
              <option value="All">All</option>
              <option value="Marketing">Marketing</option>
              <option value="AI">AI</option>
              <option value="Web Development">Web Development</option>
            </select>
          </div>
        </Html>

        {filteredImages.map((img, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const x = col * 4 - 4;
          const y = -row * 3;

          return (
            <AnimatedImage
              key={index}
              url={img.url}
              position={filter === "All" ? img.position : [x, y, 0]}
              scrollRotation={scrollRotation}
              scrollScale={scrollScale}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default ImageBlock;
