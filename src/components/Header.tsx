"use client";

import React from "react";
import { Compass, Dna, Sliders, Sparkles, Bookmark, Search, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  watchlistCount: number;
  onOpenCommand: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  onOpenCommand,
}) => {
  const tabs = [
    { id: "recommend", label: "Model Intelligence", icon: Compass },
    { id: "dna", label: "Genome Crosser", icon: Dna },
    { id: "vibe", label: "Atmosphere Radar", icon: Sliders },
    { id: "agent", label: "Editorial Concierge", icon: Sparkles },
    { id: "watchlist", label: `Vault (${watchlistCount})`, icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ececec] bg-paper-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between px-6 sm:px-10 lg:px-12">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("recommend")}
            className="flex items-center gap-2.5 text-ink-black text-left group"
          >
            <span className="font-editorial-serif text-[24px] tracking-tight text-ink-black">
              Cinephile <span className="italic font-light text-slate-gray">Steep</span>
            </span>
          </button>

          <span className="hidden lg:inline-flex items-center gap-2 rounded-full bg-mist-gray px-3 py-1 font-sans text-[13px] text-slate-gray">
            <span className="h-2 w-2 rounded-full bg-[#34c759]"></span>
            <span>4,809 Neural Vectors Online</span>
          </span>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-1.5 text-[15px] transition-all font-sans ${
                  isActive
                    ? "bg-ink-black text-paper-white"
                    : "text-slate-gray hover:text-ink-black hover:bg-mist-gray/80"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCommand}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-mist-gray/60 hover:bg-mist-gray px-3.5 py-1.5 text-[14px] text-slate-gray hover:text-ink-black transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded bg-paper-white px-1.5 py-0.5 text-[11px] font-sans border border-[#e4e4e7] text-slate-gray">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => setActiveTab("watchlist")}
            className="btn-pill-filled text-[14px] py-1.5 px-4 font-sans"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Vault ({watchlistCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#ececec] px-4 py-2 gap-2 no-scrollbar bg-fog-white">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1 text-[13px] ${
                isActive
                  ? "bg-ink-black text-paper-white"
                  : "text-slate-gray hover:text-ink-black"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
