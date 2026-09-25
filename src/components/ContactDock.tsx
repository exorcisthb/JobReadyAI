import { useRef, useState } from "react";
import "./ContactDock.css";

export default function ContactDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDock = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 120);
  };

  const handleTouchToggle = () => {
    if (window.matchMedia("(hover: none)").matches) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="dock-wrap">
      <div
        className={`dock${isOpen ? " is-open" : ""}`}
        onMouseEnter={openDock}
        onMouseLeave={scheduleClose}
        onClick={handleTouchToggle}
        id="dock"
      >
        {/* Label state */}
        <div className="label">
          <span className="letter">C</span>
          <span className="letter">O</span>
          <span className="letter">N</span>
          <span className="letter">T</span>
          <span className="letter">A</span>
          <span className="letter">C</span>
          <span className="letter">T</span>
        </div>

        {/* Icon state (5 items: Twitter/X, YouTube, Facebook, Instagram, Threads) */}
        <div className="icons">
          <a
            className={`icon-btn${activeIdx === 0 ? " is-active" : ""}`}
            data-brand="twitter"
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActiveIdx(0)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="tooltip">Twitter / X</span>
            <svg viewBox="0 0 24 24">
              <path d="M4 4l16 16M20 4L4 20" strokeLinecap="round" />
            </svg>
          </a>

          <a
            className={`icon-btn${activeIdx === 1 ? " is-active" : ""}`}
            data-brand="youtube"
            href="https://www.youtube.com/@JobReadyAI-n8m"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActiveIdx(1)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="tooltip">YouTube</span>
            <svg viewBox="0 0 24 24">
              <rect x="2.5" y="6" width="19" height="12" rx="4" />
              <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <a
            className={`icon-btn${activeIdx === 2 ? " is-active" : ""}`}
            data-brand="facebook"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActiveIdx(2)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="tooltip">Facebook</span>
            <svg viewBox="0 0 24 24">
              <path d="M15 4h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>

          <a
            className={`icon-btn${activeIdx === 3 ? " is-active" : ""}`}
            data-brand="instagram"
            href="https://www.instagram.com/jobreadyai_exe"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActiveIdx(3)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="tooltip">Instagram</span>
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <a
            className={`icon-btn${activeIdx === 4 ? " is-active" : ""}`}
            data-brand="threads"
            href="https://threads.net"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActiveIdx(4)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="tooltip">Threads</span>
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-4.5 0-7 2.6-7 7v4c0 4.4 2.5 7 7 7s7-2.4 7-6.2c0-3-1.7-4.4-4.2-4.4-2 0-3.4 1-3.4 2.6 0 1.2.9 1.9 2.1 1.9 1 0 1.7-.5 1.9-1.3" />
              <path d="M9.3 9.2c.4-1 1.4-1.7 2.9-1.7 2.1 0 3.3 1.3 3.3 3.1" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
