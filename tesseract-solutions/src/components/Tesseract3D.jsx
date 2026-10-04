import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useCallback } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   DIMENSIONS  — unchanged
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
   Beam — unchanged geometry
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
   Joint sphere — unchanged geometry
   ═══════════════════════════════════════════════════════════ */
function Joint({ pos, mat }) {
  return (
    <mesh position={pos} material={mat}>
      <sphereGeometry args={[BEAM_W * 0.82, 8, 8]} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   TesseractModel
   ─ All geometry and materials are 100% unchanged.
   ─ Only the useFrame animation logic has been upgraded to
     support drag interaction via the shared `ctrl` ref.

   ctrl ref shape:
     { dragging, dx, dy, lastX, lastY }
   ═══════════════════════════════════════════════════════════ */
function TesseractModel({ ctrl }) {
  const group = useRef();

  const outerV = useMemo(() => makeVerts(OUTER), []);
  const innerV = useMemo(() => makeVerts(INNER), []);

  /* ── Materials — completely unchanged ── */
  const matOuter = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#1a3550"),
    metalness: 0.92,
    roughness: 0.18,
  }), []);

  const matInner = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#1f3f60"),
    metalness: 0.90,
    roughness: 0.22,
  }), []);

  const matConn = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#182d45"),
    metalness: 0.91,
    roughness: 0.20,
  }), []);

  const matJoint = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color("#2a4f72"),
    metalness: 0.95,
    roughness: 0.12,
  }), []);

  /* ── Rotation state (mutable refs, no re-renders) ── */
  const rotY    = useRef(0.45);   // current Y angle
  const rotX    = useRef(0.28);   // current X angle
  const velY    = useRef(0);      // inertia Y
  const velX    = useRef(0);      // inertia X
  const autoOn  = useRef(true);   // auto-rotating?
  const autoAcc = useRef(0);      // accumulated time for auto float/wave
  const idleAt  = useRef(null);   // timestamp when drag ended

  /* ── Unified animation + interaction loop ── */
  useFrame((_, delta) => {
    if (!group.current) return;
    const c = ctrl.current;

    if (c.dragging) {
      /* ─ User is dragging: follow pointer exactly ─ */
      const sens = 0.007;
      rotY.current += c.dx * sens;
      rotX.current += c.dy * sens;
      rotX.current  = THREE.MathUtils.clamp(rotX.current, -Math.PI / 2.1, Math.PI / 2.1);

      // Capture velocity snapshot for inertia on release
      velY.current = c.dx * sens;
      velX.current = c.dy * sens;

      // Consume delta so we don't double-count next frame
      c.dx = 0;
      c.dy = 0;

      autoOn.current = false;
      idleAt.current = null;

    } else {
      /* ─ Not dragging: apply inertia then (optionally) auto-rotate ─ */

      // Inertia — exponential decay
      velY.current *= 0.88;
      velX.current *= 0.88;
      rotY.current += velY.current;
      rotX.current += velX.current;
      rotX.current  = THREE.MathUtils.clamp(rotX.current, -Math.PI / 2.1, Math.PI / 2.1);

      // Begin idle timer the first frame after drag ends
      if (!autoOn.current && idleAt.current === null) {
        idleAt.current = performance.now();
      }

      // Resume auto-rotation after 1.8 s of inactivity
      if (!autoOn.current && idleAt.current !== null &&
          performance.now() - idleAt.current > 1800) {
        autoOn.current = true;
        idleAt.current = null;
      }

      if (autoOn.current) {
        autoAcc.current += delta;

        // Same Y-axis speed as original (0.18 rad/s)
        rotY.current += 0.18 * delta;

        // Gently ease X back toward the original slow sine wave
        const targetX = Math.sin(autoAcc.current * 0.38) * 0.07;
        rotX.current += (targetX - rotX.current) * 0.018;

        // Subtle vertical float (unchanged from original)
        group.current.position.y = Math.sin(autoAcc.current * 0.5) * 0.06;
      }
    }

    group.current.rotation.y = rotY.current;
    group.current.rotation.x = rotX.current;
  });

  return (
    <group ref={group}>

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
   Tesseract3D — exported component
   ─ Wraps Canvas in a div that captures Pointer Events
     (works for mouse AND touch via the unified Pointer API).
   ─ `touchAction: "none"` prevents the browser scrolling
     the page while the user drags the logo on mobile.
   ─ `setPointerCapture` keeps the drag active even if the
     pointer leaves the element mid-drag.
   ─ All lighting is identical to the previous version.
   ═══════════════════════════════════════════════════════════ */
export default function Tesseract3D() {
  /* Shared mutable state — avoids React re-renders on every frame */
  const ctrl = useRef({ dragging: false, dx: 0, dy: 0, lastX: 0, lastY: 0 });

  const onPointerDown = useCallback((e) => {
    // Capture the pointer so drag continues outside the element
    e.currentTarget.setPointerCapture(e.pointerId);
    ctrl.current.dragging = true;
    ctrl.current.lastX    = e.clientX;
    ctrl.current.lastY    = e.clientY;
    ctrl.current.dx       = 0;
    ctrl.current.dy       = 0;
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!ctrl.current.dragging) return;
    // Accumulate delta — consumed each frame in useFrame
    ctrl.current.dx   += e.clientX - ctrl.current.lastX;
    ctrl.current.dy   += e.clientY - ctrl.current.lastY;
    ctrl.current.lastX = e.clientX;
    ctrl.current.lastY = e.clientY;
  }, []);

  const onPointerUp = useCallback(() => {
    ctrl.current.dragging = false;
  }, []);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        width:       "100%",
        height:      "100%",
        cursor:      "grab",
        touchAction: "none", // prevent page scroll on mobile while dragging
        userSelect:  "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        dpr={[1, 2]}
      >
        {/* ── Lighting — completely unchanged ── */}
        <ambientLight intensity={0.22} color="#b0c8e0" />

        <directionalLight
          position={[-4, 6, 5]}
          intensity={2.8}
          color="#cce0f5"
        />

        <directionalLight
          position={[6, 1, 2]}
          intensity={1.4}
          color="#d8eaf8"
        />

        <directionalLight
          position={[0, -3, -6]}
          intensity={0.7}
          color="#1a4060"
        />

        <pointLight
          position={[4, 2, 4]}
          intensity={1.2}
          color="#e8f4ff"
          distance={12}
        />

        <TesseractModel ctrl={ctrl} />
      </Canvas>
    </div>
  );
}