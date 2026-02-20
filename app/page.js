'use client';

import Link from 'next/link';
import { ArrowRight, Search, Zap, BarChart3, MessageSquare, CheckCircle, Users, Globe } from 'lucide-react';

const STATS = [
  { value: '135+', label: 'Resources' },
  { value: '60+', label: 'Grants & Schemes' },
  { value: '35+', label: 'Incubators' },
  { value: '40+', label: 'Investors' },
];

const FEATURES = [
  {
    icon: <Search size={20} />,
    title: 'One stop directory',
    desc: 'Every grant, incubator, accelerator, and investor — searchable and filterable in one place.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Smart matching',
    desc: 'Tell us your sector, stage, and location. We rank every resource by relevance to your startup.',
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'AI advisor',
    desc: 'Chat with an AI that knows every scheme, every incubator, and every VC — in detail.',
  },
  {
    icon: <CheckCircle size={20} />,
    title: 'Application readiness',
    desc: 'Checklists, document guides, and timelines so you never miss a deadline or requirement.',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Explainable results',
    desc: 'Know exactly why a resource matches your profile — sector, stage, geography, and team fit.',
  },
  {
    icon: <Globe size={20} />,
    title: 'All states covered',
    desc: 'Central government, 20+ state startup policies, corporate programs, and global accelerators.',
  },
];

const STEPS = [
  { num: '1', title: 'Build your profile', desc: 'Answer a few questions about your sector, stage, team, and location.' },
  { num: '2', title: 'Get ranked matches', desc: 'See grants, incubators, and investors scored against your profile.' },
  { num: '3', title: 'Apply with confidence', desc: 'Use checklists and AI guidance to submit winning applications.' },
];

export default function HomePage() {
  return (
    <main>
      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="container-sm">
          <div className="hero__badge">
            <span>135+ resources for Indian founders</span>
          </div>
          <h1 className="hero__title">
            Find the right grant, incubator,<br />or investor — in minutes
          </h1>
          <p className="hero__sub">
            SEGPT maps the entire Indian startup ecosystem and matches resources
            to your startup profile. No more Googling scheme PDFs at 2am.
          </p>
          <div className="hero__actions">
            <Link href="/onboarding" className="btn btn-primary btn-lg">
              Get started <ArrowRight size={16} />
            </Link>
            <Link href="/explore" className="btn btn-secondary btn-lg">
              Browse directory
            </Link>
          </div>
          <div className="hero__stats">
            {STATS.map(s => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-val">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header section-header-center">
            <h2>How it works</h2>
            <p>Three steps from "where do I start?" to a shortlisted, ranked set of opportunities.</p>
          </div>
          <div className="grid-3">
            {STEPS.map(step => (
              <div key={step.num} className="step-card">
                <span className="step-card__num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="section">
        <div className="container">
          <div className="section-header section-header-center">
            <h2>Built for founders who ship</h2>
            <p>Stop wasting time on research. Start applying to the right programs.</p>
          </div>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="cta-section">
        <div className="container-sm">
          <h2>Ready to find your next opportunity?</h2>
          <p>Complete a 2-minute profile and get ranked recommendations across grants, incubators, and investors.</p>
          <Link href="/onboarding" className="btn btn-primary btn-lg">
            Start now — it's free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <style jsx>{`
        /* Hero */
        .hero {
          padding: var(--space-5xl) 0 var(--space-4xl);
          text-align: center;
        }

        .hero__badge {
          display: inline-flex;
          margin-bottom: var(--space-xl);
        }
        .hero__badge span {
          font-size: var(--fs-sm);
          font-weight: 500;
          color: var(--brand);
          background: var(--brand-bg);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(13,148,136,0.15);
        }

        .hero__title {
          font-size: var(--fs-4xl);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: var(--space-xl);
          color: var(--gray-900);
        }

        .hero__sub {
          font-size: var(--fs-md);
          color: var(--gray-500);
          line-height: var(--lh-relaxed);
          max-width: 520px;
          margin: 0 auto var(--space-2xl);
        }

        .hero__actions {
          display: flex;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-3xl);
        }

        .hero__stats {
          display: flex;
          justify-content: center;
          gap: var(--space-3xl);
          padding-top: var(--space-2xl);
          border-top: 1px solid var(--gray-200);
        }

        .hero__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .hero__stat-val {
          font-size: var(--fs-2xl);
          font-weight: 800;
          color: var(--gray-900);
        }
        .hero__stat-label {
          font-size: var(--fs-xs);
          color: var(--gray-400);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Steps */
        .step-card {
          text-align: center;
          padding: var(--space-2xl) var(--space-xl);
        }
        .step-card__num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--brand);
          color: white;
          font-weight: 700;
          font-size: var(--fs-sm);
          margin-bottom: var(--space-lg);
        }
        .step-card h3 {
          font-size: var(--fs-md);
          margin-bottom: var(--space-sm);
        }
        .step-card p {
          font-size: var(--fs-sm);
          color: var(--gray-500);
          line-height: var(--lh-relaxed);
        }

        /* Features */
        .feature-card {
          padding: var(--space-2xl);
        }
        .feature-card__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--brand-bg);
          color: var(--brand);
          margin-bottom: var(--space-lg);
        }
        .feature-card h3 {
          font-size: var(--fs-base);
          margin-bottom: var(--space-sm);
        }
        .feature-card p {
          font-size: var(--fs-sm);
          color: var(--gray-500);
          line-height: var(--lh-relaxed);
        }

        /* CTA */
        .cta-section {
          text-align: center;
          padding: var(--space-5xl) 0;
          background: var(--gray-900);
          color: var(--white);
        }
        .cta-section h2 {
          font-size: var(--fs-2xl);
          color: var(--white);
          margin-bottom: var(--space-md);
        }
        .cta-section p {
          font-size: var(--fs-md);
          color: var(--gray-400);
          max-width: 480px;
          margin: 0 auto var(--space-2xl);
          line-height: var(--lh-relaxed);
        }

        @media (max-width: 640px) {
          .hero__title { font-size: var(--fs-2xl); }
          .hero__title br { display: none; }
          .hero__stats { gap: var(--space-xl); flex-wrap: wrap; }
          .hero__actions { flex-direction: column; align-items: center; }
        }
      `}</style>
    </main>
  );
}
