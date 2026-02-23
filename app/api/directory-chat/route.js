import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.NVIDIA_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                reply: `⚠️ **AI Config Missing**: The \`NVIDIA_API_KEY\` is not set in environment variables.`
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s for Vercel Hobby

        try {
            const fetchResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "meta/llama-3.1-8b-instruct",
                    messages: messages,
                    max_tokens: 300,
                    temperature: 0.1,
                    top_p: 0.9
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const responseText = await fetchResponse.text();

            if (!fetchResponse.ok) {
                console.error('NVIDIA NIM Error Status:', fetchResponse.status);
                return NextResponse.json({
                    reply: `⚠️ **AI Call Failed (Status ${fetchResponse.status})**: Please try again later.`
                });
            }

            const data = JSON.parse(responseText);
            let reply = data.choices[0].message.content;

            // Basic markdown formatting for the bot UI
            reply = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            return NextResponse.json({ reply });

        } catch (e) {
            clearTimeout(timeoutId);
            if (e.name === 'AbortError') {
                return NextResponse.json({
                    reply: `⚠️ **AI Request Timed Out**: The model is taking too long to respond.`
                });
            }
            throw e;
        }

    } catch (error) {
        console.error('Fatal Directory Chat API error:', error);
        return NextResponse.json({
            reply: `⚠️ **Fatal API Error**: ${error.message || 'Unknown error during request.'}`
        });
    }
}
