import { grants } from './data/grants';
import { incubators } from './data/incubators';
import { investors } from './data/investors';

/**
 * Scores a resource against a startup profile.
 * Returns { score, reasons } where score is 0-100 and reasons is an array of strings.
 */
function scoreResource(resource, profile) {
    let score = 0;
    const reasons = [];
    const maxScore = 100;

    // ----- Sector matching (0-35 points) -----
    const resourceSectors = resource.sectors || [];
    const profileSector = profile.sector || '';

    if (resourceSectors.includes('All Sectors')) {
        score += 25;
        reasons.push(`Open to all sectors including ${profileSector}`);
    } else if (resourceSectors.some(s => s.toLowerCase() === profileSector.toLowerCase())) {
        score += 35;
        reasons.push(`Directly targets ${profileSector} startups`);
    } else if (resourceSectors.some(s => profileSector.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(profileSector.toLowerCase()))) {
        score += 20;
        reasons.push(`Related to your sector: ${profileSector}`);
    }

    // ----- Stage matching (0-30 points) -----
    const resourceStages = resource.stage || [];
    const profileStage = profile.stage || '';

    if (resourceStages.some(s => s.toLowerCase() === profileStage.toLowerCase())) {
        score += 30;
        reasons.push(`Accepts startups at ${profileStage} stage`);
    } else if (resourceStages.length > 0) {
        // Partial stage match — adjacent stages
        const stageOrder = ['idea', 'mvp', 'revenue', 'scaling'];
        const profIdx = stageOrder.indexOf(profileStage.toLowerCase());
        const resIndices = resourceStages.map(s => stageOrder.indexOf(s.toLowerCase())).filter(i => i >= 0);
        if (profIdx >= 0 && resIndices.length > 0) {
            const minDist = Math.min(...resIndices.map(i => Math.abs(i - profIdx)));
            if (minDist === 1) {
                score += 15;
                reasons.push(`Close to your stage (${profileStage})`);
            }
        }
    }

    // ----- Geography matching (0-20 points) -----
    const resourceGeo = (resource.geography || resource.location || '').toLowerCase();
    const profileGeo = (profile.geography || '').toLowerCase();

    if (resourceGeo.includes('pan india') || resourceGeo.includes('virtual') || resourceGeo.includes('global') || resourceGeo.includes('remote')) {
        score += 15;
        reasons.push('Available across India / Globally');
    } else if (profileGeo && resourceGeo.includes(profileGeo)) {
        score += 20;
        reasons.push(`Based in your region: ${profile.geography}`);
    }

    // ----- Team / Background bonuses (0-15 points) -----
    const profileTeam = (profile.teamBackground || '').toLowerCase();
    const eligibility = (resource.eligibility || []).join(' ').toLowerCase();
    const tags = (resource.tags || []).join(' ').toLowerCase();

    if (profileTeam.includes('student') && (eligibility.includes('student') || tags.includes('academic'))) {
        score += 15;
        reasons.push('Supports student founders');
    } else if (profileTeam.includes('women') && (eligibility.includes('women') || tags.includes('women'))) {
        score += 15;
        reasons.push('Gives preference to women entrepreneurs');
    } else if (profileTeam.includes('research') && (tags.includes('research') || tags.includes('deep-tech'))) {
        score += 10;
        reasons.push('Supports research-based / deep-tech startups');
    } else if (profileTeam) {
        score += 5;
    }

    // IP bonus
    if (profile.isResearchBased && (tags.includes('research') || tags.includes('deep-tech') || tags.includes('ip'))) {
        score += 5;
        reasons.push('Aligned with IP/Research-based innovations');
    }

    return {
        score: Math.min(score, maxScore),
        reasons,
    };
}

/**
 * Match startup profile against all resources and return ranked results.
 */
export function getRecommendations(profile) {
    const allResources = [
        ...grants.map(g => ({ ...g, category: 'grant' })),
        ...incubators.map(i => ({ ...i, category: i.type || 'incubator' })),
        ...investors.map(i => ({ ...i, category: 'investor' })),
    ];

    const scored = allResources.map(resource => {
        const { score, reasons } = scoreResource(resource, profile);
        return { ...resource, matchScore: score, matchReasons: reasons };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    return {
        topGrants: scored.filter(r => r.category === 'grant').slice(0, 5),
        topIncubators: scored.filter(r => ['incubator', 'accelerator'].includes(r.category)).slice(0, 5),
        topInvestors: scored.filter(r => r.category === 'investor').slice(0, 5),
        all: scored,
    };
}
