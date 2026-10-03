import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function TesseractModel() {
  const group = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    group.current.rotation.y = time * 0.18;
    group.current.rotation.x =
      Math.sin(time * 0.4) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.3, 0.5, 0]}>

      {/* Outer cube */}

      <mesh>
        <boxGeometry args={[3.2, 3.2, 3.2]} />

        <meshBasicMaterial
          color="#668da8"
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Inner cube */}

      <mesh scale={0.58}>
        <boxGeometry args={[3.2, 3.2, 3.2]} />

        <meshBasicMaterial
          color="#b8c4ca"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Core */}

      <mesh scale={0.25}>
        <boxGeometry args={[3.2, 3.2, 3.2]} />

        <meshBasicMaterial
          color="#4f84a5"
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

    </group>
  );
}

export default function Tesseract3D() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 7],
        fov: 42,
      }}
      dpr={[1, 2]}
    >

      <ambientLight intensity={1} />

      <TesseractModel />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
      />

    </Canvas>
  );
}