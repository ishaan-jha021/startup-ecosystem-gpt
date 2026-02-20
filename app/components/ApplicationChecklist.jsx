'use client';

import { useState } from 'react';
import { CheckCircle, Circle, FileText, Clock, AlertTriangle } from 'lucide-react';

export default function ApplicationChecklist({ resource }) {
    const [checkedItems, setCheckedItems] = useState({});

    const toggle = (idx) => {
        setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    // Generate checklist based on resource type
    const getChecklist = () => {
        const common = [
            'Company registration certificate (CoI)',
            'PAN card of the company',
            'GST registration (if applicable)',
            'Udyam / DPIIT recognition certificate',
            'Pitch deck (10-15 slides)',
            'Business plan / executive summary',
            'Bank account details',
            'Founders\' KYC documents',
        ];

        if (resource?.type === 'grant' || resource?.category === 'grant') {
            return [
                ...common,
                'Detailed project report (DPR)',
                'Utilization certificate (for previous grants)',
                'CA-certified financial statements',
                'Technology readiness description',
            ];
        }

        if (resource?.category === 'investor' || resource?.type === 'investor') {
            return [
                ...common,
                'Financial projections (3-5 years)',
                'Cap table',
                'Term sheet (if applicable)',
                'Customer testimonials / LOIs',
                'Product demo / video walkthrough',
            ];
        }

        return [
            ...common,
            'Team profiles and LinkedIn URLs',
            'Product demo link or prototype',
            'Problem-solution video (2 min)',
        ];
    };

    const checklist = getChecklist();
    const completed = Object.values(checkedItems).filter(Boolean).length;
    const progress = Math.round((completed / checklist.length) * 100);

    return (
        <div className="app-checklist">
            <div className="app-checklist__header">
                <div>
                    <h3><FileText size={18} /> Application Checklist</h3>
                    <p>{completed} of {checklist.length} completed</p>
                </div>
                <div className="app-checklist__progress">
                    <div className="app-checklist__progress-bar">
                        <div
                            className="app-checklist__progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span>{progress}%</span>
                </div>
            </div>

            <div className="app-checklist__items">
                {checklist.map((item, i) => (
                    <button
                        key={i}
                        className={`app-checklist__item ${checkedItems[i] ? 'app-checklist__item--done' : ''}`}
                        onClick={() => toggle(i)}
                    >
                        {checkedItems[i] ? <CheckCircle size={18} /> : <Circle size={18} />}
                        <span>{item}</span>
                    </button>
                ))}
            </div>

            <div className="app-checklist__tips">
                <h4><AlertTriangle size={16} /> Common Rejection Reasons</h4>
                <ul>
                    <li>Incomplete documentation</li>
                    <li>Mismatch between pitch and application</li>
                    <li>No clear differentiation from competitors</li>
                    <li>Unrealistic financial projections</li>
                </ul>
            </div>

            <div className="app-checklist__timeline">
                <h4><Clock size={16} /> Typical Timeline</h4>
                <div className="timeline-items">
                    <div className="timeline-item">
                        <div className="timeline-dot" />
                        <div>
                            <strong>Week 1-2</strong>
                            <p>Gather all documents</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-dot" />
                        <div>
                            <strong>Week 3</strong>
                            <p>Prepare pitch deck & business plan</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-dot" />
                        <div>
                            <strong>Week 4</strong>
                            <p>Submit application</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-dot" />
                        <div>
                            <strong>Week 6-12</strong>
                            <p>Review & interview rounds</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .app-checklist {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
        }

        .app-checklist__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-xl);
        }

        .app-checklist__header h3 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--fs-md);
          margin-bottom: var(--space-xs);
        }

        .app-checklist__header p {
          font-size: var(--fs-sm);
          color: var(--text-muted);
        }

        .app-checklist__progress {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .app-checklist__progress-bar {
          width: 120px;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .app-checklist__progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          transition: width var(--transition-base);
        }

        .app-checklist__progress span {
          font-size: var(--fs-sm);
          font-weight: 700;
          color: var(--accent-secondary);
        }

        .app-checklist__items {
          margin-bottom: var(--space-xl);
        }

        .app-checklist__item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          width: 100%;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
          background: none;
          border: none;
        }

        .app-checklist__item:hover {
          background: var(--bg-card-hover);
        }

        .app-checklist__item--done {
          color: var(--success);
          text-decoration: line-through;
          opacity: 0.7;
        }

        .app-checklist__tips {
          background: rgba(255, 118, 117, 0.08);
          border: 1px solid rgba(255, 118, 117, 0.2);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .app-checklist__tips h4 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--fs-sm);
          color: var(--error);
          margin-bottom: var(--space-md);
        }

        .app-checklist__tips ul {
          list-style: disc;
          padding-left: var(--space-xl);
        }

        .app-checklist__tips li {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-xs);
        }

        .app-checklist__timeline h4 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-lg);
        }

        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          padding-left: var(--space-md);
          border-left: 2px solid var(--border-subtle);
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding-left: var(--space-md);
          position: relative;
        }

        .timeline-dot {
          position: absolute;
          left: calc(-1 * var(--space-md) - 5px);
          top: 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-primary);
        }

        .timeline-item strong {
          font-size: var(--fs-sm);
          display: block;
          margin-bottom: 2px;
        }

        .timeline-item p {
          font-size: var(--fs-sm);
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
