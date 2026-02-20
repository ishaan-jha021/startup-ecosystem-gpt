'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';

const SUGGESTIONS = [
  'Which grants am I eligible for right now?',
  'What should I do after building my MVP?',
  'Which incubator is best for my sector?',
  'Should I raise angel funding or bootstrap?',
  'How do I get DPIIT recognition?',
  'Which investors fund AgriTech startups?',
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Startup Ecosystem Advisor.\n\nI can help you find grants, incubators, accelerators, and investors matched to your startup.\n\nTry asking something like "Which grants am I eligible for?" or "Best incubators for FinTech startups."\n\nTip: Complete your profile at /onboarding for personalized results.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const profile = (() => { try { return JSON.parse(localStorage.getItem('segpt_profile') || '{}'); } catch { return {}; } })();

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please check your Gemini API key in .env.local and try again.' }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="advisor">
      <div className="advisor__layout">
        {/* Sidebar */}
        <aside className="advisor__side">
          <h2>AI Advisor</h2>
          <p className="text-sm text-muted">Ask anything about grants, incubators, investors, or your next steps.</p>
          <div className="advisor__suggestions">
            <h3>Suggestions</h3>
            {SUGGESTIONS.map((q, i) => (
              <button key={i} className="advisor__sug" onClick={() => send(q)}>
                <MessageSquare size={12} /> {q}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <div className="advisor__chat">
          <div className="advisor__messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg msg--${m.role}`}>
                <div className="msg__avatar">{m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}</div>
                <div className="msg__body">
                  {m.content.split('\n').map((line, j) => (
                    <p key={j} dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
                        .replace(/^- (.*)$/, '• $1')
                    }} />
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg msg--assistant">
                <div className="msg__avatar"><Bot size={16} /></div>
                <div className="msg__body"><p className="msg__loading"><Loader2 size={14} className="spin" /> Thinking...</p></div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="advisor__input-area">
            <div className="advisor__input-wrap">
              <textarea ref={inputRef} placeholder="Ask a question..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} rows={1} />
              <button className="advisor__send" onClick={() => send()} disabled={!input.trim() || loading}>
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-muted text-center mt-sm">AI is for guidance only. Verify with official sources.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .advisor { height: calc(100vh - 56px); }
        .advisor__layout { display: grid; grid-template-columns: 280px 1fr; height: 100%; }

        .advisor__side {
          padding: var(--space-xl);
          border-right: 1px solid var(--gray-200);
          overflow-y: auto;
          background: var(--gray-50);
        }
        .advisor__side h2 { font-size: var(--fs-lg); margin-bottom: var(--space-sm); }
        .advisor__suggestions { margin-top: var(--space-2xl); }
        .advisor__suggestions h3 { font-size: var(--fs-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-400); margin-bottom: var(--space-md); }
        .advisor__sug {
          display: flex; align-items: flex-start; gap: var(--space-sm); width: 100%; text-align: left;
          padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md);
          font-size: var(--fs-xs); color: var(--gray-600); cursor: pointer;
          background: none; border: none; font-family: var(--font); margin-bottom: 2px;
          transition: background var(--transition-fast); line-height: 1.5;
        }
        .advisor__sug:hover { background: var(--white); color: var(--gray-900); }

        .advisor__chat { display: flex; flex-direction: column; height: 100%; }
        .advisor__messages { flex: 1; overflow-y: auto; padding: var(--space-xl); }

        .msg { display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); }
        .msg__avatar {
          flex-shrink: 0; width: 32px; height: 32px; border-radius: var(--radius-full);
          display: flex; align-items: center; justify-content: center;
          background: var(--gray-100); color: var(--gray-500);
        }
        .msg--assistant .msg__avatar { background: var(--brand-bg); color: var(--brand); }
        .msg__body { flex: 1; max-width: 640px; }
        .msg__body p { font-size: var(--fs-sm); line-height: var(--lh-relaxed); color: var(--gray-800); margin-bottom: 4px; }
        .msg__body :global(a) { color: var(--brand); }
        .msg__body :global(strong) { font-weight: 600; }
        .msg__loading { display: flex; align-items: center; gap: var(--space-sm); color: var(--gray-400); }
        :global(.spin) { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .advisor__input-area { border-top: 1px solid var(--gray-200); padding: var(--space-lg) var(--space-xl); background: var(--white); }
        .advisor__input-wrap {
          display: flex; align-items: center; gap: var(--space-sm);
          border: 1px solid var(--gray-300); border-radius: var(--radius-lg); padding: var(--space-sm) var(--space-md);
          transition: border-color var(--transition-fast);
        }
        .advisor__input-wrap:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
        .advisor__input-wrap textarea {
          flex: 1; border: none; resize: none; outline: none;
          font-family: var(--font); font-size: var(--fs-sm); color: var(--gray-900);
          min-height: 20px; max-height: 100px; background: none;
        }
        .advisor__send {
          width: 36px; height: 36px; border-radius: var(--radius-md);
          background: var(--brand); color: white; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: background var(--transition-fast); border: none;
        }
        .advisor__send:hover:not(:disabled) { background: var(--brand-dark); }
        .advisor__send:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 640px) {
          .advisor__layout { grid-template-columns: 1fr; }
          .advisor__side { display: none; }
        }
      `}</style>
    </div>
  );
}
