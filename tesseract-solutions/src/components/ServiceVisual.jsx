/* ServiceVisual.jsx
   Lightweight SVG engineering annotations.
   They are purely decorative and kept very subtle
   so they reinforce the technical brand without
   dominating the layout.
*/

const visuals = {
  0: (
    // 3D Printer Services — XYZ calibration lines
    <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* outer frame */}
      <rect x="1" y="1" width="218" height="158" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.25" />
      {/* printer silhouette */}
      <rect x="60" y="55" width="100" height="60" rx="1" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <rect x="70" y="65" width="80" height="40" stroke="currentColor" strokeWidth="0.4" opacity="0.18" />
      <line x1="110" y1="55" x2="110" y2="115" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.2" />
      {/* X axis */}
      <line x1="20" y1="138" x2="90" y2="138" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <polyline points="88,135 91,138 88,141" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.35" />
      <text x="94" y="141" fontSize="7" fill="currentColor" opacity="0.3" fontFamily="monospace">X</text>
      {/* Y axis */}
      <line x1="20" y1="138" x2="20" y2="68" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <polyline points="17,70 20,67 23,70" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.35" />
      <text x="23" y="66" fontSize="7" fill="currentColor" opacity="0.3" fontFamily="monospace">Y</text>
      {/* Z axis diagonal */}
      <line x1="20" y1="138" x2="46" y2="112" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <polyline points="43,113 46,111 47,115" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.35" />
      <text x="49" y="111" fontSize="7" fill="currentColor" opacity="0.3" fontFamily="monospace">Z</text>
      {/* crosshair */}
      <circle cx="110" cy="85" r="8" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.2" />
      <line x1="103" y1="85" x2="117" y2="85" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <line x1="110" y1="78" x2="110" y2="92" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      {/* annotation */}
      <text x="130" y="30" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">CALIBRATION</text>
      <text x="50" y="30" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">PRECISION</text>
    </svg>
  ),
  1: (
    // 3D Printing — layer lines concept
    <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="218" height="158" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.25" />
      {/* stacked layer stripes */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={i}
          x={70} y={115 - i * 9}
          width={80} height={6}
          rx="0.5"
          stroke="currentColor" strokeWidth="0.5"
          fill="currentColor" fillOpacity={0.015 + i * 0.01}
          opacity={0.25 + i * 0.04}
        />
      ))}
      {/* nozzle */}
      <polyline points="100,40 120,40 116,52 104,52" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />
      <line x1="110" y1="52" x2="110" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.25" />
      {/* dimension lines */}
      <line x1="60" y1="70" x2="60" y2="118" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.2" />
      <line x1="58" y1="70" x2="62" y2="70" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <line x1="58" y1="118" x2="62" y2="118" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <text x="64" y="97" fontSize="6.5" fill="currentColor" opacity="0.2" fontFamily="monospace" transform="rotate(-90,64,97)">LAYERS</text>
      <text x="120" y="30" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">PRINT</text>
      <text x="60" y="30" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">MODEL</text>
    </svg>
  ),
  2: (
    // 3D Design & Scanning — wireframe cube + grid
    <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="218" height="158" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.25" />
      {/* scan grid lines horizontal */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`h${i}`} x1="30" y1={50 + i*16} x2="190" y2={50 + i*16}
          stroke="currentColor" strokeWidth="0.3" opacity={0.08 + (i===2||i===3?0.08:0)} />
      ))}
      {/* scan grid lines vertical */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`v${i}`} x1={30 + i*20} y1="50" x2={30 + i*20} y2="130"
          stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      ))}
      {/* wireframe cube front face */}
      <rect x="80" y="55" width="60" height="60" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
      {/* top face */}
      <polyline points="80,55 98,38 158,38 140,55" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      {/* right face */}
      <polyline points="140,55 158,38 158,98 140,115" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
      {/* inner diagonals */}
      <line x1="80" y1="55" x2="140" y2="115" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.15" />
      <line x1="140" y1="55" x2="80" y2="115" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.15" />
      {/* scanning beam */}
      <line x1="30" y1="78" x2="190" y2="78" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <text x="130" y="28" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">SCAN</text>
      <text x="30" y="28" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">MODEL</text>
    </svg>
  ),
  3: (
    // Consultation — node/connection diagram
    <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="218" height="158" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.25" />
      {/* central node */}
      <circle cx="110" cy="80" r="12" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
      <circle cx="110" cy="80" r="4" fill="currentColor" opacity="0.2" />
      {/* satellite nodes */}
      <circle cx="55" cy="45" r="7" stroke="currentColor" strokeWidth="0.6" opacity="0.28" />
      <circle cx="165" cy="45" r="7" stroke="currentColor" strokeWidth="0.6" opacity="0.28" />
      <circle cx="55" cy="115" r="7" stroke="currentColor" strokeWidth="0.6" opacity="0.28" />
      <circle cx="165" cy="115" r="7" stroke="currentColor" strokeWidth="0.6" opacity="0.28" />
      <circle cx="110" cy="30" r="5" stroke="currentColor" strokeWidth="0.5" opacity="0.22" />
      <circle cx="110" cy="130" r="5" stroke="currentColor" strokeWidth="0.5" opacity="0.22" />
      {/* connector lines */}
      <line x1="110" y1="68" x2="55" y2="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.22" />
      <line x1="110" y1="68" x2="165" y2="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.22" />
      <line x1="110" y1="92" x2="55" y2="115" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.22" />
      <line x1="110" y1="92" x2="165" y2="115" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.22" />
      <line x1="110" y1="68" x2="110" y2="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.22" />
      <line x1="110" y1="92" x2="110" y2="125" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.22" />
      <text x="130" y="22" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">TECHNICAL</text>
      <text x="30" y="22" fontSize="6.5" fill="currentColor" opacity="0.18" fontFamily="monospace" letterSpacing="2">SUPPORT</text>
    </svg>
  ),
};

export default function ServiceVisual({ index }) {
  return (
    <div className="svc-visual" aria-hidden="true">
      {visuals[index] ?? null}
    </div>
  );
}
