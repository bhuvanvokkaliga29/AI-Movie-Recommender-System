"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Bot, User } from "lucide-react";
import { MovieCard } from "../MovieCard";

interface AiConciergeTabProps {
  savedMovies: any[];
  onToggleSave: (movie: any) => void;
  onSendToDna: (title: string) => void;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  recommendations?: any[];
}

export const AiConciergeTab: React.FC<AiConciergeTabProps> = ({
  savedMovies,
  onToggleSave,
  onSendToDna,
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Greetings. I am your editorial cinema concierge. Express any subtle aesthetic, philosophical longing, or obscure narrative intersection in natural prose, and I will parse your query vector against our 4,809 latent film embeddings.",
    },
  ]);

  const promptSuggestions = [
    "Cyberpunk neo-noir with slow burn philosophical dread and analog synth soundscapes",
    "Mind-bending time travel with tragic emotional stakes and non-linear memory",
    "Grit and adrenaline heist where every calculated scheme collapses in real time",
    "Quiet atmospheric mystery set in fog-drenched coastal isolation",
  ];

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMsg = messageText.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.reply,
            recommendations: data.recommendations,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "The editorial model was momentarily interrupted. Please rephrase your query.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Network link unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 w-full">
      {/* Editorial Header */}
      <div className="space-y-3">
        <h2 className="font-editorial-serif text-[36px] sm:text-[44px] font-normal text-ink-black tracking-tight leading-[1.2]">
          Editorial Concierge <span className="italic font-light text-slate-gray">— natural language inquiry</span>
        </h2>
        <p className="text-[16px] text-slate-gray max-w-3xl leading-relaxed">
          Powered by open semantic intent extraction and vector clustering. Inquire freely in human sentences without rigid categorical filters.
        </p>
      </div>

      {/* Suggested Inquiries */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-slate-gray font-sans">Sample Inquiries:</span>
        {promptSuggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="rounded-full bg-mist-gray px-4 py-1.5 text-[13px] text-slate-gray hover:text-ink-black hover:bg-[#e4e4e7] transition-colors text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Conversation Card */}
      <div className="rounded-[24px] bg-fog-white border border-[#e8e8ea] shadow-subtle p-6 sm:p-8 space-y-8 min-h-[460px] flex flex-col justify-between w-full">
        <div className="space-y-6 overflow-y-auto max-h-[640px] pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-white border border-[#ececec] text-sienna-brown shadow-sm font-editorial-serif text-[17px]">
                  C
                </div>
              )}

              <div
                className={`max-w-3xl rounded-[20px] p-5 text-[15px] leading-relaxed font-sans ${
                  msg.role === "user"
                    ? "bg-ink-black text-paper-white shadow-sm"
                    : "bg-paper-white border border-[#ececec] text-ink-black shadow-subtle"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Embedded Recommendations in Assistant Reply */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-[#ececec]">
                    <span className="text-[12px] uppercase tracking-wider font-medium text-slate-gray block mb-4">
                      Identified Coordinates:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {msg.recommendations.map((rec) => (
                        <MovieCard
                          key={rec.id}
                          movie={rec}
                          onSendToDna={onSendToDna}
                          isSaved={savedMovies.some((m) => m.id === rec.id)}
                          onToggleSave={onToggleSave}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-gray text-ink-black font-medium text-[13px]">
                  You
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-white border border-[#ececec] text-sienna-brown shadow-sm font-editorial-serif text-[17px]">
                C
              </div>
              <div className="rounded-[20px] bg-paper-white border border-[#ececec] p-4 text-[14px] text-slate-gray flex items-center gap-3 shadow-subtle">
                <span className="h-2 w-2 rounded-full bg-sienna-brown animate-ping" />
                <span>Scanning 4,809 dimensional coordinates & auteur graphs...</span>
              </div>
            </div>
          )}
        </div>

        {/* Steep Composer Input Field */}
        <div className="pt-4 border-t border-[#ececec]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 rounded-[16px] bg-paper-white border border-[#e4e4e7] p-2 pr-3 shadow-subtle focus-within:border-ink-black focus-within:ring-1 focus-within:ring-ink-black transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: 'Find me movies like The Prestige with dual protagonists and tragic rivalry'..."
              className="flex-1 bg-transparent py-2.5 px-3 text-[15px] text-ink-black placeholder:text-smoke-gray outline-none font-sans"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-black text-paper-white hover:opacity-90 disabled:opacity-30 transition-all shadow-sm"
              title="Submit inquiry"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
