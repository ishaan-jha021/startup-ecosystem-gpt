'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic } from 'lucide-react';

const SEARCH_PROMPTS = [
  "e.g. Incubators in Andheri West",
  "Find zero-equity accelerators in Mumbai...",
  "List private coworking spaces in South Mumbai...",
  "Government backed incubators in West Mumbai"
];

export default function AnimatedSearch() {
  const router = useRouter();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Stop the typewriter if the user focuses or types
    if (isFocused || userInput) return;

    let timer;
    const currentPrompt = SEARCH_PROMPTS[currentPromptIndex];

    const typeSpeed = isDeleting ? 30 : 60; // Deleting is faster
    const pauseDelay = 2000; // Pause at the end of a completed string

    if (!isDeleting && displayedText === currentPrompt) {
      // Completed typing the current string, wait before backspacing
      timer = setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && displayedText === "") {
      // Finished deleting, move to the next string
      setIsDeleting(false);
      setCurrentPromptIndex((prev) => (prev + 1) % SEARCH_PROMPTS.length);
      // Small pause before typing next string
      timer = setTimeout(() => { }, 500);
    } else {
      // Regular typing or deleting cycle
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentPrompt.substring(0, displayedText.length - 1)
          : currentPrompt.substring(0, displayedText.length + 1);
        setDisplayedText(nextText);
      }, typeSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPromptIndex, isFocused, userInput]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const query = userInput.trim() || displayedText;
    if (query) {
      router.push(`/advisor?q=${encodeURIComponent(query)}`);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Optimized for Indian ecosystem queries

    recognition.onstart = () => {
      setIsListening(true);
      setUserInput(""); // Clear input to show listening state cleanly
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      // Automatically trigger the search slightly after transcription
      setTimeout(() => {
        router.push(`/advisor?q=${encodeURIComponent(transcript)}`);
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };


  return (
    <form className="hero__search-mock" onSubmit={handleSubmit}>
      <Search size={20} className="text-muted" />
      <input
        type="text"
        placeholder={isFocused && !userInput ? (isListening ? "Listening..." : "") : displayedText}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Search or Ask AI Advisor"
      />
      <button
        type="button"
        onClick={startListening}
        className={`btn-icon mic-btn ${isListening ? 'listening' : ''}`}
        aria-label="Start Voice Search"
      >
        <Mic size={18} />
      </button>
      <button type="submit" className="btn btn-primary btn-icon">
        <Search size={18} />
      </button>

      <style jsx>{`
        .hero__search-mock {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-full);
          padding: 8px 8px 8px 24px;
          margin: 0 auto var(--space-xl);
          max-width: 600px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        
        .hero__search-mock:focus-within {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(255, 46, 99, 0.1);
        }

        .hero__search-mock input {
          flex: 1;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          background: transparent !important;
          font-size: var(--fs-base);
          color: var(--gray-900);
          outline: none !important;
          padding: 8px 0;
          min-width: 0; /* Prevents input overflow */
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          padding: 0;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .btn-primary {
           background: var(--brand);
           color: white;
        }

        .btn-primary:hover {
           background: var(--brand-dark);
        }

        .mic-btn {
          background: transparent;
          color: var(--gray-500);
        }

        .mic-btn:hover {
          background: var(--gray-100);
          color: var(--gray-900);
        }

        .mic-btn.listening {
          color: var(--brand);
          animation: pulse-mic 1.5s infinite;
        }

        @keyframes pulse-mic {
          0% { box-shadow: 0 0 0 0 rgba(255, 46, 99, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 46, 99, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 46, 99, 0); }
        }

        /* Typewriter cursor effect on placeholder */
        .hero__search-mock input:not(:focus):placeholder-shown {
           color: var(--gray-400);
           border-right: 2px solid var(--gray-400);
           animation: blink-caret 0.75s step-end infinite;
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: var(--gray-400); }
        }
      `}</style>
    </form>
  );
}
