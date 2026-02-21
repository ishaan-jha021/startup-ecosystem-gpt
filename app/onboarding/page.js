'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
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
    const [authStep, setAuthStep] = useState('login'); // 'login', 'loading', 'authenticated'
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

    const handleGoogleLogin = () => {
        setAuthStep('loading');
        setTimeout(() => {
            setAuthStep('authenticated');
        }, 1200);
    };

    if (authStep !== 'authenticated') {
        return (
            <div className="auth-gate">
                <div className="auth-card">
                    <h1 className="auth-logo">se<span>gpt</span></h1>
                    <h2>Welcome back</h2>
                    <p className="text-muted mb-xl">Sign in to build your personalized profile and discover matched opportunities.</p>

                    <button
                        className="btn-google"
                        onClick={handleGoogleLogin}
                        disabled={authStep === 'loading'}
                    >
                        {authStep === 'loading' ? (
                            <Loader2 className="spin" size={20} />
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>
                    <p className="text-xs text-muted mt-lg text-center">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
                <style jsx>{`
                    .auth-gate {
                        min-height: calc(100vh - 65px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fbfbfb;
                        padding: var(--space-xl);
                    }
                    .auth-card {
                        background: var(--white);
                        padding: var(--space-3xl);
                        border-radius: var(--radius-xl);
                        box-shadow: 0 8px 32px rgba(0,0,0,0.04);
                        border: 1px solid var(--gray-200);
                        max-width: 440px;
                        width: 100%;
                        text-align: center;
                    }
                    .auth-logo {
                        font-size: 2.5rem;
                        font-weight: 800;
                        color: var(--gray-900);
                        letter-spacing: -0.04em;
                        margin-bottom: var(--space-xl);
                    }
                    .auth-logo span { color: var(--brand); }
                    .auth-card h2 { font-size: var(--fs-xl); margin-bottom: var(--space-xs); }
                    
                    .btn-google {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        padding: 12px 24px;
                        background: var(--white);
                        border: 1px solid var(--gray-300);
                        border-radius: var(--radius-full);
                        font-family: inherit;
                        font-size: var(--fs-base);
                        font-weight: 500;
                        color: var(--gray-900);
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    }
                    .btn-google:hover:not(:disabled) {
                        background: var(--gray-50);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.04);
                    }
                    .btn-google:disabled { opacity: 0.7; cursor: wait; }
                `}</style>
            </div>
        );
    }

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
