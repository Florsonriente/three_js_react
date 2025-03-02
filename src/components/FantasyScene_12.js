import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane, PerspectiveCamera, Box, Sphere, useGLTF, useTexture } from '@react-three/drei';
import Rainbow from './Rainbow';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { MeshStandardMaterial, LineBasicMaterial, BufferGeometry, Line } from 'three';
import * as THREE from 'three'; 
import { Text, RoundedBox } from "@react-three/drei";




// Tree Component: Loads the 3D Tree Model
const TreeModel = ({ position }) => {
  const tree = useLoader(TDSLoader, '/tree1_3ds/Tree1.3ds'); // Corrected path

  const [hovered, setHovered] = useState(false);

  // Apply color/material
  tree.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: hovered ? 'yellow' : 'green' });
    }
  });

  return (
    <primitive
      object={tree}
      position={position}
      scale={[0.1, 0.1, 0.1]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
};

// DOG
const DogModel = ({ mouse, scrollY }) => {
  const { scene } = useGLTF('/scene.gltf');
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.2;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.2;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.4;

      // Move model down based on scroll
      modelRef.current.position.y = -1 + scrollY * 5; // Adjust intensity of scroll effect
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.5} position={[2, 3, 2.5]} />;
};



const CubeModel = ({ mouse, scrollY }) => {
  const { scene } = useGLTF('models_cube/scene.gltf'); // ✅ Extract `scene`
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.2;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.2;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.4;

      // Move model down based on scroll
      modelRef.current.position.y = -1 + scrollY * 5; // Adjust intensity of scroll effect
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.5} position={[2, 3, 2.5]} />;
};


const PinkPuff = ({ mouse, scrollY }) => {
  const { scene } = useGLTF('models_pinkpuff/scene.gltf'); // ✅ Extract `scene`
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += (mouse.x * 2 - modelRef.current.rotation.y) * 0.2;
      modelRef.current.rotation.x += (-mouse.y * 2 - modelRef.current.rotation.x) * 0.2;
      modelRef.current.rotation.z += (mouse.x * 0.5 - modelRef.current.rotation.z) * 0.4;

      // Move model down based on scroll
      modelRef.current.position.y = -1 + scrollY * 5; // Adjust intensity of scroll effect
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.5} position={[2, 3, 9]} />;
};




const Letter = ({ image, position, mouse, scrollY, scale }) => {
    const texture = useTexture(image);
    const [letterPos, setLetterPos] = useState(position);
    const [hovered, setHovered] = useState(false);
    const [dynamicScale, setDynamicScale] = useState(scale); // Default scale

    useFrame(() => {
        const targetX = mouse.x * 2 + position[0];
        const targetY = mouse.y * 1.5 + position[1] - scrollY * 5;

        setLetterPos((prevPos) => [
            THREE.MathUtils.lerp(prevPos[0], targetX, 0.1),
            THREE.MathUtils.lerp(prevPos[1], targetY, 0.1),
            prevPos[2],
        ]);

        // Lerp for smooth scaling
        const targetScale = hovered ? 0.8 : scale;
        setDynamicScale((prevScale) => THREE.MathUtils.lerp(prevScale, targetScale, 0.05));
    });

    if (!texture) return null;

    return (
        <Plane
            position={letterPos}
            args={[2, 2]}
            scale={[dynamicScale, dynamicScale, 1]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <meshBasicMaterial attach="material" map={texture} transparent={true} opacity={0.95} />
        </Plane>
    );
};

// 📏 3D Grid Component
const Grid = () => {
    return <gridHelper args={[90, 10, 'black', 'gray']} position={[0, -10, -4.5]} />;
};

// Gradient box component
const GradientBox = ({ position, rotation, scale, args }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    // Create a canvas to draw the gradient
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 256, 256); // Diagonal gradient
    gradient.addColorStop(0, 'rgb(44, 34, 44)'); // Lilac (pastel purple)
    gradient.addColorStop(0.5, 'rgb(193, 185, 255)'); // Peach
    gradient.addColorStop(1, 'rgb(48, 40, 27)'); // Orange

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    // Set the texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    setTexture(texture);
  }, []);

  return (
    <Box position={position} rotation={rotation} scale={scale} args={args} castShadow receiveShadow>
      {texture && <meshStandardMaterial map={texture} />}
    </Box>
  );
};

