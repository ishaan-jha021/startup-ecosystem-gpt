'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/advisor', label: 'AI Advisor' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container-lg">
        <Link href="/" className="nav__logo" onClick={() => setMenuOpen(false)}>
          <span className="nav__logo-mark">S</span>
          <span className="nav__logo-text">SEGPT</span>
        </Link>

        <div className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav__link ${pathname === link.href ? 'nav__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/onboarding" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
            Get Started
          </Link>
        </div>

        <button className="nav__toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <style jsx>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--white);
          border-bottom: 1px solid transparent;
          transition: border-color var(--transition-base), box-shadow var(--transition-base);
        }

        .nav--scrolled {
          border-bottom-color: var(--gray-200);
          box-shadow: var(--shadow-xs);
        }

        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
        }

        .nav__logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          text-decoration: none;
          font-weight: 700;
        }

        .nav__logo-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--brand);
          color: var(--white);
          font-size: var(--fs-sm);
          font-weight: 800;
          border-radius: var(--radius-md);
        }

        .nav__logo-text {
          font-size: var(--fs-base);
          color: var(--gray-900);
          letter-spacing: -0.02em;
        }

        .nav__links {
          display: flex;
          align-items: center;
          gap: var(--space-2xl);
        }

        .nav__link {
          font-size: var(--fs-sm);
          font-weight: 500;
          color: var(--gray-500);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .nav__link:hover {
          color: var(--gray-900);
          text-decoration: none;
        }
        .nav__link--active {
          color: var(--gray-900);
        }

        .nav__toggle {
          display: none;
          background: none;
          border: none;
          color: var(--gray-700);
          cursor: pointer;
          padding: var(--space-sm);
        }

        @media (max-width: 640px) {
          .nav__toggle {
            display: flex;
          }
          .nav__links {
            display: none;
            position: absolute;
            top: 56px;
            left: 0;
            right: 0;
            background: var(--white);
            border-bottom: 1px solid var(--gray-200);
            flex-direction: column;
            padding: var(--space-lg) var(--space-xl);
            gap: var(--space-lg);
          }
          .nav__links--open {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
