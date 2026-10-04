import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   DIMENSIONS
   ─ OUTER  : half-size of the outer cube
   ─ INNER  : half-size of the inner cube  (~44% of outer)
   ─ BEAM_W : cross-section of each structural beam
   ═══════════════════════════════════════════════════════════ */
const OUTER  = 1.58;
const INNER  = 0.70;
const BEAM_W = 0.072;

/* ─── 8 vertices shared by both cubes (same corner mapping) ─ */
function makeVerts(s) {
  return [
    new THREE.Vector3(-s, -s, -s), // 0  left-bottom-back
    new THREE.Vector3( s, -s, -s), // 1  right-bottom-back
    new THREE.Vector3( s,  s, -s), // 2  right-top-back
    new THREE.Vector3(-s,  s, -s), // 3  left-top-back
    new THREE.Vector3(-s, -s,  s), // 4  left-bottom-front
    new THREE.Vector3( s, -s,  s), // 5  right-bottom-front
    new THREE.Vector3( s,  s,  s), // 6  right-top-front
    new THREE.Vector3(-s,  s,  s), // 7  left-top-front
  ];
}

/* ─── 12 edges of a cube (index pairs) ─── */
const CUBE_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0], // back face
  [4, 5], [5, 6], [6, 7], [7, 4], // front face
  [0, 4], [1, 5], [2, 6], [3, 7], // four lateral connectors
];

/* ═══════════════════════════════════════════════════════════
   Beam — a thin rectangular rod between two Vector3 points.
   Uses BoxGeometry so it renders as a solid structural member.
   ═══════════════════════════════════════════════════════════ */
const UP = new THREE.Vector3(0, 1, 0);

function Beam({ a, b, mat }) {
  const [pos, quat, len] = useMemo(() => {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const l   = a.distanceTo(b);
    const dir = b.clone().sub(a).normalize();
    const q   = new THREE.Quaternion().setFromUnitVectors(UP, dir);
    return [mid, q, l];
  }, [a, b]);

  return (
    <mesh position={pos} quaternion={quat} material={mat} castShadow>
      <boxGeometry args={[BEAM_W, len, BEAM_W]} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   Joint sphere — small sphere at each vertex junction for
   the characteristic "bolted-joint" look of the logo.
   ═══════════════════════════════════════════════════════════ */
function Joint({ pos, mat }) {
  return (
    <mesh position={pos} material={mat}>
      <sphereGeometry args={[BEAM_W * 0.82, 8, 8]} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   Full Tesseract (4D hypercube) model
   ─ 12 outer cube beams
   ─ 12 inner cube beams
   ─  8 connecting rods (outer corner → matching inner corner)
   ─ 16 joint spheres
   Total visible structural members: 32 beams + 16 joints
   ═══════════════════════════════════════════════════════════ */
function TesseractModel() {
  const group = useRef();

  const outerV = useMemo(() => makeVerts(OUTER), []);
  const innerV = useMemo(() => makeVerts(INNER), []);

  /* Outer cube material — dark gunmetal with silver highlights */
  const matOuter = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#1a3550"),
    metalness: 0.92,
    roughness: 0.18,
  }), []);

  /* Inner cube material — slightly lighter steel blue */
  const matInner = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#1f3f60"),
    metalness: 0.90,
    roughness: 0.22,
  }), []);

  /* Connecting rods — midtone between outer and inner */
  const matConn = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#182d45"),
    metalness: 0.91,
    roughness: 0.20,
  }), []);

  /* Joint material */
  const matJoint = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#2a4f72"),
    metalness: 0.95,
    roughness: 0.12,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Slow Y-axis rotation — matches original animation
    group.current.rotation.y = t * 0.18;
    // Gentle X wobble for depth feel
    group.current.rotation.x = Math.sin(t * 0.38) * 0.07;
    // Subtle float
    group.current.position.y = Math.sin(t * 0.5) * 0.06;
  });

  return (
    <group ref={group} rotation={[0.28, 0.45, 0]}>

      {/* ── Outer cube: 12 beams ── */}
      {CUBE_EDGES.map(([i, j], k) => (
        <Beam key={`o${k}`} a={outerV[i]} b={outerV[j]} mat={matOuter} />
      ))}

      {/* ── Inner cube: 12 beams ── */}
      {CUBE_EDGES.map(([i, j], k) => (
        <Beam key={`i${k}`} a={innerV[i]} b={innerV[j]} mat={matInner} />
      ))}

      {/* ── 8 connecting rods: outer[n] → inner[n] ── */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
        <Beam key={`c${n}`} a={outerV[n]} b={innerV[n]} mat={matConn} />
      ))}

      {/* ── Outer vertex joints ── */}
      {outerV.map((v, n) => (
        <Joint key={`oj${n}`} pos={v} mat={matJoint} />
      ))}

      {/* ── Inner vertex joints ── */}
      {innerV.map((v, n) => (
        <Joint key={`ij${n}`} pos={v} mat={matJoint} />
      ))}

    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   Canvas with carefully tuned lighting to reproduce the
   dark gunmetal + silver highlight + deep-blue look of
   the original logo.
   ═══════════════════════════════════════════════════════════ */
export default function Tesseract3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      dpr={[1, 2]}
    >
      {/* Low ambient — keep it dark like the logo */}
      <ambientLight intensity={0.22} color="#b0c8e0" />

      {/* Main key light — upper-left front, warm-cool silver */}
      <directionalLight
        position={[-4, 6, 5]}
        intensity={2.8}
        color="#cce0f5"
      />

      {/* Right-side fill for the silver edge highlight */}
      <directionalLight
        position={[6, 1, 2]}
        intensity={1.4}
        color="#d8eaf8"
      />

      {/* Subtle back-rim light — deep blue glow */}
      <directionalLight
        position={[0, -3, -6]}
        intensity={0.7}
        color="#1a4060"
      />

      {/* Point light for the bright highlight on the right face */}
      <pointLight
        position={[4, 2, 4]}
        intensity={1.2}
        color="#e8f4ff"
        distance={12}
      />

      <TesseractModel />
    </Canvas>
  );
}