'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo-text">segpt</span>
            <p className="footer__tagline">
              Helping Indian founders navigate the startup ecosystem.
            </p>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <h4>Product</h4>
              <Link href="/explore">Explore Resources</Link>
              <Link href="/onboarding">Start Profiling</Link>
              <Link href="/recommendations">Recommendations</Link>
              <Link href="/advisor">AI Advisor</Link>
            </div>
            <div className="footer__col">
              <h4>Resources</h4>
              <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer">Startup India</a>
              <a href="https://aim.gov.in/" target="_blank" rel="noopener noreferrer">Atal Innovation Mission</a>
              <a href="https://birac.nic.in/" target="_blank" rel="noopener noreferrer">BIRAC</a>
              <a href="https://dst.gov.in/" target="_blank" rel="noopener noreferrer">DST</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} SEGPT. Built for Indian founders.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          border-top: 1px solid var(--gray-200);
          padding: var(--space-3xl) 0 var(--space-xl);
          background: var(--gray-50);
        }

        .footer__top {
          display: flex;
          justify-content: space-between;
          gap: var(--space-3xl);
          margin-bottom: var(--space-3xl);
        }

        .footer__brand {
          max-width: 280px;
        }

        .footer__logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .footer__logo-text {
          font-size: var(--fs-lg);
          font-weight: 800;
          color: var(--gray-900);
          letter-spacing: -0.04em;
        }

        .footer__logo-text span {
          color: var(--brand);
        }

        .footer__tagline {
          font-size: var(--fs-sm);
          color: var(--gray-500);
          line-height: var(--lh-relaxed);
        }

        .footer__cols {
          display: flex;
          gap: var(--space-4xl);
        }

        .footer__col {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .footer__col h4 {
          font-size: var(--fs-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--gray-500);
          margin-bottom: var(--space-xs);
        }

        .footer__col :global(a) {
          font-size: var(--fs-sm);
          color: var(--gray-600);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer__col :global(a):hover {
          color: var(--gray-900);
        }

        .footer__bottom {
          border-top: 1px solid var(--gray-200);
          padding-top: var(--space-xl);
        }

        .footer__bottom p {
          font-size: var(--fs-xs);
          color: var(--gray-400);
        }

        @media (max-width: 640px) {
          .footer__top { flex-direction: column; gap: var(--space-2xl); }
          .footer__cols { gap: var(--space-2xl); }
          
          /* Add extra padding at the bottom of the footer so the copyright text isn't hidden by the mobile tab bar */
          .footer {
             padding-bottom: calc(100px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </footer>
  );
}