const StoneModel = ({ position, scale = [3, 2, 3] }) => {
    const { scene } = useGLTF('/models_stone/scene.gltf');
    return <primitive object={scene} position={position} scale={scale} />;
};

const FantasyScene = forwardRef((props, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0); // Track scroll position
  const cameraRef = useRef();
  const textRef = useRef();

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY / (document.body.scrollHeight - window.innerHeight)); // Normalize scroll
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  useImperativeHandle(ref, () => ({
    setMouse: (newMouse) => {
      setMouse(newMouse);
    },
  }));

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x += (mouse.x * 6 + 1 - cameraRef.current.position.x) * 0.2;
      cameraRef.current.position.y += (mouse.y * 3 - cameraRef.current.position.y) * 0.2;
  
      // ✅ Move camera down as you scroll
      cameraRef.current.position.z = 10 - scrollY * 20; 
    }
  });


  // useFrame(() => {
  //   if (cameraRef.current) {
  //     cameraRef.current.position.x += (mouse.x * 6 + 1 - cameraRef.current.position.x) * 0.2;
  //     cameraRef.current.position.y = 55 - scrollY * 30; // ✅ Move down instead of zooming in
  //   }
  // });
  
  

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 55, 5]} />

      {/* 3D Grid */}
      <Grid />

      <Rainbow />

      {/* Existing Objects like GradientBox and Models */}
      <GradientBox
        position={[-1.5, -1.8, -5]}
        rotation={[Math.PI / 3, Math.PI / 2, 0]}
        scale={[1, 1, 1]}
        args={[1, 1, 1]}
      />

      <StoneModel position={[3, -1.8, -4]} />

      {/* Letters as flat images */}
      <Letter image="/letters/H.png" position={[-3.5, 0, -9]} mouse={mouse} /**/scrollY={scrollY}  scale={6.9}/>
      <Letter image="/letters/A.png" position={[-2, 0, -10]} mouse={mouse} scrollY={scrollY} scale={6.7} /**//>
      <Letter image="/letters/L1.png" position={[0, 0, -8]} mouse={mouse} scrollY={scrollY} scale={6.9}/**/ />
      <Letter image="/letters/L2.png" position={[1.5, -0.5, -9]} mouse={mouse} scrollY={scrollY} scale={6.7} />
      <Letter image="/letters/O.png" position={[3, 0, -8]} mouse={mouse} scrollY={scrollY} scale={6.8} />


    

      {/* Interactive Rotating 3D Model */}
      <DogModel mouse={mouse} scrollY={scrollY} position={[2, 1, -5]} />

      <CubeModel mouse={mouse} scrollY={scrollY} position={[3, -1.8, 6]} />
{/* 
      <PinkPuff mouse={mouse} scrollY={scrollY} position={[3, -1.8, -4]} /> */}

      {/* Add lighting */}
      <ambientLight intensity={-0.95} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Add Image Below Letters */}
     {/* <Plane
        position={[0, -5, 0]} 
        args={[2, 2]}//set the seize
      >
        <meshBasicMaterial attach="material" map={useTexture('/about/me2.jpg')} transparent opacity={1} />
      </Plane> */}

      {/* Add Text Block Below the Image */}
      {/* <Text

position={[0, 0, 8]}
fontSize={0.82}
color="white"
maxWidth={3}
whiteSpace='wrap'
lineHeight={0.9}
textAlign="center"
font="/fonts/Sunwish Maverick.ttf" // Load custom font
anchorX="center"
anchorY="middle"

>
WELCOME!
</Text> 
*/}


<>

  {/* Text 
  <Text
    position={[0, 0, 6.01]} // Slightly move text forward to avoid z-fighting
    fontSize={0.05}
    color="white"
     maxWidth={1.0} // Adjusted for better fit
    lineHeight={1.1}
    textAlign="center"
    font="/fonts/Sunwish Maverick.ttf"
    anchorX="center"
    anchorY="middle"
  >
    {"I'm Alona. I've built this cool website to prove that I am special: I've coded it on my own without having an IT degree. Cool, right? Let's see what else I can do."}
  </Text>*/}


  {/* Background with rounded corners
  <RoundedBox args={[8.5, 7.5, 0.1]} radius={0.2} position={[0, 0, 6.0]}>
    <meshBasicMaterial color="black" transparent opacity={0.6} />
  </RoundedBox>*/ }



</>






    </>
  );
});

export default FantasyScene;
