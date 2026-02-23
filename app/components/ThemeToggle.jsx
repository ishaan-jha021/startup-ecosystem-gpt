'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by only rendering after mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a placeholder button with the same dimensions to avoid layout shift
        return <div className="theme-toggle-placeholder" aria-hidden="true" />;
    }

    const cycleTheme = () => {
        if (theme === 'system') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('system');
    };

    const getIcon = () => {
        if (theme === 'system') return <Laptop size={18} />;
        if (theme === 'dark') return <Moon size={18} />;
        return <Sun size={18} />;
    };

    return (
        <button
            className="btn-icon theme-toggle"
            onClick={cycleTheme}
            title={`Current Theme: ${theme}. Click to change.`}
            aria-label="Toggle theme"
        >
            {getIcon()}
            <style jsx>{`
        .theme-toggle {
          background: var(--gray-100);
          color: var(--gray-600);
          transition: all var(--transition-fast);
        }
        .theme-toggle:hover {
          background: var(--gray-200);
          color: var(--gray-900);
        }
        .theme-toggle-placeholder {
          width: 40px;
          height: 40px;
        }

        /* Specifically style the placeholder based on global focus if needed */
      `}</style>
        </button>
    );
}
