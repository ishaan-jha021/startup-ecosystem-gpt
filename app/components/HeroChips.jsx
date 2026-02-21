'use client';

import { useRouter } from 'next/navigation';

export default function HeroChips() {
    const router = useRouter();

    const handleChipClick = (query) => {
        router.push(`/advisor?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="hero__chips">
            <button className="chip" onClick={() => handleChipClick("Seed Funds")}>Seed Funds</button>
            <button className="chip" onClick={() => handleChipClick("State Policies")}>State Policies</button>
            <button className="chip" onClick={() => handleChipClick("Biotech Incubators")}>Biotech Incubators</button>
            <button className="chip" onClick={() => handleChipClick("Grants for Women Founders")}>Women Founders</button>

            <style jsx>{`
        .hero__chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }
        .chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          background: var(--white);
          border: 1px solid var(--gray-200);
          font-size: var(--fs-xs);
          color: var(--gray-700);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: inherit;
        }
        .chip:hover {
          background: var(--gray-50);
          border-color: var(--brand);
          color: var(--brand);
          transform: translateY(-1px);
        }
      `}</style>
        </div>
    );
}
