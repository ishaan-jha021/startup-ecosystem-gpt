'use client';

import { useState, useMemo } from 'react';
import { grants } from '@/lib/data/grants';
import { incubators } from '@/lib/data/incubators';
import { investors } from '@/lib/data/investors';
import { Search, ExternalLink, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const SECTORS = ['All', 'AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'DeepTech', 'AI/ML', 'SaaS', 'CleanTech', 'BioTech', 'Consumer Tech', 'IoT', 'D2C'];
const STAGES = ['All', 'Idea', 'MVP', 'Revenue', 'Scaling'];

function ResourceCard({ item, type }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rc card">
      <div className="rc__head">
        <div>
          <span className="badge badge-neutral">{item.type || type}</span>
          {item.funding && <span className="badge badge-success">{item.funding}</span>}
          {item.chequeSize && <span className="badge badge-success">{item.chequeSize}</span>}
        </div>
      </div>
      <h3 className="rc__name">{item.name}</h3>
      {item.provider && <p className="rc__provider">{item.provider}</p>}
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
          {item.eligibility && (
            <div className="rc__section">
              <h4>Eligibility</h4>
              <ul>{item.eligibility.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}
          {item.benefits && (
            <div className="rc__section">
              <h4>Benefits</h4>
              <ul>{item.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          )}
          {item.portfolio && (
            <div className="rc__section">
              <h4>Portfolio</h4>
              <p className="text-sm text-muted">{item.portfolio.join(', ')}</p>
            </div>
          )}
          <div className="rc__meta">
            {item.geography && <div><span>Geography</span><strong>{item.geography}</strong></div>}
            {item.location && <div><span>Location</span><strong>{item.location}</strong></div>}
            {item.deadline && <div><span>Deadline</span><strong>{item.deadline}</strong></div>}
            {item.duration && <div><span>Duration</span><strong>{item.duration}</strong></div>}
            {item.equity && <div><span>Equity</span><strong>{item.equity}</strong></div>}
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
        .rc__provider { font-size: var(--fs-xs); color: var(--gray-500); margin-bottom: var(--space-md); }
        .rc__desc { font-size: var(--fs-sm); color: var(--gray-600); line-height: var(--lh-relaxed); margin-bottom: var(--space-md); }
        .rc__tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-md); }
        .rc__toggle { display: inline-flex; align-items: center; gap: 4px; font-size: var(--fs-xs); font-weight: 600; color: var(--brand); cursor: pointer; background: none; border: none; padding: 0; font-family: var(--font); }
        .rc__details { margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--gray-100); }
        .rc__section { margin-bottom: var(--space-lg); }
        .rc__section h4 { font-size: var(--fs-xs); font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: var(--space-sm); }
        .rc__section ul { list-style: disc; padding-left: var(--space-xl); }
        .rc__section li { font-size: var(--fs-sm); color: var(--gray-600); margin-bottom: 4px; }
        .rc__meta { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); }
        .rc__meta span { font-size: var(--fs-xs); color: var(--gray-400); display: block; }
        .rc__meta strong { font-size: var(--fs-sm); color: var(--gray-800); font-weight: 600; }
      `}</style>
    </div>
  );
}

export default function ExplorePage() {
  const [tab, setTab] = useState('grants');
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('All');
  const [stage, setStage] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const dataMap = { grants: { data: grants, type: 'grant' }, incubators: { data: incubators, type: 'incubator' }, investors: { data: investors, type: 'investor' } };

  const filtered = useMemo(() => {
    const { data } = dataMap[tab];
    return data.filter(item => {
      if (q) {
        const haystack = `${item.name} ${item.description} ${item.provider || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
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
  }, [tab, q, sector, stage]);

  const tabs = [
    { key: 'grants', label: 'Grants', count: grants.length },
    { key: 'incubators', label: 'Incubators', count: incubators.length },
    { key: 'investors', label: 'Investors', count: investors.length },
  ];

  return (
    <div className="explore">
      <div className="container">
        <div className="explore__header">
          <h1>Explore the ecosystem</h1>
          <p>Browse 135+ grants, incubators, accelerators, and investors — all in one place.</p>
        </div>

        <div className="explore__toolbar">
          <div className="explore__search">
            <Search size={16} />
            <input type="text" placeholder="Search resources..." value={q} onChange={e => setQ(e.target.value)} />
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

        <div className="explore__tabs">
          {tabs.map(t => (
            <button key={t.key} className={`explore__tab ${tab === t.key ? 'explore__tab--active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label} <span className="explore__tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-lg">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
        <div className="explore__grid">
          {filtered.map(item => <ResourceCard key={item.id} item={item} type={dataMap[tab].type} />)}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted" style={{ padding: 'var(--space-4xl)' }}>No resources match your filters.</p>}
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
        .explore__tabs { display: flex; gap: var(--space-xs); margin-bottom: var(--space-xl); border-bottom: 1px solid var(--gray-200); }
        .explore__tab { padding: var(--space-md) var(--space-lg); font-size: var(--fs-sm); font-weight: 500; color: var(--gray-500); cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; font-family: var(--font); display: flex; align-items: center; gap: var(--space-sm); transition: all var(--transition-fast); }
        .explore__tab:hover { color: var(--gray-800); }
        .explore__tab--active { color: var(--gray-900); border-bottom-color: var(--brand); font-weight: 600; }
        .explore__tab-count { background: var(--gray-100); padding: 1px 8px; border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 500; }
        .explore__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); }
        @media (max-width: 768px) { .explore__grid { grid-template-columns: 1fr; } .explore__toolbar { flex-direction: column; } }
      `}</style>
    </div>
  );
}
