"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { NeuralEngineTab } from "@/components/tabs/NeuralEngineTab";
import { DnaCrosserTab } from "@/components/tabs/DnaCrosserTab";
import { VibeRadarTab } from "@/components/tabs/VibeRadarTab";
import { AiConciergeTab } from "@/components/tabs/AiConciergeTab";
import { WatchlistTab } from "@/components/tabs/WatchlistTab";
import { CommandPalette } from "@/components/CommandPalette";
import { ArrowRight, Sparkles, Activity, Layers, BarChart3, Database } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("recommend");
  const [commandOpen, setCommandOpen] = useState(false);
  const [dnaMovies, setDnaMovies] = useState<string[]>([
    "Interstellar",
    "The Grand Budapest Hotel",
  ]);
  const [savedMovies, setSavedMovies] = useState<any[]>([]);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cinephile_watchlist");
      if (stored) {
        setSavedMovies(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleSave = (movie: any) => {
    setSavedMovies((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      let updated;
      if (exists) {
        updated = prev.filter((m) => m.id !== movie.id);
      } else {
        updated = [...prev, movie];
      }
      try {
        localStorage.setItem("cinephile_watchlist", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearWatchlist = () => {
    setSavedMovies([]);
    try {
      localStorage.removeItem("cinephile_watchlist");
    } catch {
      // ignore
    }
  };

  const handleSendToDna = (title: string) => {
    if (!dnaMovies.includes(title)) {
      setDnaMovies((prev) => [...prev.slice(-2), title]);
    }
    setActiveTab("dna");
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-paper-white text-ink-black flex flex-col justify-between w-full">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={savedMovies.length}
        onOpenCommand={() => setCommandOpen(true)}
      />

      {/* Main Full-Screen Fluid Container */}
      <main className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-12 pt-8 sm:pt-14 pb-28 flex-1">
        {/* Steep Editorial Hero Collage */}
        <section className="mb-14 sm:mb-20 space-y-8 w-full">
          {/* Typographic Category Tag */}
          <div className="flex items-center gap-2 text-[14px] text-ash-gray font-sans">
            <span>Machine Intelligence</span>
            <span>/</span>
            <span>Cinematic Topology</span>
            <span>/</span>
            <span className="text-sienna-brown font-medium">Model Engine 2.4</span>
          </div>

          {/* Editorial Display Headline with Italicized Signature Phrase */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div className="max-w-4xl space-y-4">
              <h1 className="font-editorial-serif text-[42px] sm:text-[60px] lg:text-[76px] xl:text-[84px] font-normal tracking-[-0.025em] text-ink-black leading-[1.08]">
                Cinematic analytics, <span className="italic font-light">rendered as editorial</span>.
              </h1>
              <p className="text-[17px] sm:text-[19px] text-slate-gray font-sans font-normal leading-relaxed max-w-2xl">
                Continuous latent embeddings across 4,809 films. Multi-dimensional cosine similarity, genetic genome blending, and atmosphere topology on warm paper.
              </p>
            </div>

            {/* Steep Matched Pill Buttons (Filled + Ghost Pair) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setActiveTab("agent");
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="btn-pill-filled text-[15px] shadow-sm font-sans"
              >
                <Sparkles className="h-4 w-4" />
                <span>Inquire with Concierge</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("dna");
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="btn-pill-ghost text-[15px] font-sans"
              >
                <span>Explore Genome Crosser →</span>
              </button>
            </div>
          </div>

          {/* Floating Product UI Artifact Row — Steep Signature */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 font-sans w-full">
            <div className="rounded-[20px] bg-paper-white p-4 sm:p-5 border border-[#ececec] shadow-subtle hover:shadow-subtle-2 transition-all">
              <div className="flex items-center justify-between text-slate-gray text-[13px] mb-1">
                <span>Latent Space</span>
                <Database className="h-4 w-4 text-slate-gray" />
              </div>
              <p className="text-[24px] sm:text-[28px] font-medium text-ink-black">4,809</p>
              <p className="text-[13px] text-slate-gray mt-0.5">Embedded film vectors</p>
            </div>

            <div className="rounded-[20px] bg-paper-white p-4 sm:p-5 border border-[#ececec] shadow-subtle hover:shadow-subtle-2 transition-all">
              <div className="flex items-center justify-between text-slate-gray text-[13px] mb-1">
                <span>Dimensionality</span>
                <Layers className="h-4 w-4 text-sienna-brown" />
              </div>
              <p className="text-[24px] sm:text-[28px] font-medium text-ink-black">5,000 D</p>
              <p className="text-[13px] text-slate-gray mt-0.5">TF-IDF feature coordinates</p>
            </div>

            <div className="rounded-[20px] bg-paper-white p-4 sm:p-5 border border-[#ececec] shadow-subtle hover:shadow-subtle-2 transition-all">
              <div className="flex items-center justify-between text-slate-gray text-[13px] mb-1">
                <span>Inference Velocity</span>
                <Activity className="h-4 w-4 text-[#34c759]" />
              </div>
              <p className="text-[24px] sm:text-[28px] font-medium text-ink-black">&lt; 15 ms</p>
              <p className="text-[13px] text-slate-gray mt-0.5">Vector similarity compute</p>
            </div>

            {/* Accent Peach Artifact */}
            <div className="rounded-[20px] bg-blush-peach p-4 sm:p-5 border border-[#f5cdb7] text-sienna-brown shadow-subtle hover:shadow-subtle-2 transition-all">
              <div className="flex items-center justify-between text-[13px] mb-1 font-medium text-sienna-brown/80">
                <span>Attribution Engine</span>
                <BarChart3 className="h-4 w-4 text-sienna-brown" />
              </div>
              <p className="text-[24px] sm:text-[28px] font-medium text-sienna-brown">XAI 100%</p>
              <p className="text-[13px] text-sienna-brown/80 mt-0.5">Mathematical explanations</p>
            </div>
          </div>
        </section>

        {/* Tab Interactive Views — Full Screen Width */}
        <section className="relative w-full">
          {activeTab === "recommend" && (
            <NeuralEngineTab
              onSendToDna={handleSendToDna}
              savedMovies={savedMovies}
              onToggleSave={handleToggleSave}
            />
          )}

          {activeTab === "dna" && (
            <DnaCrosserTab
              dnaMovies={dnaMovies}
              setDnaMovies={setDnaMovies}
              savedMovies={savedMovies}
              onToggleSave={handleToggleSave}
            />
          )}

          {activeTab === "vibe" && (
            <VibeRadarTab
              savedMovies={savedMovies}
              onToggleSave={handleToggleSave}
              onSendToDna={handleSendToDna}
            />
          )}

          {activeTab === "agent" && (
            <AiConciergeTab
              savedMovies={savedMovies}
              onToggleSave={handleToggleSave}
              onSendToDna={handleSendToDna}
            />
          )}

          {activeTab === "watchlist" && (
            <WatchlistTab
              savedMovies={savedMovies}
              onToggleSave={handleToggleSave}
              onClearWatchlist={handleClearWatchlist}
              onSendToDna={handleSendToDna}
            />
          )}
        </section>
      </main>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSelectMovie={(title) => {
          setActiveTab("recommend");
        }}
      />

      {/* Steep Editorial Footer */}
      <footer className="border-t border-[#ececec] bg-fog-white py-12 w-full">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 lg:px-12 text-[14px] text-slate-gray font-sans">
          <div className="flex items-center gap-3">
            <span className="font-editorial-serif text-[18px] text-ink-black font-normal">Cinephile Steep</span>
            <span>—</span>
            <span>Architecture by Bhuvan Gowda H K</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/bhuvanvokkaliga29/AI-Movie-Recommender-System"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-black hover:underline"
            >
              GitHub Source
            </a>
            <span>•</span>
            <span>Optimized for Vercel Edge</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
