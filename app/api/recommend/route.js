import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/matching';

export async function POST(req) {
    try {
        const body = await req.json();
        const { profile } = body;

        if (!profile || !profile.sector) {
            return NextResponse.json({ error: 'Profile is required' }, { status: 400 });
        }

        const recommendations = getRecommendations(profile);

        return NextResponse.json({
            profile,
            recommendations: {
                topGrants: recommendations.topGrants,
                topIncubators: recommendations.topIncubators,
                topInvestors: recommendations.topInvestors,
            },
        });
    } catch (error) {
        console.error('Recommendation error:', error);
        return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
    }
}
