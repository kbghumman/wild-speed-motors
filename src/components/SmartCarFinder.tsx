"use client";

import Link from "next/link";
import { Mic, MicOff, Search, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/client";

type SpeechResultEvent = {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
    };
  };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const examples = [
  "7 seats under $5,000",
  "automatic SUV under $10k for snow",
  "fuel-efficient family car with CarPlay",
  "sporty manual under $15,000",
];

export default function SmartCarFinder({
  initialQuery = "",
  compact = false,
}: {
  initialQuery?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const speechWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    setSpeechSupported(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));

    return () => recognitionRef.current?.stop();
  }, []);

  function startVoice() {
    const speechWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    const Constructor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Constructor) return;

    const recognition = new Constructor();
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setQuery(transcript);
        trackEvent("voice_search_completed", { query: transcript });
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setListening(true);
    trackEvent("voice_search_started");
    recognition.start();
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <div className={compact ? "smart-finder smart-finder-compact" : "smart-finder"}>
      {!compact && (
        <div className="smart-finder-intro">
          <span className="smart-finder-icon"><Sparkles size={18} /></span>
          <div>
            <span className="v3-mono">SMART CAR FINDER</span>
            <strong>Describe the car you need.</strong>
            <p>
              Search the cars that are actually live now. If nothing matches exactly,
              we show the closest available alternatives instead of fake catalogue results.
            </p>
          </div>
        </div>
      )}

      <form action="/cars" method="get" className="smart-finder-form" onSubmit={() => trackEvent("smart_search_submit", { query: query.trim(), input_method: listening ? "voice" : "text" })}>
        <div className="smart-finder-input">
          <input
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Try “I need a 7-seat automatic under $5,000”'
            aria-label="Describe the car you want"
          />
          <button
            type="button"
            className={listening ? "smart-mic listening" : "smart-mic"}
            onClick={listening ? stopVoice : startVoice}
            disabled={!speechSupported}
            title={
              speechSupported
                ? listening
                  ? "Stop listening"
                  : "Speak your request"
                : "Voice search is not supported in this browser"
            }
            aria-label={listening ? "Stop voice input" : "Start voice input"}
          >
            {listening ? <MicOff size={19} /> : <Mic size={19} />}
          </button>
        </div>

        <button type="submit" className="smart-finder-submit" disabled={!query.trim()}>
          <Search size={18} />
          Find my cars
        </button>
      </form>

      {!compact && (
        <div className="smart-finder-examples">
          <span>Try:</span>
          {examples.map((example) => (
            <Link key={example} href={"/cars?q=" + encodeURIComponent(example)}>
              {example}
            </Link>
          ))}
        </div>
      )}

      {listening && <div className="smart-listening">Listening… say what you need.</div>}
    </div>
  );
}
