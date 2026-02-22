import { NextResponse } from 'next/server';
import { grants } from '@/lib/data/grants';
import { incubators } from '@/lib/data/incubators';
import { investors } from '@/lib/data/investors';

function buildContext(filteredGrants, filteredIncubators, filteredInvestors) {
    const grantLines = filteredGrants.map(g => `- ${g.name}: ${g.funding}`).join('\n');
    const incLines = filteredIncubators.map(i => `- ${i.name} (${i.location}) | Equity: ${i.equity || 'N/A'} | Capacity: ${i.capacity || 'N/A'}`).join('\n');
    const invLines = filteredInvestors.map(i => `- ${i.name}: ${i.chequeSize}`).join('\n');

    return `You are SEGPT, the ultimate AI Mentor for Indian founders.

CORE RULES:
1. STRICT DATA ENFORCEMENT: ONLY use the resources listed below. If no resources match the specific location (e.g., Bandra, Borivali), DO NOT hallucinate. Instead, tell the user you are expanding the database.
2. ZERO HUBRIS: Do not recommend out-of-city resources (like Hyderabad hubs for Mumbai requests).

AVAILABLE RELEVANT RESOURCES:
${grantLines}
${incLines}
${invLines}

4-STEP MENTORSHIP FRAMEWORK:
1. **Identification**: Match the founder with specific resources from the list above.
2. **Equity Analysis**: Research/Explain their equity models (e.g., no equity vs % equity).
3. **Suitability**: Specifically evaluate which places are best for THIS founder's stage/sector.
4. **Selection Criteria**: Rationale for selection (e.g., seating capacity, conference provisions).`;
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
        const qLower = message.toLowerCase();

        const filterItems = (list) => {
            return list
                .map(item => {
                    let score = 0;
                    const itemLoc = (item.location || '').toLowerCase();
                    const itemName = (item.name || '').toLowerCase();
                    const itemSectors = (item.sectors || []).map(s => s.toLowerCase());
                    const westernLineKeywords = ['borivali', 'kandivali', 'malad', 'andheri', 'goregaon', 'vile parle', 'bandra'];

                    // Ultra Priority: Named Western Line keyword match
                    if (westernLineKeywords.some(kw => qLower.includes(kw) && (itemLoc.includes(kw) || itemName.includes(kw)))) {
                        score += 50;
                    }

                    // Priority 1: Exact location match (e.g. "Mumbai")
                    if (itemLoc && qLower.includes(itemLoc)) score += 10;
                    if ((qLower.includes('west line') || qLower.includes('western line')) && itemLoc.includes('mumbai')) score += 5;

                    // Priority 2: Sector match
                    if (itemSectors.some(s => userSectors.includes(s)) || itemSectors.includes('all sectors')) score += 3;

                    // Priority 3: Stage match
                    if (item.stage?.includes(userStage)) score += 1;

                    return { ...item, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 10); // Expanded slice to give LLM more local options to choose from
        };

        const filteredGrants = filterItems(grants);
        const filteredIncubators = filterItems(incubators);
        const filteredInvestors = filterItems(investors);

        const systemPrompt = buildContext(filteredGrants, filteredIncubators, filteredInvestors);
        const profileCtx = profile && profile.sector
            ? `\n\nCONTEXT: Startup "${profile.startupName || 'Stealth'}", ${profile.sector}, ${profile.stage}.`
            : '\n\nNOTE: Profile incomplete.';

        const chatHistory = (history || [])
            .filter(m => m.role !== 'system')
            .slice(-2) // Only last 2 messages to speed up processing
            .map(m => ({
                role: m.role,
                content: m.content
            }));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s for Vercel Hobby limit

        try {
            const fetchResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "meta/llama-3.1-8b-instruct", // Fast and reliable for 10s limits
                    messages: [
                        { role: "system", content: systemPrompt + profileCtx },
                        { role: "assistant", content: "Ready to help! I have access to the full Indian startup ecosystem database." },
                        ...chatHistory,
                        { role: "user", content: message }
                    ],
                    max_tokens: 300, // Short responses finish faster
                    temperature: 0.1, // Faster, more stable
                    top_p: 0.9
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const responseText = await fetchResponse.text();

            if (!fetchResponse.ok) {
                console.error('NVIDIA NIM Error Status:', fetchResponse.status);
                return NextResponse.json({
                    reply: `⚠️ **AI Call Failed (Status ${fetchResponse.status})**: ${responseText.slice(0, 200)} 
                    
                    ---
                    ${getFallbackReply(message, profile)}`
                });
            }

            const data = JSON.parse(responseText);
            const reply = data.choices[0].message.content;
            return NextResponse.json({ reply });

        } catch (e) {
            clearTimeout(timeoutId);
            if (e.name === 'AbortError') {
                return NextResponse.json({
                    reply: `⚠️ **AI Request Timed Out**: The model is taking too long to respond. 
                    
                    This often happens on Vercel's free tier. Please try a shorter question or check back in a moment.
                    
                    ---
                    ${getFallbackReply(message, profile)}`
                });
            }
            throw e;
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
