'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Bot, User, MessageSquare } from 'lucide-react';

const DEFAULT_SUGGESTIONS = [
  'Which grants am I eligible for right now?',
  'What should I do after building my MVP?',
  'Which incubator is best for my sector?',
  'Should I raise angel funding or bootstrap?',
  'How do I get DPIIT recognition?',
  'Which investors fund AgriTech startups?',
];

function AnimatedMessage({ content }) {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.slice(0, i));
      i++;
      if (i > content.length) clearInterval(interval);
    }, 15); // Speed of typing
    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="msg__content"
      dangerouslySetInnerHTML={{
        __html: displayedContent
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
          .replace(/^- (.*)$/gm, '• $1')
          .replace(/\n/g, '<br/>')
      }}
    />
  );
}

function ChatClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q');

  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      let profile = null;
      try {
        const stored = localStorage.getItem('segpt_profile');
        if (stored) profile = JSON.parse(stored);
      } catch { }

      // Personalize UI if profile exists
      if (profile && profile.sector && profile.stage) {
        const nameGreeting = profile.startupName ? `Hi ${profile.startupName} team!` : 'Hi there!';
        setMessages([{
          role: 'assistant',
          content: `${nameGreeting}\n\nI see you are building a **${profile.sector}** startup at the **${profile.stage}** stage.\n\nI have ranked all grants, incubators, and investors based on your profile. Ask me anything, like "Which ${profile.sector} incubators should we apply to?" or "What are the best grants for our stage?"`
        }]);

        setSuggestions([
          `Top grants for ${profile.sector} startups`,
          `Best incubators for the ${profile.stage} stage`,
          `Which VCs fund ${profile.sector}?`,
          `How to get DPIIT recognition?`,
          `State government policies for ${profile.geography || 'startups'}`,
        ]);
      } else {
        setMessages([{
          role: 'assistant',
          content: 'Hi! I\'m your Startup Ecosystem Advisor.\n\nI can help you find grants, incubators, accelerators, and investors matched to your startup.\n\nTry asking something like "Which grants am I eligible for?" or "Best incubators for FinTech startups."\n\nTip: Complete your profile by clicking **Build Profile** for personalized results.'
        }]);
      }

      if (q) {
        send(q, true);
        router.replace('/advisor', undefined, { shallow: true });
      }
    }
  }, [q, router]);

  const send = async (text, initial = false) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    let profile = {};
    try {
      profile = JSON.parse(localStorage.getItem('segpt_profile') || '{}');
    } catch { }

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    if (!initial) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, profile, history: messages.slice(-10) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please check your network connection and try again.' }]);
    }

    setLoading(false);
    if (!initial) inputRef.current?.focus();
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="advisor__layout">
      {/* Sidebar */}
      <aside className="advisor__side">
        <h2>AI Advisor</h2>
        <p className="text-sm text-muted">Ask anything about grants, incubators, investors, or your next steps.</p>
        <div className="advisor__suggestions">
          <h3>Suggestions</h3>
          {suggestions.map((sug, i) => (
            <button key={i} className="advisor__sug" onClick={() => send(sug)}>
              <MessageSquare size={12} /> {sug}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <div className="advisor__chat">
        <div className="advisor__messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg msg--${m.role}`}>
              {m.role === 'assistant' && (
                <div className="msg__avatar ai-avatar"><Bot size={16} /></div>
              )}

              <div className="msg__bubble">
                {m.role === 'assistant' && i === messages.length - 1 && i !== 0 ? (
                  <AnimatedMessage content={m.content} />
                ) : (
                  <div className="msg__content" dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
                      .replace(/^- (.*)$/gm, '• $1')
                      .replace(/\n/g, '<br/>')
                  }} />
                )}
              </div>

              {m.role === 'user' && (
                <div className="msg__avatar user-avatar"><User size={16} /></div>
              )}
            </div>
          ))}

          {loading && (
            <div className="msg msg--assistant">
              <div className="msg__avatar ai-avatar"><Bot size={16} /></div>
              <div className="msg__bubble msg__bubble--loading">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="advisor__input-area">
          <div className="advisor__input-wrap">
            <textarea
              ref={inputRef}
              placeholder="Message your AI Advisor..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
            />
            <button className="advisor__send" onClick={() => send()} disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-muted text-center mt-sm disclaimer">AI generated responses. Please verify official listings before applying.</p>
        </div>
      </div>
    </div>
  );
}

