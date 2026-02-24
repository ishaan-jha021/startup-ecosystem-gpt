'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { westernLineData } from '@/lib/data/western_line';

export default function DirectoryAdvisorBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your directory advisor. Ask me anything about these coworking spaces and incubators!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Include dataset context in system prompt seamlessly behind the scenes
            const contextText = westernLineData.map(item =>
                `- **${item.name}** (${item.broadType} ${item.type} in ${item.subRegion}, ${item.area}): Equity: ${item.equityTaken} (${item.equityCategory}), Ideal Stage: ${item.idealStage}, Fee: ${item.fee}, Funding: ${item.fundingGuarantee}, Contact: ${item.contactDetails}`
            ).join('\n');

            const res = await fetch('/api/directory-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: `You are a Local Directory AI Advisor. Your ONLY job is to answer questions using the exact directory listings below. DO NOT use outside knowledge. DO NOT hallucinate. Keep responses conversational, concise, and highly relevant. If they ask about a location, recommend spaces in that SPECIFIC location from the list. Use markdown to bold names.\n\nDIRECTORY DATA:\n${contextText}` },
                        ...messages.filter(m => m.role !== 'system'),
                        { role: 'user', content: userMessage }
                    ]
                })
            });

            if (!res.ok) throw new Error('API Error');

            const data = await res.json();

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* FAB (Floating Action Button) */}
            {!isOpen && (
                <div className="bot-fab-container">
                    <div className="bot-fab-ping"></div>
                    <button
                        className="bot-fab"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open Directory Advisor"
                    >
                        <MessageSquare size={24} />
                        <span className="bot-fab-tooltip">Ask the AI Advisor</span>
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bot-window">
                    <div className="bot-header">
                        <div className="bot-header-info">
                            <div className="bot-avatar"><Bot size={18} /></div>
                            <div>
                                <h3>Directory Advisor</h3>
                                <span>AI Assistant</span>
                            </div>
                        </div>
                        <button className="bot-close" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="bot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`bot-message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                                {msg.role === 'assistant' && <div className="bot-msg-icon"><Bot size={14} /></div>}
                                <div className="bot-msg-content" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                                {msg.role === 'user' && <div className="bot-msg-icon"><User size={14} /></div>}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bot-message assistant">
                                <div className="bot-msg-icon"><Bot size={14} /></div>
                                <div className="bot-msg-content typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="bot-input-area">
                        <input
                            type="text"
                            placeholder="Ask about spaces..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <style jsx>{`
                .bot-fab-container {
                    position: fixed;
                    bottom: var(--space-2xl);
                    right: var(--space-2xl);
                    width: 60px;
                    height: 60px;
                    z-index: 999;
                }
                .bot-fab-ping {
                    position: absolute;
                    inset: 0;
                    border-radius: var(--radius-full);
                    background-color: var(--brand);
                    opacity: 0.7;
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }
                .bot-fab {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: var(--radius-full);
                    background: var(--gray-900);
                    color: var(--white);
                    border: none;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    z-index: 2;
                }
                .bot-fab:hover {
                    transform: scale(1.05) translateY(-2px);
                    background: var(--brand);
                }
                .bot-fab-tooltip {
                    position: absolute;
                    right: 70px;
                    background: var(--gray-900);
                    color: white;
                    padding: 6px 12px;
                    border-radius: var(--radius-md);
                    font-size: var(--fs-xs);
                    font-weight: 500;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.2s;
                    transform: translateX(10px);
                }
                .bot-fab:hover .bot-fab-tooltip {
                    opacity: 1;
                    transform: translateX(0);
                }

                .bot-window {
                    position: fixed;
                    bottom: var(--space-2xl);
                    right: var(--space-2xl);
                    width: 360px;
                    height: 500px;
                    max-height: calc(100vh - 100px);
                    background: var(--white);
                    border-radius: var(--radius-xl);
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px var(--gray-200);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    overflow: hidden;
                    font-family: var(--font);
                }

                .bot-header {
                    padding: var(--space-md);
                    background: var(--gray-900);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .bot-header-info { display: flex; align-items: center; gap: 10px; }
                .bot-avatar { width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; }
                .bot-header h3 { font-size: var(--fs-sm); font-weight: 600; margin: 0; }
                .bot-header span { font-size: 11px; color: var(--gray-400); }
                .bot-close { background: none; border: none; color: var(--gray-400); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); transition: 0.2s; }
                .bot-close:hover { background: rgba(255,255,255,0.1); color: white; }

                .bot-messages {
                    flex: 1;
                    padding: var(--space-md);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    background: var(--gray-50);
                }
                .bot-message { display: flex; align-items: flex-end; gap: 8px; max-width: 85%; }
                .bot-message.user { align-self: flex-end; flex-direction: row; }
                .bot-message.assistant { align-self: flex-start; }
                
                .bot-msg-icon { width: 24px; height: 24px; border-radius: var(--radius-full); background: var(--gray-200); display: flex; align-items: center; justify-content: center; color: var(--gray-600); flex-shrink: 0; }
                .bot-message.user .bot-msg-icon { background: var(--gray-900); color: white; }
                
                .bot-msg-content {
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: var(--fs-sm);
                    line-height: 1.4;
                }
                .bot-message.user .bot-msg-content {
                    background: var(--gray-900);
                    color: white;
                    border-bottom-right-radius: 4px;
                }
                .bot-message.assistant .bot-msg-content {
                    background: white;
                    color: var(--gray-800);
                    border: 1px solid var(--gray-200);
                    border-bottom-left-radius: 4px;
                }

                .bot-input-area {
                    padding: var(--space-sm);
                    background: white;
                    border-top: 1px solid var(--gray-200);
                    display: flex;
                    gap: 8px;
                }
                .bot-input-area input {
                    flex: 1;
                    padding: 10px 14px;
                    border: 1px solid var(--gray-200);
                    border-radius: var(--radius-full);
                    font-size: var(--fs-sm);
                    outline: none;
                    transition: border-color 0.2s;
                }
                .bot-input-area input:focus { border-color: var(--brand); }
                .bot-input-area button {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-full);
                    background: var(--brand);
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .bot-input-area button:hover:not(:disabled) { background: var(--gray-900); }
                .bot-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Typing Indicator */
                .typing-indicator { display: flex; gap: 4px; padding: 14px 16px !important; align-items: center; }
                .typing-indicator span { width: 6px; height: 6px; background: var(--gray-400); border-radius: 50%; animation: typing 1.4s infinite ease-in-out both; }
                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

                @media (max-width: 640px) {
                    .bot-window {
                        width: calc(100vw - 32px);
                        right: 16px;
                        bottom: 85px;
                        height: 65vh;
                        max-height: calc(100dvh - 100px);
                    }
                    .bot-fab-container {
                        bottom: 16px;
                        right: 16px;
                    }
                    .bot-input-area input {
                        font-size: 16px; /* Prevents auto-zoom on iOS Safari */
                    }
                }
            `}</style>
        </>
    );
}
