'use client';

import { useState } from 'react';
import { Check, Circle } from 'lucide-react';

export default function StepProgress({ current, labels }) {
  return (
    <div className="steps">
      {labels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className={`steps__item ${done ? 'steps__item--done' : ''} ${active ? 'steps__item--active' : ''}`}>
            <div className="steps__dot">
              {done ? <Check size={12} /> : <span>{i + 1}</span>}
            </div>
            <span className="steps__label">{label}</span>
            {i < labels.length - 1 && <div className="steps__line" />}
          </div>
        );
      })}
      <style jsx>{`
        .steps {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .steps__item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          flex: 1;
          position: relative;
        }
        .steps__dot {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--fs-xs);
          font-weight: 600;
          border: 2px solid var(--gray-300);
          color: var(--gray-400);
          background: var(--white);
          flex-shrink: 0;
          z-index: 1;
        }
        .steps__label {
          font-size: var(--fs-xs);
          color: var(--gray-400);
          font-weight: 500;
          white-space: nowrap;
        }
        .steps__line {
          flex: 1;
          height: 1px;
          background: var(--gray-200);
          margin: 0 var(--space-sm);
        }

        .steps__item--active .steps__dot {
          border-color: var(--brand);
          color: var(--brand);
          background: var(--brand-bg);
        }
        .steps__item--active .steps__label {
          color: var(--gray-900);
          font-weight: 600;
        }

        .steps__item--done .steps__dot {
          border-color: var(--success);
          background: var(--success);
          color: white;
        }
        .steps__item--done .steps__label {
          color: var(--gray-500);
        }
        .steps__item--done .steps__line {
          background: var(--success);
        }

        @media (max-width: 640px) {
          .steps__label { display: none; }
          .steps__item { gap: 0; }
        }
      `}</style>
    </div>
  );
}
