'use client';

import { useState, useMemo } from 'react';
import { grants } from '@/lib/data/grants';
import { ExternalLink, ChevronDown, ChevronUp, Search, MapPin, Building2, TrendingUp, Filter } from 'lucide-react';

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

function ResourceCard({ item }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="dir-card card">
            <div className="dir-card__top">
                <div className="dir-card__info">
                    <span className="badge badge-neutral">Grant</span>
                    <h3>{item.name}</h3>
                    <p className="dir-card__location"><MapPin size={12} /> {item.provider}</p>
                </div>
                <ScoreBadge score={75} />
            </div>

            <div className="dir-card__grid">
                <div className="dir-card__metric">
                    <span>Funding Limit</span>
                    <strong>{item.funding}</strong>
                </div>
                <div className="dir-card__metric">
                    <span>Ideal Stage</span>
                    <strong>{(item.stage || []).join(', ')}</strong>
                </div>
                <div className="dir-card__metric">
                    <span>Geography</span>
                    <strong>{item.geography}</strong>
                </div>
                <div className="dir-card__metric">
                    <span>Deadline</span>
                    <strong>{item.deadline}</strong>
                </div>
            </div>

            <button className="dir-card__toggle" onClick={() => setOpen(!open)}>
                {open ? 'Hide details' : 'View all details'} {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {open && (
                <div className="dir-card__reasons">
                    <ul>
                        {item.eligibility && <li><strong>Eligibility:</strong> {item.eligibility.slice(0, 2).join(', ')}</li>}
                        {item.sectors && <li><strong>Sectors:</strong> {item.sectors.slice(0, 3).join(', ')}</li>}
                    </ul>
                </div>
            )}

            <div className="dir-card__links">
                <a
                    href={item.website || '#'}
                    target={item.website ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary dir-card__link"
                    onClick={(e) => { if (!item.website) e.preventDefault(); }}
                >
                    Visit Website <ExternalLink size={12} />
                </a>
            </div>

            <style jsx>{`
        .dir-card { padding: var(--space-xl); height: 100%; display: flex; flex-direction: column; }
        .dir-card__top { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-lg); margin-bottom: var(--space-md); }
        .dir-card__info h3 { font-size: var(--fs-lg); font-weight: 700; margin: var(--space-sm) 0 4px; color: var(--gray-900); }
        .dir-card__location { display: flex; align-items: center; gap: 4px; font-size: var(--fs-sm); color: var(--gray-500); }
        
        .dir-card__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-lg); padding: var(--space-md); background: var(--gray-50); border-radius: var(--radius-md); }
        .dir-card__metric { display: flex; flex-direction: column; gap: 2px; }
        .dir-card__metric span { font-size: var(--fs-xs); color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }
        .dir-card__metric strong { font-size: var(--fs-sm); color: var(--gray-900); }
        
        .dir-card__toggle { display: inline-flex; align-items: center; gap: 4px; font-size: var(--fs-sm); font-weight: 600; color: var(--brand); cursor: pointer; background: none; border: none; padding: 0; font-family: var(--font); margin-bottom: var(--space-md); }
        .dir-card__reasons { margin-bottom: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--gray-100); }
        .dir-card__reasons ul { list-style: none; padding-left: 0; }
        .dir-card__reasons li { font-size: var(--fs-sm); color: var(--gray-600); margin-bottom: 8px; display: flex; flex-direction: column; border-bottom: 1px dashed var(--gray-200); padding-bottom: 4px; }
        .dir-card__reasons li strong { color: var(--gray-900); margin-bottom: 2px; }
        
        .dir-card__links { margin-top: auto; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--gray-100); padding-top: var(--space-lg); }
        .dir-card__link { justify-content: center; width: 100%; border-radius: var(--radius-full); }
      `}</style>
        </div>
    );
}

export default function GrantsPage() {
    const [search, setSearch] = useState('');
    const [sectorFilter, setSectorFilter] = useState('All');
    const [stageFilter, setStageFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const sectors = ['All', 'AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'DeepTech', 'AI/ML', 'SaaS', 'CleanTech', 'BioTech', 'Consumer Tech', 'IoT', 'D2C'];
    const stages = ['All', 'Idea', 'MVP', 'Revenue', 'Scaling'];

    const filteredData = useMemo(() => {
        return grants.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                (item.provider || '').toLowerCase().includes(search.toLowerCase());

            const matchesSector = sectorFilter === 'All' ||
                (item.sectors || []).includes('All Sectors') ||
                (item.sectors || []).some(x => x.toLowerCase().includes(sectorFilter.toLowerCase()));

            const matchesStage = stageFilter === 'All' ||
                (item.stage || []).some(x => x.toLowerCase() === stageFilter.toLowerCase());

            return matchesSearch && matchesSector && matchesStage;
        });
    }, [search, sectorFilter, stageFilter]);

    const resetFilters = () => {
        setSearch(''); setSectorFilter('All'); setStageFilter('All');
    };

    return (
        <div className="directory-page">
            <header className="dir-header text-center">
                <div className="container-sm">
                    <span className="badge badge-brand mb-md">Financial support</span>
                    <h1>Startup Grants & Schemes</h1>
                    <p className="text-muted text-lg mt-sm mb-xl">
                        Discover 60+ government and private grants. Filter by stage and sector to find non-dilutive funding for your startup.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className="dir-layout">
                    <main className="dir-content">
                        <div className="dir-results-info">
                            <p>Showing <strong>{filteredData.length}</strong> grants</p>
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowFilters(!showFilters)}>
                                <Filter size={14} /> {showFilters ? 'Hide Filters' : 'Adjust Filters'}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="dir-filters card mb-xl">
                                <div className="filters-grid">
                                    <div className="filter-group">
                                        <label><Search size={14} /> Search Grants</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. SISFS, NIDHI..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label><Building2 size={14} /> Sector</label>
                                        <div className="filter-chips">
                                            {sectors.map(s => (
                                                <button key={s} className={`chip ${sectorFilter === s ? 'active' : ''}`} onClick={() => setSectorFilter(s)}>{s}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="filter-group">
                                        <label><TrendingUp size={14} /> Ideal Stage</label>
                                        <div className="filter-chips">
                                            {stages.map(s => (
                                                <button key={s} className={`chip ${stageFilter === s ? 'active' : ''}`} onClick={() => setStageFilter(s)}>{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-reset">
                                    <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset All Filters</button>
                                </div>
                            </div>
                        )}

                        <div className="dir-grid">
                            {filteredData.map(item => <ResourceCard key={item.id} item={item} />)}
                        </div>
                        {filteredData.length === 0 && (
                            <div className="empty-state card text-center">
                                <h3>No grants found</h3>
                                <p className="text-muted mt-sm mb-lg">We couldn't find any resources matching your filters.</p>
                                <button className="btn btn-secondary" onClick={resetFilters}>Clear Filters</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style jsx>{`
                .directory-page { padding: var(--space-4xl) 0; min-height: 100vh; background: var(--gray-50); }
                .dir-header { margin-bottom: var(--space-4xl); }
                .dir-header h1 { font-size: var(--fs-4xl); font-weight: 800; letter-spacing: -0.03em; color: var(--gray-900); }
                
                .dir-layout { display: flex; flex-direction: column; gap: var(--space-2xl); align-items: stretch; width: 100%; }
                
                .dir-filters { padding: var(--space-xl); border: 1px solid var(--gray-200); border-radius: var(--radius-xl); background: var(--white); box-shadow: 0 4px 20px -10px rgba(0,0,0,0.05); }
                .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-xl); margin-bottom: var(--space-xl); }
                
                .filter-group label { display: flex; align-items: center; gap: 6px; font-size: var(--fs-sm); font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-sm); text-transform: uppercase; letter-spacing: 0.05em; }
                .filter-chips { display: flex; flex-wrap: wrap; gap: 8px; }
                .chip { padding: 6px 12px; font-size: var(--fs-sm); border: 1px solid var(--gray-200); background: var(--white); border-radius: var(--radius-full); cursor: pointer; color: var(--gray-600); font-family: var(--font); transition: all 0.2s; }
                .chip:hover { border-color: var(--gray-300); background: var(--gray-50); }
                .chip.active { background: var(--brand); color: white; border-color: var(--brand); font-weight: 500; }
                .filter-reset { padding-top: var(--space-lg); border-top: 1px solid var(--gray-100); display: flex; justify-content: center; }

                .dir-results-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); font-size: var(--fs-sm); color: var(--gray-500); }
                .dir-results-info strong { color: var(--gray-900); }
                .dir-results-info button { font-weight: 600; display: flex; align-items: center; gap: 6px; }
                
                .dir-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: var(--space-xl); }
                .empty-state { padding: var(--space-4xl) var(--space-2xl); }

                @media (max-width: 900px) {
                    .dir-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
