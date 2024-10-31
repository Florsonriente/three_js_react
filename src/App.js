import React, { useRef } from 'react'; // Ensure React is imported
import { Canvas } from '@react-three/fiber';
import FantasyScene from './components/FantasyScene'; // Ensure the path is correct


const App = () => {
  const sceneRef = useRef();

  // Example mouse movement handler (implement as needed)
  const handleMouseMove = (event) => {
    const mouse = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
    if (sceneRef.current) {
      sceneRef.current.setMouse(mouse);
    }
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh', width: '100vw' }}>
      <Canvas style={{ height: '100%', width: '100%' }}>
        <FantasyScene ref={sceneRef} />
      </Canvas>
    </div>
  );
};

export default App;
