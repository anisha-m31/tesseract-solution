import { Phone, Mail, MessageCircle, Globe } from "lucide-react";

export default function Contact() {
  return (
    <section className="section contact" id="contact">

      {/* ── decorative background text ── */}
      <span className="contact-bg-text" aria-hidden="true">CONTACT</span>

      <div className="contact-inner">

        {/* ── left: heading ── */}
        <div className="contact-left">

          <div className="eyebrow">
            <span />
            LET'S TALK
          </div>

          <h2>
            Have a project
            <br />
            <em>in mind?</em>
          </h2>

          <p>
            Tell us what you need — we'll help you
            find the right solution. Reach us through
            any channel below.
          </p>

          {/* thin accent line */}
          <div className="contact-accent-line" aria-hidden="true" />

        </div>

        {/* ── right: contact options ── */}
        <div className="contact-right">

          <div className="contact-options">

            <a href="tel:+917892386317">
              <div className="contact-option-icon">
                <Phone size={16} />
              </div>
              <span>
                <small>CALL US</small>
                +91 78923 86317
              </span>
            </a>

            <a
              href="https://wa.me/917892386317"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-option-icon">
                <MessageCircle size={16} />
              </div>
              <span>
                <small>WHATSAPP</small>
                Start a conversation
              </span>
            </a>

            <a href="mailto:ajinkya.mudliaar@gmail.com">
              <div className="contact-option-icon">
                <Mail size={16} />
              </div>
              <span>
                <small>EMAIL</small>
                ajinkya.mudliaar@gmail.com
              </span>
            </a>

            <a
              href="https://www.tesseractsolutions.co.in"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-option-icon">
                <Globe size={16} />
              </div>
              <span>
                <small>WEBSITE</small>
                tesseractsolutions.co.in
              </span>
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}