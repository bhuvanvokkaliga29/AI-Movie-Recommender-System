"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Dna, Plus, X, Sparkles, Film, ChevronDown, ChevronUp } from "lucide-react";
import { MovieCard } from "../MovieCard";

interface DnaCrosserTabProps {
  dnaMovies: string[];
  setDnaMovies: React.Dispatch<React.SetStateAction<string[]>>;
  savedMovies: any[];
  onToggleSave: (movie: any) => void;
}

export const DnaCrosserTab: React.FC<DnaCrosserTabProps> = ({
  dnaMovies,
  setDnaMovies,
  savedMovies,
  onToggleSave,
}) => {
  const [movieInput, setMovieInput] = useState("");
  const [catalog, setCatalog] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hybridData, setHybridData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMovies = useMemo(() => {
    const q = movieInput.trim().toLowerCase();
    const available = catalog.filter(m => !dnaMovies.includes(m.title));
    if (!q) return available;
    return available.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.director && m.director.toLowerCase().includes(q))
    );
  }, [catalog, movieInput, dnaMovies]);

  const addMovie = (name: string) => {
    if (name.trim() && !dnaMovies.includes(name.trim()) && dnaMovies.length < 3) {
      setDnaMovies([...dnaMovies, name.trim()]);
      setMovieInput("");
      setIsDropdownOpen(false);
    }
  };

  const removeMovie = (index: number) => {
    setDnaMovies(dnaMovies.filter((_, i) => i !== index));
  };

  const handleSynthesize = async () => {
    if (dnaMovies.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch("/api/dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movies: dnaMovies, limit: 12 }),
      });
      if (res.ok) {
        const data = await res.json();
        setHybridData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const presetPairs = [
    ["Interstellar", "The Grand Budapest Hotel"],
    ["The Dark Knight", "Blade Runner"],
    ["Inception", "Pulp Fiction"],
    ["The Matrix", "Fight Club"],
  ];

  return (
    <div className="space-y-12 w-full">
      {/* Editorial Header */}
      <div className="space-y-3">
        <h2 className="font-editorial-serif text-[36px] sm:text-[44px] font-normal text-ink-black tracking-tight leading-[1.2]">
          Genome Crosser <span className="italic font-light text-slate-gray">— cinematic hybridization</span>
        </h2>
        <p className="text-[16px] text-slate-gray max-w-3xl leading-relaxed">
          Blend 2 or 3 distinct films into a singular continuous latent embedding. The engine calculates the mathematical barycenter of their narrative vectors, thematic tags, and mood signatures to surface the offspring of those cinematic universes.
        </p>
      </div>

      {/* Crosser Studio Card */}
      <div className="rounded-[24px] bg-fog-white p-6 sm:p-8 border border-[#e8e8ea] shadow-subtle space-y-6 w-full">
        <div>
          <label className="text-[13px] font-medium text-slate-gray uppercase tracking-wider block mb-3 font-sans">
            Selected Genome Parents ({dnaMovies.length}/3):
          </label>

          <div className="flex flex-wrap gap-3 items-center">
            {dnaMovies.map((movie, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 rounded-full bg-paper-white px-4 py-2 text-[14px] text-ink-black border border-[#e4e4e7] shadow-sm font-sans"
              >
                <span className="text-sienna-brown font-medium text-[12px]">P#{index + 1}</span>
                <span className="font-medium">{movie}</span>
                <button
                  onClick={() => removeMovie(index)}
                  className="text-slate-gray hover:text-ink-black transition-colors ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {dnaMovies.length < 3 && (
              <div ref={dropdownRef} className="relative flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={movieInput}
                    onClick={() => setIsDropdownOpen(true)}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setMovieInput(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && movieInput) {
                        addMovie(movieInput);
                      }
                    }}
                    placeholder="Click to select or type movie..."
                    className="rounded-full bg-paper-white pl-4 pr-8 py-2 text-[14px] text-ink-black placeholder:text-smoke-gray border border-[#ececec] focus:border-ink-black outline-none shadow-sm w-64"
                  />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-gray hover:text-ink-black"
                  >
                    {isDropdownOpen ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Dropdown list */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-11 z-50 w-72 max-h-64 overflow-y-auto rounded-[16px] bg-paper-white border border-[#e8e8ea] shadow-subtle-2 divide-y divide-[#f2f2f3]">
                      <div className="p-2 bg-mist-gray/60 text-[11px] font-sans text-slate-gray flex justify-between">
                        <span>{filteredMovies.length} movies available</span>
                        <span>Select or type</span>
                      </div>
                      {filteredMovies.slice(0, 60).map((m) => (
                        <button
                          key={m.id || m.title}
                          onClick={() => addMovie(m.title)}
                          className="flex w-full items-center justify-between px-3.5 py-2 text-left text-[13px] hover:bg-mist-gray transition-colors"
                        >
                          <span className="font-medium truncate">{m.title}</span>
                          {m.year && <span className="text-[11px] text-slate-gray shrink-0 ml-2">({m.year})</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => addMovie(movieInput)}
                  className="btn-pill-ghost text-[14px] py-2 px-4"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preset Pairs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#ececec]">
          <span className="text-[13px] text-slate-gray font-sans">Curated Combinations:</span>
          {presetPairs.map((pair, i) => (
            <button
              key={i}
              onClick={() => {
                setDnaMovies(pair);
                setHybridData(null);
              }}
              className="rounded-full bg-mist-gray px-3.5 py-1 text-[13px] text-slate-gray hover:text-ink-black hover:bg-[#e4e4e7] transition-colors"
            >
              {pair.join(" + ")}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSynthesize}
            disabled={dnaMovies.length < 2 || loading}
            className={`btn-pill-filled px-7 py-3 text-[15px] font-sans ${
              dnaMovies.length < 2 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-paper-white border-t-transparent" />
                <span>Computing Latent Barycenter Vector...</span>
              </>
            ) : (
              <>
                <Dna className="h-4 w-4" />
                <span>Cross & Synthesize Offspring ({dnaMovies.length} Parents)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Synthesized Output */}
      {hybridData && (
        <div className="space-y-8 w-full">
          {/* Accent Blush Peach Card — Signature Steep Component */}
          {hybridData.blendProfile && (
            <div className="rounded-[24px] bg-blush-peach p-6 sm:p-8 text-sienna-brown flex flex-col md:flex-row gap-8 justify-between items-start border border-[#f5cdb7] shadow-subtle">
              <div className="space-y-3 max-w-2xl">
                <span className="text-[12px] uppercase tracking-wider font-sans font-medium text-sienna-brown/80">
                  Synthesized Intersection Matrix
                </span>
                <h3 className="font-editorial-serif text-[28px] sm:text-[34px] font-normal leading-[1.2]">
                  Offspring coordinates of {hybridData.blendProfile.parentMovies.join(" × ")}
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {hybridData.blendProfile.combinedGenres.map((g: string) => (
                    <span
                      key={g}
                      className="rounded-full bg-paper-white/70 px-3 py-1 text-[12px] font-medium text-sienna-brown border border-sienna-brown/10"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Blended Mood Radar */}
              <div className="grid grid-cols-3 gap-3 rounded-[18px] bg-paper-white/80 p-4 text-[12px] text-sienna-brown border border-sienna-brown/10 w-full md:w-auto">
                <div>
                  <span className="opacity-75">Mind-Bending</span>
                  <p className="text-[16px] font-medium">
                    {hybridData.blendProfile.blendedMood.mind_bending}%
                  </p>
                </div>
                <div>
                  <span className="opacity-75">Spectacle</span>
                  <p className="text-[16px] font-medium">
                    {hybridData.blendProfile.blendedMood.spectacle}%
                  </p>
                </div>
                <div>
                  <span className="opacity-75">Adrenaline</span>
                  <p className="text-[16px] font-medium">
                    {hybridData.blendProfile.blendedMood.adrenaline}%
                  </p>
                </div>
                <div>
                  <span className="opacity-75">Melancholy</span>
                  <p className="text-[16px] font-medium">
                    {hybridData.blendProfile.blendedMood.melancholy}%
                  </p>
                </div>
                <div>
                  <span className="opacity-75">Warmth</span>
                  <p className="text-[16px] font-medium">
                    {hybridData.blendProfile.blendedMood.warmth}%
                  </p>
                </div>
                <div>
                  <span className="opacity-75">Dark Noir</span>
                  <p className="text-[16px] font-medium">
                    {hybridData.blendProfile.blendedMood.dark_noir}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Offspring Recommendations Grid */}
          <div className="space-y-6 w-full">
            <h3 className="font-editorial-serif text-[28px] font-normal text-ink-black">
              Synthesized Offspring Recommendations ({hybridData.recommendations.length})
            </h3>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 w-full">
              {hybridData.recommendations.map((rec: any) => (
                <MovieCard
                  key={rec.id}
                  movie={rec}
                  isSaved={savedMovies.some((m) => m.id === rec.id)}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
