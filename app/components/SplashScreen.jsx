'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fade out after 1.5s
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1500);

    // Completely remove from DOM after fade completes (500ms transition)
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={`loader-screen ${fade ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <h1 className="loader-logo">
          se<span>gpt</span>
        </h1>
        <p className="loader-tagline">The AI Advisor for Indian Startups</p>

        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <style jsx>{`
        .loader-screen {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--white, #ffffff);
          z-index: 99999;
          height: 100vh;
          width: 100vw;
          transition: opacity 0.5s ease-out;
        }

        .loader-screen.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .loader-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin-top: -10vh; /* Adjust slightly upward for optical centering */
        }

        .loader-logo {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--gray-900, #0f172a);
          letter-spacing: -0.04em;
          margin: 0;
          line-height: 1;
        }

        .loader-logo span {
          color: var(--brand, #ff2e63);
        }

        .loader-tagline {
          font-size: 1.125rem;
          color: var(--gray-500, #64748b);
          font-weight: 500;
          margin: 0;
        }

        .loader-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 2.5rem;
        }

        .loader-dots span {
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ffb3c6;
          animation: dot-bounce 1.4s infinite ease-in-out both;
        }

        .loader-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loader-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes dot-bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            background-color: #ffe0e6;
          }
          40% {
            transform: scale(1);
            background-color: #ff85a1;
          }
        }
      `}</style>
    </div>
  );
}
