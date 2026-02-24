'use client';

import { useState } from 'react';
import { westernLineData } from '@/lib/data/western_line';
import { ExternalLink, ChevronDown, ChevronUp, Search, MapPin, Building2, TrendingUp, Filter } from 'lucide-react';
import Link from 'next/link';

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

function DirectoryCard({ item }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="dir-card card">
            <div className="dir-card__top">
                <div className="dir-card__info">
                    <span className="badge badge-neutral">{item.type}</span>
                    <h3>{item.name}</h3>
                    <p className="dir-card__location"><MapPin size={12} /> {item.area}</p>
                </div>
                <ScoreBadge score={parseInt(item.brandValue) * 10 || 50} />
            </div>

            <div className="dir-card__grid">
                <div className="dir-card__metric">
                    <span>Equity Taken</span>
                    <strong>{item.equityTaken}</strong>
                </div>
                <div className="dir-card__metric">
                    <span>Fee Structure</span>
                    <strong>{item.fee}</strong>
                </div>
                <div className="dir-card__metric">
                    <span>Ideal Stage</span>
                    <strong>{item.idealStage}</strong>
                </div>
                <div className="dir-card__metric">
                    <span>Founder Freedom</span>
                    <strong>{item.founderFreedom}/10</strong>
                </div>
            </div>

            <button className="dir-card__toggle" onClick={() => setOpen(!open)}>
                {open ? 'Hide details' : 'View all details'} {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {open && (
                <div className="dir-card__reasons">
                    <ul>
                        <li><strong>Program Structure:</strong> {item.programStructure}</li>
                        <li><strong>Investor Access:</strong> {item.investorAccess}/10</li>
                        <li><strong>Funding Guarantee:</strong> {item.fundingGuarantee}</li>
                        <li><strong>Conf Hall / Call Booths:</strong> {item.confHallCapacity} / {item.callBooths}</li>
                        <li><strong>Contact:</strong> {item.contactDetails}</li>
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

                {item.googleMapsLink && (
                    <a href={item.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary dir-card__link">
                        Google Maps <ExternalLink size={12} />
                    </a>
                )}
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
        .dir-card__reasons li { font-size: var(--fs-sm); color: var(--gray-600); margin-bottom: 8px; display: flex; justify-content: space-between; border-bottom: 1px dashed var(--gray-200); padding-bottom: 4px; }
        .dir-card__reasons li strong { color: var(--gray-900); }
        
        .dir-card__links { margin-top: auto; display: flex; flex-direction: column; gap: 8px; }
        .dir-card__link { justify-content: center; }
      `}</style>
        </div>
    );
}

export default function DirectoryPage() {
    const [search, setSearch] = useState('');
    const [regionFilter, setRegionFilter] = useState('All');
    const [broadTypeFilter, setBroadTypeFilter] = useState('All');
    const [equityCategoryFilter, setEquityCategoryFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    // Currently only Western Line data, prepared for merging others later
    const allData = [...westernLineData];

    // Simplified categories for faster discovery
    const regions = ['All', 'West Mumbai', 'East Mumbai', 'South Mumbai', 'Central Mumbai', 'Navi Mumbai', 'Thane / MMR'];
    const broadTypes = ['All', 'Private', 'Government / Academic'];
    const equityCategories = ['All', 'Zero Equity', 'Equity Taken'];

    // Filter logic
    const filteredData = allData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.area.toLowerCase().includes(search.toLowerCase());

        const matchesRegion = regionFilter === 'All' || item.subRegion === regionFilter;
        const matchesBroadType = broadTypeFilter === 'All' || item.broadType === broadTypeFilter;
        const matchesEquity = equityCategoryFilter === 'All' || item.equityCategory === equityCategoryFilter;

        return matchesSearch && matchesRegion && matchesBroadType && matchesEquity;
    });

    const resetFilters = () => {
        setSearch(''); setRegionFilter('All'); setBroadTypeFilter('All'); setEquityCategoryFilter('All');
    };

    return (
        <div className="directory-page">
            {/* Header Section */}
            <header className="dir-header text-center">
                <div className="container-sm">
                    <span className="badge badge-brand mb-md">Ecosystem Directory</span>
                    <h1>Find Your Startup Space</h1>
                    <p className="text-muted text-lg mt-sm mb-xl">
                        Explore coworking spaces, incubators, and accelerators. Compare equity, fees, and mentor access to find your perfect launchpad.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className="dir-layout">
                    {/* Main Content */}
                    <main className="dir-content">
                        <div className="dir-results-info">
                            <p>Showing <strong>{filteredData.length}</strong> resources</p>
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowFilters(!showFilters)}>
                                <Filter size={14} /> {showFilters ? 'Hide Filters' : 'Adjust Filters'}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="dir-filters card mb-xl">
                                <div className="filters-grid">
                                    <div className="filter-group">
                                        <label><Search size={14} /> Search Name/Area</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. Bandra, WeWork..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label><MapPin size={14} /> Mumbai Sub-Regions</label>
                                        <div className="filter-chips">
                                            {regions.map(r => (
                                                <button
                                                    key={r}
                                                    className={`chip ${regionFilter === r ? 'active' : ''}`}
                                                    onClick={() => setRegionFilter(r)}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="filter-group">
                                        <label><Building2 size={14} /> Organization Type</label>
                                        <div className="filter-chips">
                                            {broadTypes.map(bt => (
                                                <button
                                                    key={bt}
                                                    className={`chip ${broadTypeFilter === bt ? 'active' : ''}`}
                                                    onClick={() => setBroadTypeFilter(bt)}
                                                >
                                                    {bt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="filter-group">
                                        <label><TrendingUp size={14} /> Equity Participation</label>
                                        <div className="filter-chips">
                                            {equityCategories.map(ec => (
                                                <button
                                                    key={ec}
                                                    className={`chip ${equityCategoryFilter === ec ? 'active' : ''}`}
                                                    onClick={() => setEquityCategoryFilter(ec)}
                                                >
                                                    {ec}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="filter-reset">
                                    <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {filteredData.length > 0 ? (
                            <div className="dir-grid">
                                {filteredData.map(item => (
                                    <DirectoryCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state card text-center">
                                <h3>No spaces found</h3>
                                <p className="text-muted mt-sm mb-lg">We couldn't find any resources matching your filters.</p>
                                <button className="btn btn-secondary" onClick={resetFilters}>Clear Filters</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <DirectoryAdvisorBot />

            <style jsx>{`
                .directory-page { padding: var(--space-4xl) 0; min-height: 100vh; background: var(--gray-50); }
                .dir-header { margin-bottom: var(--space-4xl); }
                .dir-header h1 { font-size: var(--fs-4xl); font-weight: 800; letter-spacing: -0.03em; color: var(--gray-900); }
                
                .dir-layout { display: flex; flex-direction: column; gap: var(--space-2xl); align-items: stretch; width: 100%; }
                
                /* Filters Panel */
                .dir-filters { padding: var(--space-xl); border: 1px solid var(--gray-200); border-radius: var(--radius-xl); background: var(--white); box-shadow: 0 4px 20px -10px rgba(0,0,0,0.05); }
                .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-xl); margin-bottom: var(--space-xl); }
                
                .filter-group label { display: flex; align-items: center; gap: 6px; font-size: var(--fs-sm); font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-sm); text-transform: uppercase; letter-spacing: 0.05em; }
                .filter-chips { display: flex; flex-wrap: wrap; gap: 8px; }
                .chip { padding: 6px 12px; font-size: var(--fs-sm); border: 1px solid var(--gray-200); background: var(--white); border-radius: var(--radius-full); cursor: pointer; color: var(--gray-600); font-family: var(--font); transition: all 0.2s; }
                .chip:hover { border-color: var(--gray-300); background: var(--gray-50); }
                .chip.active { background: var(--brand); color: white; border-color: var(--brand); font-weight: 500; }
                .filter-reset { padding-top: var(--space-lg); border-top: 1px solid var(--gray-100); display: flex; justify-content: center; }

                /* Main */
                .dir-results-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); font-size: var(--fs-sm); color: var(--gray-500); }
                .dir-results-info strong { color: var(--gray-900); }
                .dir-results-info button { font-weight: 600; display: flex; align-items: center; gap: 6px; }
                
                .dir-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl); }
                
                .empty-state { padding: var(--space-4xl) var(--space-2xl); }

                @media (max-width: 900px) {
                    .dir-grid { grid-template-columns: 1fr; }
                    .filters-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
