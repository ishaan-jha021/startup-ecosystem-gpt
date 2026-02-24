'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Home, Compass, MapPin, User, Bot, TrendingUp } from 'lucide-react';

import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/grants', label: 'Grants' },
  { href: '/investors', label: 'Investors' },
  { href: '/directory', label: 'Spaces' },
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
        <div className="nav__left">
          <Link href="/" className="nav__logo" onClick={() => setMenuOpen(false)}>
            <span className="nav__logo-text">segpt</span>
          </Link>
        </div>

        <div className={`nav__center nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
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
        </div>

        <div className="nav__right">
          <ThemeToggle />
          <Link href="/onboarding" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
            Build Profile
          </Link>
          <button className="nav__toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="nav-bottom-mobile">
        <Link href="/" className={`nav-bottom-item ${pathname === '/' ? 'nav-bottom-item--active' : ''}`}>
          <Home size={24} />
        </Link>
        <Link href="/grants" className={`nav-bottom-item ${pathname === '/grants' ? 'nav-bottom-item--active' : ''}`}>
          <Compass size={24} />
        </Link>
        <Link href="/investors" className={`nav-bottom-item ${pathname === '/investors' ? 'nav-bottom-item--active' : ''}`}>
          <TrendingUp size={24} />
        </Link>
        <Link href="/directory" className={`nav-bottom-item ${pathname === '/directory' ? 'nav-bottom-item--active' : ''}`}>
          <MapPin size={24} />
        </Link>
        <Link href="/onboarding" className={`nav-bottom-item ${pathname === '/onboarding' ? 'nav-bottom-item--active' : ''}`}>
          <User size={24} />
        </Link>
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

        .nav__left, .nav__right {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .nav__right {
          justify-content: flex-end;
          gap: var(--space-sm);
        }

        .nav__center {
          flex: 2;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--space-2xl);
        }

        .nav__logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          text-decoration: none;
          font-weight: 700;
        }

        .nav__logo-text {
          font-size: var(--fs-lg);
          font-weight: 800;
          color: var(--gray-900);
          letter-spacing: -0.04em;
        }

        .nav__logo-text span {
          color: var(--brand);
        }

        .nav__links {
        }

        .nav__link {
          font-weight: 600;
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

        .nav-bottom-mobile {
          display: none;
        }

        @media (max-width: 640px) {
          .nav__toggle { display: none !important; }
          .nav__links { display: none !important; }
          
          /* Modern full-width bottom nav (iOS style) */
          .nav-bottom-mobile {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 1px solid var(--gray-200);
            box-shadow: 0 -4px 16px rgba(0,0,0,0.03);
            justify-content: space-around;
            padding: 10px 12px calc(10px + env(safe-area-inset-bottom)); /* Safe area padding */
            z-index: 9999;
          }

          .nav-bottom-item {
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: var(--gray-400);
            transition: color var(--transition-fast), transform 0.2s;
            flex: 1;
            padding: 8px 4px;
          }

          .nav-bottom-item--active {
            color: var(--brand);
          }
          
          .nav-bottom-item--active :global(svg) {
            transform: translateY(-2px);
          }

          /* Compress the Build Profile button so it fits with the logo without crowding */
          .nav__right .btn {
             padding: 6px 10px;
             font-size: 12px;
          }
        }
      `}</style>

      {/* Global CSS for pushing the body up on mobile to prevent overlap with the full-width dock */}
      <style jsx global>{`
        @media (max-width: 640px) {
          body {
            /* Account for the height of the nav + safe area */
            padding-bottom: calc(75px + env(safe-area-inset-bottom)) !important;
          }
        }
      `}</style>
    </nav>
  );
}
