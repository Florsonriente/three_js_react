import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import FantasyScene from "./components/FantasyScene_12";
import Timeline3D from "./components/Timeline";
import BeforeAfterSlider from "./components/BeforeAfterSlider"; // Import the new component

import CustomCursor from "./components/CustomCursor_02";
import ImageBlock from "./components/ImageBlock";  // ✅ Import the new ImageBlock component
 import ExpertiseBlock from "./components/ExpertiseBlock";
 import ExpertiseBlock_02 from "./components/ExpertiseBlock_02";
 import ExpertiseBlock_01 from "./components/ExpertiseBlock_01";




const App = () => {
  const sceneRef = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };

      if (sceneRef.current) {
        sceneRef.current.setMouse(mouse);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{ width: "100vw", position: "relative", overflowX: "hidden" }}>
      {/* Header 
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          padding: "10px",
          background: "rgba(255, 255, 255, 0)",
          color: "white",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <nav>
          {["Me", "Expertise", "Cases"].map((item) => (
            <button
              key={item}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                fontFamily: "'Sunwish Maverick', Impact, 'Arial Narrow Bold', sans-serif",
                margin: "0 10px",
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>*/}

      {/* Custom Cursor */}
      <CustomCursor /> 

      {/* 3D Fantasy Scene */}
      <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
        <Canvas
          gl={{ alpha: false }}
          style={{
            // background: "pink",
            width: "100%",
            height: "110vh",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <FantasyScene ref={sceneRef} />
        </Canvas>
      </div>

  {/* ExpertiseBlock */}
  {/**/} <ExpertiseBlock /> 
  
      {/* Before & After Section */}
      <div style={{ height: "100vh", background: "#111", color: "white", textAlign: "center" }}>
      <BeforeAfterSlider
  beforeImage="/about/man_dancing.jpg"
  afterImages={[
    // "/about/girls_dancing.jpg",
    "/about/image3.png",
    "/about/image4.png",
    "/about/image5.png"
  ]}
  texts={[ "Text 2", "Text 3", "This is me."]}
/>
</div>

  {/* ExpertiseBlock */}
 

      {/* Timeline Section */}
      <Timeline3D />

      {/* ImageBlock Section */}
      <div style={{ height: "100vh", background: "#222", color: "white" }}>
        <ImageBlock />  {/* New Image Block with Text and Images */}
      </div>
  {/* ExpertiseBlock */}
   {/**/} <ExpertiseBlock_02 /> 
  {/* */} <ExpertiseBlock_01 />

 

    </div>
  );
};

export default App;
