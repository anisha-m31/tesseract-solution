import Tesseract3D from "./Tesseract3D";
import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero" id="home">

      <div className="hero-grid" />

      <div className="hero-content">

        <div className="eyebrow">
          <span />
          3D PRINTING • DESIGN • SUPPORT
        </div>

        <h1>
          Tesseract
          <br />
          <em>Solutions.</em>
        </h1>

        <p>
          Custom 3D printing, 3D model designing and complete
          3D printer support — for individuals, students,
          businesses and industries.
        </p>

        <div className="hero-buttons">

          <a href="#contact" className="primary-button">
            Contact Us
            <ArrowRight size={17} />
          </a>

        </div>

        <div className="hero-details">
          <span>Reliable</span>
          <i />
          <span>Affordable</span>
          <i />
          <span>Technical</span>
        </div>

      </div>

      <div className="hero-3d">
        <Tesseract3D />
      </div>

      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <i />
      </div>

    </section>
  );
}