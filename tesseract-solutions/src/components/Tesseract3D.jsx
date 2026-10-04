import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ─── 8 vertices of a cube with given half-size ─── */
function cubeVertices(s) {
  return [
    [-s, -s, -s], [ s, -s, -s], [ s,  s, -s], [-s,  s, -s],
    [-s, -s,  s], [ s, -s,  s], [ s,  s,  s], [-s,  s,  s],
  ];
}

/* ─── 12 edges of a cube ─── */
function cubeEdgePositions(s) {
  const v = cubeVertices(s);
  const edges = [
    0,1, 1,2, 2,3, 3,0,   // back face
    4,5, 5,6, 6,7, 7,4,   // front face
    0,4, 1,5, 2,6, 3,7,   // laterals
  ];
  const pts = [];
  for (let i = 0; i < edges.length; i += 2) {
    pts.push(...v[edges[i]], ...v[edges[i + 1]]);
  }
  return new Float32Array(pts);
}

/* ─── ALL-TO-ALL connections between two cubes (8×8 = 64 lines) ─── */
function allToAllPositions(sA, sB) {
  const vA = cubeVertices(sA);
  const vB = cubeVertices(sB);
  const pts = [];
  for (let a = 0; a < 8; a++) {
    for (let b = 0; b < 8; b++) {
      pts.push(...vA[a], ...vB[b]);
    }
  }
  return new Float32Array(pts);
}

/* ─── Reusable LineSegments component ─── */
function Lines({ positions, color, opacity }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/* ─── Cube sizes ───────────────────────────────────
   OUTER  = big outer cube
   MID    = medium inner cube (~47% of outer)
   INNER  = tiny bright-blue core cube (~19% of outer)
────────────────────────────────────────────────── */
const OUTER = 1.6;
const MID   = 0.75;
const INNER = 0.30;

function TesseractModel() {
  const group = useRef();

  const outerEdges = useMemo(() => cubeEdgePositions(OUTER), []);
  const midEdges   = useMemo(() => cubeEdgePositions(MID),   []);
  const innerEdges = useMemo(() => cubeEdgePositions(INNER),  []);
  const outerToMid = useMemo(() => allToAllPositions(OUTER, MID),  []);
  const midToInner = useMemo(() => allToAllPositions(MID, INNER),   []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.18;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.3, 0.5, 0]}>

      {/* Outer cube — near-white cool blue */}
      <Lines positions={outerEdges}  color="#c6d9e8" opacity={0.88} />

      {/* All outer vertices → all mid vertices */}
      <Lines positions={outerToMid}  color="#8aafc9" opacity={0.20} />

      {/* Middle cube */}
      <Lines positions={midEdges}    color="#9dc0d5" opacity={0.72} />

      {/* All mid vertices → all inner vertices */}
      <Lines positions={midToInner}  color="#5c9fc4" opacity={0.45} />

      {/* Inner cube — vivid accent blue */}
      <Lines positions={innerEdges}  color="#40b4ff" opacity={1.00} />

    </group>
  );
}

export default function Tesseract3D() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 2]}>
      <ambientLight intensity={1} />
      <TesseractModel />
    </Canvas>
  );
}