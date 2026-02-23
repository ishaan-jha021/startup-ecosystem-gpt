'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getRecommendations } from '@/lib/matching';
import { westernLineData } from '@/lib/data/western_line';
import { ExternalLink, ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';

function ScoreBadge({ score }) {
    let color = 'var(--gray-400)';
    if (score >= 70) color = 'var(--success)';
    else if (score >= 40) color = 'var(--brand)';
    else if (score >= 20) color = 'var(--warning)';
    return (
        <span className="score" style={{ color, borderColor: color }}>
            {score}
            <style jsx>{`
        .score {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          border: 2px solid;
          font-size: var(--fs-sm);
          font-weight: 700;
          flex-shrink: 0;
        }
      `}</style>
        </span>
    );
}

function RecCard({ item }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rec card">
            <div className="rec__top">
                <div className="rec__info">
                    <span className="badge badge-neutral">{item.type || 'resource'}</span>
                    <h3>{item.name}</h3>
                    {item.provider && <p className="rec__provider">{item.provider}</p>}
                </div>
                <ScoreBadge score={item.matchScore} />
            </div>
            <p className="rec__desc">{item.description}</p>
            <div className="rec__tags">
                {item.funding && <span className="badge badge-success">{item.funding}</span>}
                {item.chequeSize && <span className="badge badge-success">{item.chequeSize}</span>}
                {(item.stage || []).map(s => <span key={s} className="badge badge-brand">{s}</span>)}
            </div>

            <button className="rec__toggle" onClick={() => setOpen(!open)}>
                {open ? 'Hide reasons' : 'Why this match?'} {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {open && (
                <div className="rec__reasons">
                    <ul>{(item.matchReasons || []).map((r, i) => <li key={i}>{r}</li>)}</ul>
                    {item.eligibility && (
                        <>
                            <h4>Eligibility</h4>
                            <ul>{item.eligibility.map((e, i) => <li key={i}>{e}</li>)}</ul>
                        </>
                    )}
                </div>
            )}

            {item.website && (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary mt-lg">
                    Website <ExternalLink size={12} />
                </a>
            )}

            <style jsx>{`
        .rec { padding: var(--space-xl); }
        .rec__top { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-lg); margin-bottom: var(--space-md); }
        .rec__info { flex: 1; }
        .rec__info h3 { font-size: var(--fs-base); font-weight: 700; margin-top: var(--space-sm); }
        .rec__provider { font-size: var(--fs-xs); color: var(--gray-500); }
        .rec__desc { font-size: var(--fs-sm); color: var(--gray-600); line-height: var(--lh-relaxed); margin-bottom: var(--space-md); }
        .rec__tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-md); }
        .rec__toggle { display: inline-flex; align-items: center; gap: 4px; font-size: var(--fs-xs); font-weight: 600; color: var(--brand); cursor: pointer; background: none; border: none; padding: 0; font-family: var(--font); }
        .rec__reasons { margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--gray-100); }
        .rec__reasons ul { list-style: disc; padding-left: var(--space-xl); margin-bottom: var(--space-md); }
        .rec__reasons li { font-size: var(--fs-sm); color: var(--gray-600); margin-bottom: 4px; }
        .rec__reasons h4 { font-size: var(--fs-xs); font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: var(--space-sm); }
      `}</style>
        </div>
    );
}

function WesternLineCard({ item }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rec card">
            <div className="rec__top">
                <div className="rec__info">
                    <span className="badge badge-neutral">{item.type}</span>
                    <h3>{item.name}</h3>
                    <p className="rec__provider">{item.area}</p>
                </div>
                <ScoreBadge score={parseInt(item.brandValue) * 10 || 50} />
            </div>

            <div className="rec__tags">
                <span className="badge badge-success">Equity: {item.equityTaken}</span>
                <span className="badge badge-brand">Fee: {item.fee}</span>
                <span className="badge badge-brand">Stage: {item.idealStage}</span>
            </div>

            <button className="rec__toggle" onClick={() => setOpen(!open)}>
                {open ? 'Hide details' : 'View details'} {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {open && (
                <div className="rec__reasons">
                    <ul>
                        <li><strong>Structure:</strong> {item.programStructure}</li>
                        <li><strong>Investor Access:</strong> {item.investorAccess}</li>
                        <li><strong>Funding Guarantee:</strong> {item.fundingGuarantee}</li>
                        <li><strong>Conf Hall Capacity:</strong> {item.confHallCapacity}</li>
                        <li><strong>Call Booths:</strong> {item.callBooths}</li>
                        <li><strong>Founder Freedom:</strong> {item.founderFreedom}</li>
                        <li><strong>Mentors:</strong> {item.externalMentors}</li>
                        <li><strong>Contact:</strong> {item.contactDetails}</li>
                    </ul>
                </div>
            )}

            {item.googleMapsLink && (
                <a href={item.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary mt-lg">
                    Google Maps <ExternalLink size={12} />
                </a>
            )}

            <style jsx>{`
        .rec { padding: var(--space-xl); }
        .rec__top { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-lg); margin-bottom: var(--space-md); }
        .rec__info { flex: 1; }
        .rec__info h3 { font-size: var(--fs-base); font-weight: 700; margin-top: var(--space-sm); }
        .rec__provider { font-size: var(--fs-xs); color: var(--gray-500); }
        .rec__tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-md); }
        .rec__toggle { display: inline-flex; align-items: center; gap: 4px; font-size: var(--fs-xs); font-weight: 600; color: var(--brand); cursor: pointer; background: none; border: none; padding: 0; font-family: var(--font); }
        .rec__reasons { margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--gray-100); }
        .rec__reasons ul { list-style: none; padding-left: 0; margin-bottom: var(--space-md); }
        .rec__reasons li { font-size: var(--fs-sm); color: var(--gray-600); margin-bottom: 4px; }
      `}</style>
        </div>
    );
}

function RecommendationsPageContent() {
    const searchParams = useSearchParams();
    const [profile, setProfile] = useState(null);
    const [recs, setRecs] = useState(null);
    const [tab, setTab] = useState(searchParams.get('tab') || 'grants');

    useEffect(() => {
        try {
            const p = JSON.parse(localStorage.getItem('segpt_profile'));
            if (p && p.sector) {
                setProfile(p);
                setRecs(getRecommendations(p));
            }
        } catch { }
    }, []);

    if (!profile) {
        return (
            <div className="empty">
                <div className="container-sm" style={{ textAlign: 'center', padding: 'var(--space-5xl) 0' }}>
                    <h2>No profile found</h2>
                    <p className="text-muted mt-sm mb-xl">Complete the onboarding to get personalized recommendations.</p>
                    <Link href="/onboarding" className="btn btn-primary btn-lg">Start profiling <ArrowRight size={16} /></Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { key: 'grants', label: 'Grants', data: recs?.topGrants },
        { key: 'incubators', label: 'Incubators', data: recs?.topIncubators },
        { key: 'investors', label: 'Investors', data: recs?.topInvestors },
        { key: 'western-line', label: 'Western Line', data: westernLineData },
    ];

    const activeData = tabs.find(t => t.key === tab)?.data || [];

    return (
        <div className="recs">
            <div className="container">
                {/* Profile summary */}
                <div className="recs__profile card">
                    <div className="recs__profile-header">
                        <Sparkles size={18} />
                        <h2>Your recommendations</h2>
                    </div>
                    <div className="recs__profile-grid">
                        <div><span>Startup</span><strong>{profile.startupName || '—'}</strong></div>
                        <div><span>Sector</span><strong>{profile.sector}</strong></div>
                        <div><span>Stage</span><strong>{profile.stage}</strong></div>
                        <div><span>Location</span><strong>{profile.geography}</strong></div>
                    </div>
                    <div className="recs__profile-actions">
                        <Link href="/onboarding" className="btn btn-sm btn-secondary">Edit profile</Link>
                        <Link href="/advisor" className="btn btn-sm btn-ghost">Ask AI Advisor</Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="recs__tabs">
                    {tabs.map(t => (
                        <button key={t.key} className={`recs__tab ${tab === t.key ? 'recs__tab--active' : ''}`} onClick={() => setTab(t.key)}>
                            {t.label} <span className="recs__tab-count">{t.data?.length || 0}</span>
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div className="recs__grid">
                    {tab === 'western-line'
                        ? activeData.map(item => <WesternLineCard key={item.id} item={item} />)
                        : activeData.map(item => <RecCard key={item.id} item={item} />)}
                </div>
                {activeData.length === 0 && <p className="text-center text-muted" style={{ padding: 'var(--space-3xl)' }}>No matches found in this category.</p>}
            </div>

            <style jsx>{`
        .recs { padding: var(--space-3xl) 0 var(--space-4xl); min-height: 100vh; }
        .recs__profile { padding: var(--space-xl); margin-bottom: var(--space-2xl); }
        .recs__profile-header { display: flex; align-items: center; gap: var(--space-sm); color: var(--brand); margin-bottom: var(--space-lg); }
        .recs__profile-header h2 { font-size: var(--fs-lg); color: var(--gray-900); }
        .recs__profile-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-lg); margin-bottom: var(--space-lg); }
        .recs__profile-grid span { font-size: var(--fs-xs); color: var(--gray-400); display: block; }
        .recs__profile-grid strong { font-size: var(--fs-sm); }
        .recs__profile-actions { display: flex; gap: var(--space-sm); }
        .recs__tabs { display: flex; gap: var(--space-xs); margin-bottom: var(--space-xl); border-bottom: 1px solid var(--gray-200); }
        .recs__tab { padding: var(--space-md) var(--space-lg); font-size: var(--fs-sm); font-weight: 500; color: var(--gray-500); cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; font-family: var(--font); display: flex; align-items: center; gap: var(--space-sm); }
        .recs__tab:hover { color: var(--gray-800); }
        .recs__tab--active { color: var(--gray-900); border-bottom-color: var(--brand); font-weight: 600; }
        .recs__tab-count { background: var(--gray-100); padding: 1px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs); }
        .recs__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); }
        @media (max-width: 768px) { .recs__profile-grid { grid-template-columns: repeat(2, 1fr); } .recs__grid { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
}

export default function RecommendationsPage() {
    return (
        <Suspense fallback={<div className="container-sm" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>Loading recommendations...</div>}>
            <RecommendationsPageContent />
        </Suspense>
    );
}
