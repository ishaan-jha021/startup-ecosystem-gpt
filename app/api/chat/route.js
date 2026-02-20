import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { grants } from '@/lib/data/grants';
import { incubators } from '@/lib/data/incubators';
import { investors } from '@/lib/data/investors';

function buildContext() {
    // Keep concise — name + key facts only to stay within token limits
    const grantLines = grants.map(g => `${g.name}: ${g.funding}, ${g.stage.join('/')}`).join('\n');
    const incLines = incubators.map(i => `${i.name} (${i.location}): ${i.type}, ${i.stage.join('/')}`).join('\n');
    const invLines = investors.map(i => `${i.name}: ${i.chequeSize}, ${i.stage.join('/')}, ${i.sectors.slice(0, 3).join('/')}`).join('\n');

    return `You are SEGPT — an AI advisor helping Indian startup founders find grants, incubators, and investors.

GRANTS & SCHEMES (${grants.length} total):
${grantLines}

INCUBATORS (${incubators.length} total):
${incLines}

INVESTORS (${investors.length} total):
${invLines}

RULES:
- Give specific, actionable advice referencing resources above
- Explain WHY each resource matches the founder's profile
- Include eligibility and next steps
- Use **bold** headings and bullet points
- Be concise but helpful
- If unsure, say so and suggest where to find info`;
}

export async function POST(req) {
    try {
        const { message, profile, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: getFallbackReply(message, profile) });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const systemPrompt = buildContext();
        const profileCtx = profile && profile.sector
            ? `\n\nFounder profile: ${profile.startupName || 'Unknown'}, Sector: ${profile.sector}, Stage: ${profile.stage}, Team: ${profile.teamBackground}, Location: ${profile.geography}, Revenue: ${profile.revenue || 'N/A'}, Research/IP: ${profile.isResearchBased ? 'Yes' : 'No'}`
            : '\n\nFounder has not completed profile yet. Encourage them to complete it at /onboarding.';

        const chatHistory = (history || [])
            .filter(m => m.role !== 'system')
            .slice(-6)
            .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

        const MAX_RETRIES = 2;
        let lastErr = null;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (attempt > 0) {
                    await new Promise(r => setTimeout(r, attempt * 2000));
                }

                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: systemPrompt + profileCtx }] },
                        { role: 'model', parts: [{ text: 'Ready to help! I have access to the full Indian startup ecosystem database.' }] },
                        ...chatHistory,
                    ],
                });

                const result = await chat.sendMessage(message);
                const reply = result.response.text();
                return NextResponse.json({ reply });
            } catch (err) {
                lastErr = err;
                const is429 = err?.status === 429 || String(err?.message || '').includes('429') || String(err || '').includes('RESOURCE_EXHAUSTED');
                if (!is429) break;
                console.log(`Gemini 429 — retry ${attempt + 1}/${MAX_RETRIES}...`);
            }
        }

        // If we reach here, it failed after retries
        const is429 = lastErr?.status === 429 || String(lastErr?.message || '').includes('429') || String(lastErr || '').includes('RESOURCE_EXHAUSTED');
        if (is429) {
            return NextResponse.json({
                reply: 'The AI advisor is temporarily rate-limited. Please wait about 30 seconds and try again.\n\nIn the meantime, browse resources on the **Explore** page.',
            });
        }

        return NextResponse.json({ reply: getFallbackReply(message, profile) });

    } catch (error) {
        console.error('Fatal Chat API error:', error);
        return NextResponse.json({
            reply: '⚠️ An unexpected error occurred. Please try again later or check your network connection.',
        });
    }
}

function getFallbackReply(message, profile) {
    const q = message.toLowerCase();

    if (q.includes('grant') || q.includes('funding') || q.includes('scheme')) {
        const stage = profile?.stage || 'Idea';
        const relevant = grants.filter(g => g.stage.includes(stage)).slice(0, 3);
        return `Here are some grants relevant to your **${stage}** stage:\n\n${relevant.map(g =>
            `**${g.name}** (${g.provider})\n- Funding: ${g.funding}\n- Sectors: ${g.sectors.join(', ')}\n- [Visit Website](${g.website})`
        ).join('\n\n')}`;
    }

    if (q.includes('incubator') || q.includes('accelerator')) {
        const relevant = incubators.slice(0, 3);
        return `Here are some top incubators:\n\n${relevant.map(i =>
            `**${i.name}** (${i.location})\n- Type: ${i.type}\n- Equity: ${i.equity}\n- [Visit Website](${i.website})`
        ).join('\n\n')}`;
    }

    if (q.includes('investor') || q.includes('vc') || q.includes('angel')) {
        const relevant = investors.slice(0, 3);
        return `Here are some investors to explore:\n\n${relevant.map(i =>
            `**${i.name}** (${i.type})\n- Cheque Size: ${i.chequeSize}\n- Sectors: ${i.sectors.join(', ')}\n- [Visit Website](${i.website})`
        ).join('\n\n')}`;
    }

    return `I can help you with:\n\n- **Grants & Schemes** — Government funding programs\n- **Incubators & Accelerators** — Programs to boost your startup\n- **Investors** — Angels, VCs, and funding platforms\n- **Next Steps** — What to do at your current stage\n\nTry asking something like "Which grants am I eligible for?" or "Best incubators for FinTech startups."`;
}
