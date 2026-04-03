import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function Earth() {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    sphereRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
  });

  return (
    <mesh ref={sphereRef} position={[0, 0, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1.5} color="#00d2ff" />
      <directionalLight position={[-2, -5, -2]} intensity={1} color="#3a7bd5" />
      
      <Sphere args={[2.5, 64, 64]}>
        <MeshDistortMaterial
          color="#0a192f"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </Sphere>
      <Sphere args={[2.4, 64, 64]}>
         <meshStandardMaterial color="#000" attach="material" />
      </Sphere>
    </mesh>
  );
}

export default Earth;
