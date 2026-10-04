import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <a href="#home" className="navbar-logo">
        <img src="/logo.png" alt="Tesseract Solutions" />
      </a>

      <nav className={open ? "nav-links open" : "nav-links"}>
        <a href="#services" onClick={closeMenu}>
          Services
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
      </nav>

      <a
        href="https://wa.me/917892386317"
        target="_blank"
        rel="noreferrer"
        className="navbar-whatsapp"
      >
        WhatsApp
        <ArrowUpRight size={15} />
      </a>

      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={25} /> : <Menu size={25} />}
      </button>
    </header>
  );
}