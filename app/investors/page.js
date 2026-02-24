'use client';

import { useState, useMemo } from 'react';
import { investors } from '@/lib/data/investors';
import { Search, ExternalLink, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const SECTORS = ['All', 'AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'DeepTech', 'AI/ML', 'SaaS', 'CleanTech', 'BioTech', 'Consumer Tech', 'IoT', 'D2C'];
const STAGES = ['All', 'Idea', 'MVP', 'Revenue', 'Scaling'];

function ResourceCard({ item }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rc card">
            <div className="rc__head">
                <div>
                    <span className="badge badge-neutral">Investor</span>
                    {item.chequeSize && <span className="badge badge-success">{item.chequeSize}</span>}
                </div>
            </div>
            <h3 className="rc__name">{item.name}</h3>
            <p className="rc__desc">{item.description}</p>
            <div className="rc__tags">
                {(item.stage || []).map(s => <span key={s} className="badge badge-brand">{s}</span>)}
                {(item.sectors || []).slice(0, 3).map(s => <span key={s} className="badge badge-neutral">{s}</span>)}
            </div>

            <button className="rc__toggle" onClick={() => setOpen(!open)}>
                {open ? 'Less' : 'Details'} {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {open && (
                <div className="rc__details">
                    {item.portfolio && (
                        <div className="rc__section">
                            <h4>Notable Portfolio</h4>
                            <p className="text-sm text-muted">{item.portfolio.join(', ')}</p>
                        </div>
                    )}
                    <div className="rc__meta">
                        {item.location && <div><span>Location</span><strong>{item.location}</strong></div>}
                        {item.equity && <div><span>Typical Equity</span><strong>{item.equity}</strong></div>}
                    </div>
                </div>
            )}

            {item.website && (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary mt-lg">
                    Visit website <ExternalLink size={12} />
                </a>
            )}

            <style jsx>{`
        .rc { padding: var(--space-xl); }
        .rc__head { display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); }
        .rc__head > div { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
        .rc__name { font-size: var(--fs-base); font-weight: 700; margin-bottom: 2px; }
        .rc__desc { font-size: var(--fs-sm); color: var(--gray-600); line-height: var(--lh-relaxed); margin-bottom: var(--space-md); }
        .rc__tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-md); }
        .rc__toggle { display: inline-flex; align-items: center; gap: 4px; font-size: var(--fs-xs); font-weight: 600; color: var(--brand); cursor: pointer; background: none; border: none; padding: 0; font-family: var(--font); }
        .rc__details { margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--gray-100); }
        .rc__section { margin-bottom: var(--space-lg); }
        .rc__section h4 { font-size: var(--fs-xs); font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: var(--space-sm); }
        .rc__meta { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); }
        .rc__meta span { font-size: var(--fs-xs); color: var(--gray-400); display: block; }
        .rc__meta strong { font-size: var(--fs-sm); color: var(--gray-800); font-weight: 600; }
      `}</style>
        </div>
    );
}

export default function InvestorsPage() {
    const [q, setQ] = useState('');
    const [sector, setSector] = useState('All');
    const [stage, setStage] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const filtered = useMemo(() => {
        return investors.filter(item => {
            if (q) {
                const haystack = `${item.name} ${item.description} ${(item.tags || []).join(' ')}`.toLowerCase();
                if (!haystack.includes(q.toLowerCase())) return false;
            }
            if (sector !== 'All') {
                const s = item.sectors || [];
                if (!s.includes('All Sectors') && !s.some(x => x.toLowerCase().includes(sector.toLowerCase()))) return false;
            }
            if (stage !== 'All') {
                const s = item.stage || [];
                if (!s.some(x => x.toLowerCase() === stage.toLowerCase())) return false;
            }
            return true;
        });
    }, [q, sector, stage]);

    return (
        <div className="explore">
            <div className="container">
                <div className="explore__header">
                    <h1>Startup Investors</h1>
                    <p>Find VCs, Angel Networks, and Private Investors matched to your startup's sector and stage.</p>
                </div>

                <div className="explore__toolbar">
                    <div className="explore__search">
                        <Search size={16} />
                        <input type="text" placeholder="Search investors..." value={q} onChange={e => setQ(e.target.value)} />
                    </div>
                    <button className="btn btn-sm btn-secondary" onClick={() => setShowFilters(!showFilters)}>
                        <Filter size={14} /> Filters
                    </button>
                </div>

                {showFilters && (
                    <div className="explore__filters card">
                        <div className="filter-group">
                            <label>Sector</label>
                            <div className="chip-group">{SECTORS.map(s => <button key={s} className={`chip ${sector === s ? 'active' : ''}`} onClick={() => setSector(s)}>{s}</button>)}</div>
                        </div>
                        <div className="filter-group">
                            <label>Stage</label>
                            <div className="chip-group">{STAGES.map(s => <button key={s} className={`chip ${stage === s ? 'active' : ''}`} onClick={() => setStage(s)}>{s}</button>)}</div>
                        </div>
                    </div>
                )}

                <p className="text-sm text-muted mb-lg">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
                <div className="explore__grid">
                    {filtered.map(item => <ResourceCard key={item.id} item={item} />)}
                </div>
                {filtered.length === 0 && <p className="text-center text-muted" style={{ padding: 'var(--space-4xl)' }}>No investors match your filters.</p>}
            </div>

            <style jsx>{`
        .explore { padding: var(--space-3xl) 0 var(--space-4xl); min-height: 100vh; }
        .explore__header { margin-bottom: var(--space-2xl); }
        .explore__header h1 { font-size: var(--fs-2xl); margin-bottom: var(--space-sm); }
        .explore__header p { color: var(--gray-500); font-size: var(--fs-md); }
        .explore__toolbar { display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); }
        .explore__search { flex: 1; display: flex; align-items: center; gap: var(--space-sm); border: 1px solid var(--gray-300); border-radius: var(--radius-full); padding: 8px 16px; color: var(--gray-400); }
        .explore__search input { flex: 1; border: none; outline: none; font-size: var(--fs-sm); background: none; color: var(--gray-900); font-family: var(--font); }
        .explore__filters { padding: var(--space-xl); margin-bottom: var(--space-lg); }
        .filter-group { margin-bottom: var(--space-lg); }
        .filter-group:last-child { margin-bottom: 0; }
        .explore__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); }
        @media (max-width: 768px) { .explore__grid { grid-template-columns: 1fr; } .explore__toolbar { flex-direction: column; } }
      `}</style>
        </div>
    );
}
