"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Sparkles, Activity, Dna, Film, ArrowUpRight, ChevronDown, ChevronUp, X, Star } from "lucide-react";
import { MovieCard } from "../MovieCard";

interface NeuralEngineTabProps {
  onSendToDna: (title: string) => void;
  savedMovies: any[];
  onToggleSave: (movie: any) => void;
}

export const NeuralEngineTab: React.FC<NeuralEngineTabProps> = ({
  onSendToDna,
  savedMovies,
  onToggleSave,
}) => {
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("Inception");
  const [loading, setLoading] = useState(false);
  const [sourceMovie, setSourceMovie] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Presets
  const presets = [
    "Inception",
    "The Dark Knight",
    "Interstellar",
    "Pulp Fiction",
    "The Matrix",
    "Fight Club",
    "Whiplash",
    "Spirited Away",
  ];

  // Fetch all movies from database catalog on mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch("/api/catalog?limit=all");
        if (res.ok) {
          const data = await res.json();
          setCatalog(data.movies || []);
        }
      } catch (err) {
        console.error("Failed to load catalog:", err);
      }
    };
    fetchCatalog();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch recommendations
  const fetchRecs = async (title: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recommend?movie=${encodeURIComponent(title)}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setSourceMovie(data.sourceMovie);
        setRecommendations(data.recommendations);
        setSelectedTitle(title);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs(selectedTitle);
  }, []);

  // Filter catalog based on user typing
  const filteredMovies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return catalog;
    }
    return catalog.filter((m: any) =>
      m.title.toLowerCase().includes(q) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      (m.genres && m.genres.some((g: string) => g.toLowerCase().includes(q)))
    );
  }, [catalog, query]);

  const handleSelect = (title: string) => {
    setQuery("");
    setIsDropdownOpen(false);
    fetchRecs(title);
  };

  return (
    <div className="space-y-12 w-full">
      {/* Search & Preset Bar */}
      <div ref={searchContainerRef} className="relative z-30 space-y-4 w-full">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-gray">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={query}
            onClick={() => setIsDropdownOpen(true)}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Click to select from all 4,800+ movies, or type to filter..."
            className="w-full rounded-[16px] bg-paper-white py-4 pl-12 pr-44 text-[16px] text-ink-black placeholder:text-smoke-gray border border-[#e8e8ea] focus:border-ink-black focus:outline-none focus:ring-1 focus:ring-ink-black shadow-subtle transition-all cursor-text"
          />

          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full text-slate-gray hover:text-ink-black hover:bg-mist-gray transition-colors"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 font-sans text-[12px] font-medium text-slate-gray bg-mist-gray hover:bg-[#e4e4e7] px-3 py-1.5 rounded-full border border-[#ececec] transition-colors"
              title={isDropdownOpen ? "Close movie list" : "Browse all movies"}
            >
              <span>{catalog.length > 0 ? `${catalog.length.toLocaleString()} Titles` : "Catalog"}</span>
              {isDropdownOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown with all movies from DB (Select or Type) */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-16 z-40 overflow-hidden rounded-[20px] bg-paper-white border border-[#e8e8ea] shadow-subtle-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Header / Info bar */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-mist-gray/60 border-b border-[#e8e8ea] text-[12px] font-sans text-slate-gray">
              <span className="font-medium text-ink-black">
                {query.trim()
                  ? `Found ${filteredMovies.length.toLocaleString()} matches for "${query}"`
                  : `All Movies in Database (${catalog.length.toLocaleString()} titles)`}
              </span>
              <span>Click to select or type to filter</span>
            </div>

            {/* Scrollable movie list */}
            <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-[#f2f2f3]">
              {filteredMovies.length === 0 ? (
                <div className="py-8 px-4 text-center text-[14px] text-slate-gray">
                  No movies found matching &ldquo;{query}&rdquo;. Try another title or director.
                </div>
              ) : (
                filteredMovies.slice(0, 150).map((m: any) => {
                  const isCurrent = m.title.toLowerCase() === selectedTitle.toLowerCase();
                  return (
                    <button
                      key={m.id || m.title}
                      onClick={() => handleSelect(m.title)}
                      className={`flex w-full items-center justify-between px-5 py-3 text-left text-[14px] transition-colors ${
                        isCurrent
                          ? "bg-mist-gray text-ink-black font-semibold"
                          : "text-ink-black hover:bg-mist-gray/70"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <Film className="h-4 w-4 shrink-0 text-slate-gray" />
                        <div className="truncate">
                          <span className="font-medium text-ink-black">{m.title}</span>
                          {m.year && (
                            <span className="ml-2 text-[12px] text-slate-gray">({m.year})</span>
                          )}
                          {m.director && (
                            <span className="ml-2 text-[12px] text-slate-gray hidden sm:inline">
                              dir. {m.director}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {m.vote_average > 0 && (
                          <span className="flex items-center gap-1 font-sans text-[11px] font-medium text-slate-gray bg-mist-gray px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-[#eab308] text-[#eab308]" />
                            {m.vote_average.toFixed(1)}
                          </span>
                        )}
                        <div className="hidden md:flex gap-1.5">
                          {m.genres?.slice(0, 2).map((g: string) => (
                            <span
                              key={g}
                              className="rounded-full bg-mist-gray px-2 py-0.5 text-[11px] text-slate-gray"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}

              {filteredMovies.length > 150 && (
                <div className="py-2.5 px-4 text-center text-[12px] text-slate-gray bg-mist-gray/30 font-sans">
                  Showing first 150 of {filteredMovies.length.toLocaleString()} matching titles. Type to narrow results.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Presets Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[13px] text-slate-gray font-sans">Curated Seeds:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleSelect(preset)}
              className={`rounded-full px-3.5 py-1 text-[13px] font-sans transition-all ${
                selectedTitle === preset
                  ? "bg-ink-black text-paper-white shadow-sm"
                  : "bg-mist-gray text-slate-gray hover:text-ink-black hover:bg-[#e8e8ea]"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Source Movie Editorial Card */}
      {sourceMovie && (
        <div className="rounded-[24px] bg-fog-white p-6 sm:p-8 border border-[#e8e8ea] shadow-subtle relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            {/* Left Narrative Profile */}
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-mist-gray px-3 py-0.5 text-[12px] text-slate-gray font-sans">
                  Active Reference Point
                </span>
                <span className="rounded-full bg-blush-peach text-sienna-brown px-3 py-0.5 text-[12px] font-medium font-sans">
                  {sourceMovie.sentiment?.tone || "Editorial Cinematic Tone"}
                </span>
                <span className="text-[13px] text-slate-gray">
                  {sourceMovie.year} • {sourceMovie.runtime || 120} min • ⭐ {sourceMovie.vote_average}/10
                </span>
              </div>

              <h2 className="font-editorial-serif text-[36px] sm:text-[44px] font-normal tracking-tight text-ink-black leading-[1.15]">
                {sourceMovie.title}
              </h2>

              {sourceMovie.tagline && (
                <p className="italic font-editorial-serif text-[17px] text-slate-gray leading-relaxed">
                  "{sourceMovie.tagline}"
                </p>
              )}

              <p className="text-[15px] sm:text-[16px] text-ink-black/80 leading-relaxed">
                {sourceMovie.overview}
              </p>

              {/* Tags & Credits */}
              <div className="flex flex-wrap gap-2 pt-2">
                {sourceMovie.director && (
                  <span className="rounded-full bg-paper-white border border-[#ececec] px-3 py-1 text-[12px] text-ink-black font-medium">
                    Filmmaker: {sourceMovie.director}
                  </span>
                )}
                {sourceMovie.genres?.map((g: string) => (
                  <span
                    key={g}
                    className="rounded-full bg-mist-gray px-3 py-1 text-[12px] text-slate-gray"
                  >
                    {g}
                  </span>
                ))}
                {sourceMovie.cast?.slice(0, 3).map((c: string) => (
                  <span
                    key={c}
                    className="rounded-full bg-mist-gray/60 px-3 py-1 text-[12px] text-slate-gray"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Mood Vector Breakdown Card (Floating artifact) */}
            <div className="w-full lg:w-80 shrink-0 rounded-[20px] bg-paper-white p-5 border border-[#ececec] shadow-subtle space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2f2f3]">
                <span className="text-[13px] font-medium text-ink-black">Atmospheric Topology</span>
                <Activity className="h-4 w-4 text-sienna-brown" />
              </div>

              {sourceMovie.mood && (
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between text-slate-gray">
                    <span>Mind-Bending:</span>
                    <span className="font-medium text-ink-black">{sourceMovie.mood.mind_bending}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-mist-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink-black rounded-full"
                      style={{ width: `${sourceMovie.mood.mind_bending}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-gray">
                    <span>Visual Spectacle:</span>
                    <span className="font-medium text-ink-black">{sourceMovie.mood.spectacle}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-mist-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sienna-brown rounded-full"
                      style={{ width: `${sourceMovie.mood.spectacle}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-gray">
                    <span>Adrenaline:</span>
                    <span className="font-medium text-ink-black">{sourceMovie.mood.adrenaline}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-mist-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-gray rounded-full"
                      style={{ width: `${sourceMovie.mood.adrenaline}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-gray">
                    <span>Melancholy & Drama:</span>
                    <span className="font-medium text-ink-black">{sourceMovie.mood.melancholy}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-mist-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#979799] rounded-full"
                      style={{ width: `${sourceMovie.mood.melancholy}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => onSendToDna(sourceMovie.title)}
                className="mt-3 w-full btn-pill-ghost text-[13px] py-2 justify-center"
              >
                Send to Genome Crosser →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Output Grid — Spanning Full Screen Width */}
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ececec] pb-3">
          <div>
            <h3 className="font-editorial-serif text-[28px] sm:text-[32px] font-normal text-ink-black">
              Nearest Neighbor Selections
            </h3>
            <p className="text-[14px] text-slate-gray mt-0.5">
              Ranked by cosine similarity across 5,000 TF-IDF narrative vectors + XAI attribution
            </p>
          </div>

          <span className="text-[13px] text-slate-gray">
            {recommendations.length} Latent Recommendations
          </span>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-[24px] bg-fog-white border border-[#e8e8ea]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-mist-gray border-t-ink-black"></div>
              <span className="text-[14px] text-slate-gray">
                Synthesizing cosine vectors & attribution matrices...
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 w-full">
            {recommendations.map((rec) => (
              <MovieCard
                key={rec.id}
                movie={rec}
                onSelectMovie={handleSelect}
                onSendToDna={onSendToDna}
                isSaved={savedMovies.some((m) => m.id === rec.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
