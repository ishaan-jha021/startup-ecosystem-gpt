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

    return `You are SEGPT, the ultimate AI Mentor for Indian startup founders. Your goal is not just to provide data, but to deeply understand the founder's struggle and provide a high-authority strategic roadmap.

CORE PHILOSOPHY:
- BE A MENTOR: Speak with empathy and authority. Founders are often stressed and need clarity, not just links.
- DIAGNOSE FIRST: Before jumping to solutions, acknowledge the specific problem they are facing (e.g., "Founding a tech startup without a CTO is a common but high-risk challenge...").
- STRATEGY THEN RESOURCES: Always explain the 'Why' and 'How' before listing 'What'. Map out a 2-3 step plan.
- INDIAN CONTEXT: You have deep knowledge of the Indian startup ecosystem, including DPIIT, State Policies, and the nuances of the Indian market.

GRANTS & SCHEMES (${grants.length} total):
${grantLines}

INCUBATORS (${incubators.length} total):
${incLines}

INVESTORS (${investors.length} total):
${invLines}

RESPONSE RULES:
1. ALWAYS start with a brief strategic insight or acknowledgement of their specific situation.
2. Provide a 3-step actionable "Battle Plan".
3. Map specific resources (Grants/Incubators/Investors) from the database above to each step of that plan.
4. If a founder lacks a profile, gently mention how completing it helps you tailor advice to their specific sector and stage.
5. Use **bold** for emphasis and clear bullet points.
6. If the database doesn't have a perfect match, provide the "closest best" strategic direction based on ecosystem wisdom.`;
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

        const systemPrompt = buildContext();
        const profileCtx = profile && profile.sector
            ? `\n\nFOUNDER CONTEXT (IMPORTANT):
You are talking to the founder of "${profile.startupName || 'a stealth startup'}". 
- Sector: ${profile.sector}
- Current Stage: ${profile.stage}
- Team Context: ${profile.teamBackground || 'Not specified'}
- Geography: ${profile.geography || 'India'}
- Revenue Status: ${profile.revenue || 'Pre-revenue'}
- USP/IP: ${profile.isResearchBased ? 'Research/IP-based' : 'Standard'}
Use this context to justify your advice. For example, if they are research-based, prioritize deep-tech grants.`
            : '\n\nNOTE: The founder has not completed their profile yet. Give generalized but high-quality strategic advice and encourage them to complete their profile for surgical precision.';

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