export default function AdvisorPage() {
  return (
    <div className="advisor">
      <Suspense fallback={<div className="p-xl center"><div className="typing-indicator"><span></span><span></span><span></span></div></div>}>
        <ChatClient />
      </Suspense>

      <style jsx global>{`
        body { overflow: hidden; } /* Lock scroll for the whole page */
        footer { display: none !important; } /* Hide the global footer here */
        
        .advisor { height: calc(100vh - 65px); background: #fbfbfb; }
        .advisor__layout { display: grid; grid-template-columns: 280px 1fr; height: 100%; max-width: 1440px; margin: 0 auto; background: var(--white); box-shadow: 0 0 40px rgba(0,0,0,0.02); overflow: hidden; }

        .advisor__side {
          padding: var(--space-xl);
          border-right: 1px solid var(--gray-100);
          overflow-y: auto;
          background: #fafafa;
        }
        .advisor__side h2 { font-size: var(--fs-lg); margin-bottom: var(--space-sm); color: var(--gray-900); }
        .advisor__suggestions { margin-top: var(--space-2xl); }
        .advisor__suggestions h3 { font-size: var(--fs-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-400); margin-bottom: var(--space-md); }
        .advisor__sug {
          display: flex; align-items: flex-start; gap: var(--space-sm); width: 100%; text-align: left;
          padding: 10px 12px; border-radius: var(--radius-md);
          font-size: var(--fs-xs); color: var(--gray-600); cursor: pointer;
          background: var(--white); border: 1px solid var(--gray-200); font-family: var(--font); margin-bottom: 8px;
          transition: all var(--transition-fast); line-height: 1.4;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .advisor__sug:hover { border-color: var(--brand); color: var(--brand); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.04); }

        .advisor__chat { display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; min-height: 0; }
        .advisor__messages { flex: 1; overflow-y: auto; padding: var(--space-2xl) var(--space-xl); display: flex; flex-direction: column; gap: var(--space-xl); scroll-behavior: smooth; }

        .msg { display: flex; align-items: flex-end; gap: var(--space-sm); max-width: 800px; margin: 0 auto; width: 100%; }
        .msg--user { justify-content: flex-end; }
        
        .msg__avatar {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: var(--radius-full);
          display: flex; align-items: center; justify-content: center;
        }
        .ai-avatar { background: var(--gray-900); color: var(--white); }
        .user-avatar { background: var(--gray-200); color: var(--gray-600); }

        .msg__bubble {
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.6;
          max-width: 85%;
          position: relative;
        }

        .msg--user .msg__bubble {
          background: var(--brand);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .msg--assistant .msg__bubble {
          background: var(--white);
          color: var(--gray-800);
          border: 1px solid var(--gray-200);
          border-bottom-left-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .msg__content strong { font-weight: 600; color: inherit; }
        .msg--assistant .msg__content strong { color: var(--gray-900); }
        .msg--user .msg__content a { color: white; text-decoration: underline; }
        .msg--assistant .msg__content a { color: var(--brand); text-decoration: underline; }
        
        .msg__bubble--loading { padding: 16px 20px; }

        /* Typing Indicator */
        .typing-indicator { display: flex; align-items: center; gap: 4px; height: 14px;}
        .typing-indicator span {
          display: block; width: 6px; height: 6px; background-color: var(--gray-400); border-radius: 50%;
          animation: typings 1.4s infinite ease-in-out both;
        }
        .typing-indicator transform { opacity: 0.4; transform: scale(0.8); }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typings {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }

        .advisor__input-area { 
          padding: var(--space-lg) var(--space-xl); 
          background: var(--white);
          border-top: 1px solid var(--gray-100);
        }
        
        .advisor__input-wrap {
          display: flex; align-items: flex-end; gap: var(--space-sm);
          background: var(--white); border: 1px solid var(--gray-300); 
          border-radius: var(--radius-xl); padding: 8px 8px 8px 16px;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          max-width: 800px; margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .advisor__input-wrap:focus-within { border-color: var(--brand); box-shadow: 0 0 0 4px rgba(255, 46, 99, 0.1); }
        
        .advisor__input-wrap textarea {
          flex: 1; border: none; resize: none; outline: none;
          font-family: var(--font); font-size: 15px; color: var(--gray-900);
          min-height: 24px; max-height: 150px; background: transparent;
          padding: 8px 0;
        }
        
        .advisor__send {
          width: 40px; height: 40px; border-radius: var(--radius-full);
          background: var(--gray-900); color: white; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all var(--transition-fast); border: none;
        }
        .advisor__send:hover:not(:disabled) { background: var(--brand); transform: scale(1.05); }
        .advisor__send:disabled { background: var(--gray-200); color: var(--gray-400); cursor: not-allowed; transform: none; }

        .disclaimer { margin-top: 12px; }

        @media (max-width: 768px) {
          .advisor__layout { grid-template-columns: 1fr; }
          .advisor__side { display: none; }
          .advisor__messages { padding: var(--space-lg) var(--space-md); }
          .advisor__input-area { padding: var(--space-md); }
        }

        @media (max-width: 640px) {
          .advisor { height: calc(100dvh - 65px - 85px); }
        }
      `}</style>
    </div>
  );
}
