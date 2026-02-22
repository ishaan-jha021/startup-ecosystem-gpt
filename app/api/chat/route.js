import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { grants } from '@/lib/data/grants';
import { incubators } from '@/lib/data/incubators';
import { investors } from '@/lib/data/investors';

function buildContext(filteredGrants, filteredIncubators, filteredInvestors) {
    // Build strings from ONLY the relevant items to save tokens and stay within rate limits
    const grantLines = filteredGrants.map(g => `- ${g.name}: ${g.funding}, Stage: ${g.stage.join('/')}`).join('\n');
    const incLines = filteredIncubators.map(i => `- ${i.name} (${i.location}): ${i.type}`).join('\n');
    const invLines = filteredInvestors.map(i => `- ${i.name}: ${i.chequeSize}, Sectors: ${i.sectors.slice(0, 3).join('/')}`).join('\n');

    return `You are SEGPT, the ultimate AI Mentor for Indian startup founders. Your goal is to provide a strategic roadmap and match founders with the best resources.

CORE PHILOSOPHY:
- BE A MENTOR: Speak with empathy and authority. 
- DIAGNOSE FIRST: Acknowledge the specific problem they are facing before jumping to solutions.
- STRATEGY THEN RESOURCES: Always explain the 'Why' and 'How' before listing 'What'.

AVAILABLE RELEVANT RESOURCES (${filteredGrants.length + filteredIncubators.length + filteredInvestors.length} matched):
${grantLines}

${incLines}

${invLines}

RESPONSE RULES:
1. ALWAYS start with a brief strategic insight or acknowledgement of their specific situation.
2. Provide a 3-step actionable "Battle Plan".
3. Map specific resources from the list above to each step of that plan.
4. Use **bold** for emphasis and clear bullet points.
5. If the provided list is short, supplement with general ecosystem wisdom (DPIIT, Startup India, etc.).`;
}

export async function POST(req) {
    try {
        const { message, profile, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                reply: `⚠️ **AI Config Missing**: The \`GEMINI_API_KEY\` is not set in environment variables. 
                
                If you are on Vercel, please add it to your project settings. 
                
                ---
                ${getFallbackReply(message, profile)}`
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // --- OPTIMIZE CONTEXT BY FILTERING ---
        // Only send items that match the user's sector or stage to save tokens
        const userSectors = [profile?.sector || '', ...(profile?.interests || [])].map(s => s.toLowerCase());
        const userStage = profile?.stage || 'Idea';

        const filterItems = (list) => {
            return list.filter(item => {
                const matchesSector = item.sectors?.some(s => userSectors.includes(s.toLowerCase())) || item.sectors?.includes('All Sectors');
                const matchesStage = item.stage?.includes(userStage);
                return matchesSector || matchesStage;
            }).slice(0, 15); // Limit to top 15 per category to keep prompt slim
        };

        const filteredGrants = filterItems(grants);
        const filteredIncubators = filterItems(incubators);
        const filteredInvestors = filterItems(investors);

        const systemPrompt = buildContext(filteredGrants, filteredIncubators, filteredInvestors);
        const profileCtx = profile && profile.sector
            ? `\n\nFOUNDER CONTEXT:
Startup: "${profile.startupName || 'Stealth'}", Sector: ${profile.sector}, Stage: ${profile.stage}, Geography: ${profile.geography}.
Note: Use this to personalize the plan.`
            : '\n\nNOTE: Founder profile incomplete. Provide general high-quality strategy.';

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

        // If we reach here, it failed with a non-429 error or after retries
        console.error('Gemini API Error:', lastErr);
        return NextResponse.json({
            reply: `⚠️ **AI Call Failed**: ${lastErr?.message || 'Unknown API Error'} 
            
            ---
            ${getFallbackReply(message, profile)}`
        });

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
