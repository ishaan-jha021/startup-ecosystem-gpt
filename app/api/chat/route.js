import { NextResponse } from 'next/server';
import { grants } from '@/lib/data/grants';
import { incubators } from '@/lib/data/incubators';
import { investors } from '@/lib/data/investors';

function buildContext(filteredGrants, filteredIncubators, filteredInvestors) {
    // Build strings from ONLY the relevant items to save tokens and stay within rate limits
    const grantLines = filteredGrants.map(g => `- ${g.name}: ${g.funding}`).join('\n');
    const incLines = filteredIncubators.map(i => `- ${i.name} (${i.location})`).join('\n');
    const invLines = filteredInvestors.map(i => `- ${i.name}: ${i.chequeSize}`).join('\n');

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
        const apiKey = process.env.NVIDIA_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                reply: `⚠️ **AI Config Missing**: The \`NVIDIA_API_KEY\` is not set in environment variables. 
                
                ---
                ${getFallbackReply(message, profile)}`
            });
        }

        // --- OPTIMIZE CONTEXT BY FILTERING ---
        const userSectors = [
            profile?.sector || '',
            ...(profile?.interests || [])
        ].filter(Boolean).map(s => s.toLowerCase());
        const userStage = profile?.stage || 'Idea';

        const filterItems = (list) => {
            return list.filter(item => {
                const matchesSector = item.sectors?.some(s => userSectors.includes(s.toLowerCase())) || item.sectors?.includes('All Sectors');
                const matchesStage = item.stage?.includes(userStage);
                return matchesSector || matchesStage;
            }).slice(0, 10);
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
                role: m.role,
                content: m.content
            }));

        const fetchResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "zhipuai/glm-4-9b-chat",
                messages: [
                    { role: "system", content: systemPrompt + profileCtx },
                    { role: "assistant", content: "Ready to help! I have access to the full Indian startup ecosystem database." },
                    ...chatHistory,
                    { role: "user", content: message }
                ],
                max_tokens: 1024,
                temperature: 0.2,
                top_p: 0.7
            })
        });

        const responseText = await fetchResponse.text();

        if (!fetchResponse.ok) {
            console.error('NVIDIA NIM Error Status:', fetchResponse.status);
            console.error('NVIDIA NIM Error Body:', responseText);
            return NextResponse.json({
                reply: `⚠️ **AI Call Failed (Status ${fetchResponse.status})**: ${responseText.slice(0, 200)} 
                
                ---
                ${getFallbackReply(message, profile)}`
            });
        }

        try {
            const data = JSON.parse(responseText);
            const reply = data.choices[0].message.content;
            return NextResponse.json({ reply });
        } catch (e) {
            console.error('JSON Parse Error:', e);
            throw new Error(`Invalid JSON response from NVIDIA: ${responseText.slice(0, 100)}`);
        }

    } catch (error) {
        console.error('Fatal Chat API error:', error);
        return NextResponse.json({
            reply: `⚠️ **Fatal API Error**: ${error.message || 'Unknown error during request processing.'}
            
            Please check your console for details or verify the API key and model name.`,
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
