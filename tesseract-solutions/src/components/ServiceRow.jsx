import { useRef, useEffect, useCallback } from "react";
import ServiceVisual from "./ServiceVisual.jsx";

/*
  ServiceRow
  ──────────
  A single accordion row inside the Services section.

  Props
  ─────
  cat        – { number, title, shortDesc, description, items }
  index      – numeric index in the list (0-based)
  isOpen     – boolean: is this row currently expanded?
  isActive   – boolean: does any sibling have the cursor/focus?
  onToggle   – () => void: called when the row header is pressed
  onEnter    – () => void: called on pointerenter (for dim-siblings effect)
  onLeave    – () => void: called on pointerleave
*/

export default function ServiceRow({
  cat,
  index,
  isOpen,
  isActive,
  onToggle,
  onEnter,
  onLeave,
}) {
  const bodyRef   = useRef(null);
  const innerRef  = useRef(null);

  /* ── height animation via max-height ── */
  useEffect(() => {
    const body  = bodyRef.current;
    const inner = innerRef.current;
    if (!body || !inner) return;

    if (isOpen) {
      body.style.maxHeight = `${inner.scrollHeight}px`;
    } else {
      /* collapse: first set current explicit height so transition fires */
      body.style.maxHeight = `${body.scrollHeight}px`;
      /* force reflow */
      // eslint-disable-next-line no-unused-expressions
      body.offsetHeight;
      body.style.maxHeight = "0px";
    }
  }, [isOpen]);

  /* ── cursor-following "EXPLORE" label ── */
  const labelRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const label = labelRef.current;
    if (!label || isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    label.style.transform = `translate(${x + 16}px, ${y - 12}px)`;
    label.style.opacity   = "1";
  }, [isOpen]);

  const handleMouseLeave = useCallback(() => {
    if (labelRef.current) labelRef.current.style.opacity = "0";
    onLeave();
  }, [onLeave]);

  const rowId   = `svc-body-${index}`;
  const btnId   = `svc-btn-${index}`;

  return (
    <div
      className={[
        "svc-row",
        isOpen   ? "svc-row--open"   : "",
        isActive ? "svc-row--active" : "",
      ].filter(Boolean).join(" ")}
      onPointerEnter={onEnter}
      onPointerLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >

      {/* ── cursor follower ── */}
      <span ref={labelRef} className="svc-cursor" aria-hidden="true">
        EXPLORE
      </span>

      {/* ── row header / button ── */}
      <button
        id={btnId}
        className="svc-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={rowId}
      >

        <span className="svc-num" aria-hidden="true">{cat.number}</span>

        <div className="svc-header-body">
          <span className="svc-title">{cat.title}</span>
          <span className="svc-short">{cat.shortDesc}</span>
        </div>

        {/* engineering annotation — visible on hover */}
        <span className="svc-annotation" aria-hidden="true">
          {cat.annotation}
        </span>

        <span className="svc-arrow" aria-hidden="true">
          {isOpen
            ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.2" /></svg>
            : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.2" /><line x1="10" y1="4" x2="15" y2="9" stroke="currentColor" strokeWidth="1.2" /><line x1="10" y1="14" x2="15" y2="9" stroke="currentColor" strokeWidth="1.2" /></svg>
          }
        </span>

      </button>

      {/* ── expandable body ── */}
      <div
        id={rowId}
        ref={bodyRef}
        role="region"
        aria-labelledby={btnId}
        className="svc-body"
      >
        <div ref={innerRef} className="svc-body-inner">

          <div className="svc-expand-layout">

            {/* left: description + tags + CTA */}
            <div className="svc-expand-content">

              <p className="svc-desc">{cat.description}</p>

              <ul className="svc-tags" aria-label={`${cat.title} services`}>
                {cat.items.map((item, j) => (
                  <li
                    key={item}
                    className="svc-tag"
                    style={{ "--stagger": `${j * 55}ms` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="svc-cta"
                tabIndex={isOpen ? 0 : -1}
              >
                Get in touch
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.1" />
                  <line x1="8"  y1="3" x2="12" y2="7" stroke="currentColor" strokeWidth="1.1" />
                  <line x1="8"  y1="11" x2="12" y2="7" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </a>

            </div>

            {/* right: SVG engineering visual */}
            <ServiceVisual index={index} />

          </div>

        </div>
      </div>

    </div>
  );
}
