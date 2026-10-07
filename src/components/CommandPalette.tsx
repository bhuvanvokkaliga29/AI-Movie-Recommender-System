"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Compass, Dna, Sliders, Sparkles, Film } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  onSelectMovie: (title: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectMovie,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/catalog?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.movies.slice(0, 6));
          }
        } catch {
          // ignore
        }
      }, 120);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-ink-black/25 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[24px] bg-paper-white border border-[#ececec] shadow-subtle-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="flex items-center px-5 border-b border-[#ececec]">
          <Search className="h-5 w-5 text-slate-gray shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands or 4,809 films..."
            className="w-full bg-transparent py-4 px-3 text-[16px] text-ink-black placeholder:text-smoke-gray focus:outline-none font-sans"
          />
          <button onClick={onClose} className="text-slate-gray hover:text-ink-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Navigation Commands */}
          <div>
            <span className="text-[12px] font-medium text-slate-gray uppercase px-3 py-1.5 block">
              Navigation
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigateTab("recommend");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[14px] text-ink-black hover:bg-mist-gray transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Compass className="h-4 w-4 text-sienna-brown" />
                  Jump to Model Intelligence
                </span>
                <kbd className="text-[11px] text-slate-gray bg-paper-white px-2 py-0.5 rounded border border-[#e4e4e7]">
                  Tab 1
                </kbd>
              </button>

              <button
                onClick={() => {
                  onNavigateTab("dna");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[14px] text-ink-black hover:bg-mist-gray transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Dna className="h-4 w-4 text-sienna-brown" />
                  Jump to Genome Crosser
                </span>
                <kbd className="text-[11px] text-slate-gray bg-paper-white px-2 py-0.5 rounded border border-[#e4e4e7]">
                  Tab 2
                </kbd>
              </button>

              <button
                onClick={() => {
                  onNavigateTab("vibe");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[14px] text-ink-black hover:bg-mist-gray transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Sliders className="h-4 w-4 text-sienna-brown" />
                  Jump to Atmosphere Radar
                </span>
                <kbd className="text-[11px] text-slate-gray bg-paper-white px-2 py-0.5 rounded border border-[#e4e4e7]">
                  Tab 3
                </kbd>
              </button>

              <button
                onClick={() => {
                  onNavigateTab("agent");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[14px] text-ink-black hover:bg-mist-gray transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-sienna-brown" />
                  Ask Editorial Concierge
                </span>
                <kbd className="text-[11px] text-slate-gray bg-paper-white px-2 py-0.5 rounded border border-[#e4e4e7]">
                  Tab 4
                </kbd>
              </button>
            </div>
          </div>

          {/* Search results */}
          {results.length > 0 && (
            <div>
              <span className="text-[12px] font-medium text-slate-gray uppercase px-3 py-1.5 block">
                Catalog Matches ({results.length})
              </span>
              <div className="space-y-1">
                {results.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectMovie(m.title);
                      onNavigateTab("recommend");
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-[14px] text-ink-black hover:bg-mist-gray transition-colors text-left"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Film className="h-4 w-4 text-slate-gray" />
                      {m.title}
                      <span className="text-[12px] text-slate-gray">({m.year})</span>
                    </span>
                    <span className="text-[12px] text-slate-gray">
                      ⭐ {m.vote_average}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#ececec] bg-fog-white text-[12px] text-slate-gray">
          <span>Click to jump</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
