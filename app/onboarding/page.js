'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import StepProgress from '@/app/components/StepProgress';

const SECTORS = ['AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'DeepTech', 'AI/ML', 'SaaS', 'CleanTech', 'BioTech', 'Consumer Tech', 'IoT', 'D2C', 'FoodTech', 'Mobility', 'SpaceTech', 'Defence', 'Social Impact', 'Other'];
const STAGES = [
    { value: 'Idea', title: 'Idea stage', desc: 'Concept or business plan, no product yet' },
    { value: 'MVP', title: 'MVP / Prototype', desc: 'Working product with early users or testers' },
    { value: 'Revenue', title: 'Revenue stage', desc: 'Paying customers and growing traction' },
    { value: 'Scaling', title: 'Scaling', desc: 'Product-market fit, optimizing growth' },
];
const TEAM_BG = ['Student Founders', 'First-Time Founders', 'Serial Entrepreneurs', 'Technical Co-founder', 'Research/PhD Background', 'Corporate Background', 'Women-Founded', 'SC/ST Founder'];
const GEOS = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Tier 2/3 City', 'Rural India', 'Pan India'];
const STEP_LABELS = ['Sector', 'Stage', 'Team', 'Location', 'Details', 'Review'];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState({
        startupName: '', sector: '', stage: '', teamBackground: '', geography: '',
        revenue: '', traction: '', isResearchBased: false,
    });

    const set = (key, val) => setProfile(p => ({ ...p, [key]: val }));
    const canNext = () => {
        if (step === 0) return profile.sector;
        if (step === 1) return profile.stage;
        if (step === 2) return profile.teamBackground;
        if (step === 3) return profile.geography;
        return true;
    };

    const next = () => { if (step < 5) setStep(step + 1); };
    const back = () => { if (step > 0) setStep(step - 1); };
    const finish = () => {
        localStorage.setItem('segpt_profile', JSON.stringify(profile));
        router.push('/recommendations');
    };

    return (
        <div className="onb">
            <div className="container-sm">
                <StepProgress current={step} labels={STEP_LABELS} />

                <div className="onb__body">
                    {/* Step 0 — Sector */}
                    {step === 0 && (
                        <div className="onb__step">
                            <h2>What sector is your startup in?</h2>
                            <p className="text-muted text-sm mb-xl">Pick the one that best describes your primary domain.</p>
                            <input
                                type="text"
                                placeholder="Startup name (optional)"
                                value={profile.startupName}
                                onChange={e => set('startupName', e.target.value)}
                                className="mb-lg"
                                style={{ maxWidth: 400 }}
                            />
                            <div className="chip-group">
                                {SECTORS.map(s => (
                                    <button key={s} className={`chip ${profile.sector === s ? 'active' : ''}`} onClick={() => set('sector', s)}>{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 1 — Stage */}
                    {step === 1 && (
                        <div className="onb__step">
                            <h2>What stage are you at?</h2>
                            <p className="text-muted text-sm mb-xl">This determines which grants and investors are relevant.</p>
                            <div className="stage-grid">
                                {STAGES.map(s => (
                                    <button key={s.value} className={`stage-card card ${profile.stage === s.value ? 'stage-card--active' : ''}`} onClick={() => set('stage', s.value)}>
                                        <h3>{s.title}</h3>
                                        <p>{s.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Team */}
                    {step === 2 && (
                        <div className="onb__step">
                            <h2>Tell us about your team</h2>
                            <p className="text-muted text-sm mb-xl">Some schemes are designed for specific founder backgrounds.</p>
                            <div className="chip-group">
                                {TEAM_BG.map(t => (
                                    <button key={t} className={`chip ${profile.teamBackground === t ? 'active' : ''}`} onClick={() => set('teamBackground', t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Geography */}
                    {step === 3 && (
                        <div className="onb__step">
                            <h2>Where are you based?</h2>
                            <p className="text-muted text-sm mb-xl">Many state governments have their own startup grants.</p>
                            <div className="chip-group">
                                {GEOS.map(g => (
                                    <button key={g} className={`chip ${profile.geography === g ? 'active' : ''}`} onClick={() => set('geography', g)}>{g}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4 — Details */}
                    {step === 4 && (
                        <div className="onb__step">
                            <h2>A few more details</h2>
                            <p className="text-muted text-sm mb-xl">Optional — helps us fine-tune recommendations.</p>
                            <div className="form-row">
                                <div>
                                    <label>Monthly revenue (approx.)</label>
                                    <input type="text" placeholder="e.g. ₹0, ₹50K, ₹5L" value={profile.revenue} onChange={e => set('revenue', e.target.value)} />
                                </div>
                                <div>
                                    <label>Traction / users</label>
                                    <input type="text" placeholder="e.g. 100 users, 10 pilots" value={profile.traction} onChange={e => set('traction', e.target.value)} />
                                </div>
                            </div>
                            <div className="toggle-row mt-xl">
                                <label className="toggle-label">
                                    <input type="checkbox" checked={profile.isResearchBased} onChange={e => set('isResearchBased', e.target.checked)} />
                                    <span>Research / IP based startup</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 5 — Review */}
                    {step === 5 && (
                        <div className="onb__step">
                            <h2>Review your profile</h2>
                            <p className="text-muted text-sm mb-xl">Make sure everything looks right before we generate your matches.</p>
                            <div className="review-card card">
                                <div className="review-row"><span>Name</span><strong>{profile.startupName || '—'}</strong></div>
                                <div className="review-row"><span>Sector</span><strong>{profile.sector}</strong></div>
                                <div className="review-row"><span>Stage</span><strong>{profile.stage}</strong></div>
                                <div className="review-row"><span>Team</span><strong>{profile.teamBackground}</strong></div>
                                <div className="review-row"><span>Location</span><strong>{profile.geography}</strong></div>
                                <div className="review-row"><span>Revenue</span><strong>{profile.revenue || '—'}</strong></div>
                                <div className="review-row"><span>Traction</span><strong>{profile.traction || '—'}</strong></div>
                                <div className="review-row"><span>Research/IP</span><strong>{profile.isResearchBased ? 'Yes' : 'No'}</strong></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav buttons */}
                <div className="onb__nav">
                    {step > 0 && (
                        <button className="btn btn-ghost" onClick={back}>
                            <ArrowLeft size={16} /> Back
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < 5 ? (
                        <button className="btn btn-primary" onClick={next} disabled={!canNext()}>
                            Continue <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button className="btn btn-primary btn-lg" onClick={finish}>
                            Get my recommendations <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
        .onb {
          padding: var(--space-3xl) 0 var(--space-4xl);
          min-height: 100vh;
        }
        .onb__body {
          min-height: 380px;
          padding: var(--space-2xl) 0;
        }
        .onb__step h2 {
          font-size: var(--fs-xl);
          margin-bottom: var(--space-sm);
        }
        .onb__nav {
          display: flex;
          align-items: center;
          padding-top: var(--space-xl);
          border-top: 1px solid var(--gray-200);
        }

        /* Stage cards */
        .stage-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-md);
        }
        .stage-card {
          padding: var(--space-xl);
          text-align: left;
          cursor: pointer;
          border: 1px solid var(--gray-200);
          background: var(--white);
        }
        .stage-card:hover { border-color: var(--gray-400); }
        .stage-card--active {
          border-color: var(--brand);
          background: var(--brand-bg);
        }
        .stage-card h3 {
          font-size: var(--fs-sm);
          margin-bottom: 4px;
        }
        .stage-card p {
          font-size: var(--fs-xs);
          color: var(--gray-500);
        }

        /* Form */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }
        .toggle-row { display: flex; }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--fs-sm);
          color: var(--gray-700);
          cursor: pointer;
          font-weight: 500;
        }
        .toggle-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--brand);
        }

        /* Review */
        .review-card {
          padding: var(--space-xl);
        }
        .review-row {
          display: flex;
          justify-content: space-between;
          padding: var(--space-md) 0;
          border-bottom: 1px solid var(--gray-100);
          font-size: var(--fs-sm);
        }
        .review-row:last-child { border: none; }
        .review-row span { color: var(--gray-500); }
        .review-row strong { color: var(--gray-900); }

        @media (max-width: 640px) {
          .stage-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}
