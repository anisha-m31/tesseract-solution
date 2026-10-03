import { useState, useCallback } from "react";
import ServiceRow from "./ServiceRow.jsx";

/* ── service data ──────────────────────────────────────────── */

const SERVICES = [
  {
    number: "01",
    title: "3D Printer Services",
    shortDesc: "Complete technical support",
    description:
      "Complete technical support for your 3D printer, from installation and calibration to repair and maintenance.",
    annotation: "PRECISION",
    items: [
      "Repair",
      "Servicing",
      "Maintenance",
      "Installation",
      "Calibration",
      "Troubleshooting",
      "Firmware Updates",
      "Parts Replacement",
    ],
  },
  {
    number: "02",
    title: "3D Printing",
    shortDesc: "Custom printing & material solutions",
    description:
      "From prototypes and functional parts to custom models, we provide reliable 3D printing and material solutions.",
    annotation: "PRINT",
    items: ["Custom 3D Printing", "Printing Material Distribution"],
  },
  {
    number: "03",
    title: "3D Design & Scanning",
    shortDesc: "From ideas to digital models",
    description:
      "Transform ideas, physical objects and concepts into accurate digital 3D models.",
    annotation: "SCAN",
    items: ["3D Designing", "3D Scanning"],
  },
  {
    number: "04",
    title: "Consultation",
    shortDesc: "Professional technical guidance",
    description:
      "Guidance on printer selection, setup, materials, workflows and troubleshooting.",
    annotation: "SUPPORT",
    items: ["3D Printer Consultation"],
  },
];

/* ── component ─────────────────────────────────────────────── */

export default function Services() {
  /* which accordion row is open (-1 = none) */
  const [activeIndex, setActiveIndex]   = useState(-1);
  /* which row the pointer is currently inside */
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const handleToggle = useCallback((i) => {
    setActiveIndex((prev) => (prev === i ? -1 : i));
  }, []);

  const handleEnter = useCallback((i) => setHoveredIndex(i),  []);
  const handleLeave = useCallback(()  => setHoveredIndex(-1), []);

  /* any row hovered? used to dim siblings */
  const anyHovered = hoveredIndex !== -1;

  return (
    <section
      className="section services"
      id="services"
      aria-label="Our services"
    >
      {/* ── section heading ─────────────────── */}
      <div className="section-heading">

        <div className="eyebrow">
          <span />
          WHAT WE DO
        </div>

        <h2>
          Complete 3D solutions,
          <br />
          <em>without the complexity.</em>
        </h2>

        <p>
          From an idea that needs a model to a printer that needs attention,
          we provide practical, end-to-end support.
        </p>

      </div>

      {/* ── accordion list ──────────────────── */}
      <div
        className={`svc-list${anyHovered ? " svc-list--dimming" : ""}`}
        role="list"
      >
        {SERVICES.map((cat, i) => (
          <div role="listitem" key={cat.number}>
            <ServiceRow
              cat={cat}
              index={i}
              isOpen={activeIndex === i}
              isActive={hoveredIndex === i}
              onToggle={() => handleToggle(i)}
              onEnter={() => handleEnter(i)}
              onLeave={handleLeave}
            />
          </div>
        ))}
      </div>

    </section>
  );
}