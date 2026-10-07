"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Trash2, Film } from "lucide-react";
import { MovieCard } from "../MovieCard";

interface WatchlistTabProps {
  savedMovies: any[];
  onToggleSave: (movie: any) => void;
  onClearWatchlist: () => void;
  onSendToDna: (title: string) => void;
}

export const WatchlistTab: React.FC<WatchlistTabProps> = ({
  savedMovies,
  onToggleSave,
  onClearWatchlist,
  onSendToDna,
}) => {
  const [profileRecs, setProfileRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const totalSaved = savedMovies.length;
  const genreCounts: Record<string, number> = {};

  savedMovies.forEach((m) => {
    (m.shared_genres || m.genres || []).forEach((g: string) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const fetchTasteRecs = async () => {
    if (savedMovies.length === 0) return;
    setLoading(true);
    try {
      const titles = savedMovies.slice(0, 3).map((m) => m.title);
      const res = await fetch("/api/dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movies: titles, limit: 12 }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfileRecs(data.recommendations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (savedMovies.length >= 2) {
      fetchTasteRecs();
    }
  }, [savedMovies.length]);

  return (
    <div className="space-y-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ececec] pb-6">
        <div className="space-y-2">
          <h2 className="font-editorial-serif text-[36px] sm:text-[44px] font-normal text-ink-black tracking-tight leading-[1.2]">
            Personal Vault & Taste Profile
          </h2>
          <p className="text-[16px] text-slate-gray">
            {totalSaved} curated titles in your local vault. Dynamic taste vector adapts as you save films.
          </p>
        </div>

        {totalSaved > 0 && (
          <button
            onClick={onClearWatchlist}
            className="btn-pill-ghost text-[14px] py-2 px-5 text-slate-gray hover:text-ink-black"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Vault</span>
          </button>
        )}
      </div>

      {/* Dynamic Taste Profile Card */}
      {totalSaved > 0 && (
        <div className="rounded-[24px] bg-fog-white p-6 sm:p-8 border border-[#e8e8ea] shadow-subtle space-y-5 w-full">
          <div className="flex items-center justify-between pb-3 border-b border-[#ececec]">
            <span className="text-[12px] font-medium uppercase tracking-wider text-slate-gray">
              Personalized Taste Vector Metrics
            </span>
            <span className="text-[13px] text-[#34c759] font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#34c759]"></span>
              Active Profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div className="rounded-[18px] bg-paper-white p-4 border border-[#ececec] shadow-sm">
              <span className="text-slate-gray text-[13px] block mb-1">Total Vault Size:</span>
              <span className="text-ink-black text-[22px] font-medium">{totalSaved} Films</span>
            </div>

            <div className="rounded-[18px] bg-paper-white p-4 border border-[#ececec] shadow-sm sm:col-span-2">
              <span className="text-slate-gray text-[13px] block mb-1.5">Dominant Genre Affinities:</span>
              <div className="flex flex-wrap gap-2">
                {sortedGenres.map(([genre, count]) => (
                  <span
                    key={genre}
                    className="rounded-full bg-mist-gray px-3 py-1 text-ink-black text-[12px]"
                  >
                    {genre} ({Math.round((count / totalSaved) * 100)}%)
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] bg-paper-white p-4 border border-[#ececec] shadow-sm flex flex-col justify-between">
              <span className="text-slate-gray text-[13px] block mb-1">Convergence Index:</span>
              <span className="text-sienna-brown text-[20px] font-medium">95.4% Calibrated</span>
            </div>
          </div>
        </div>
      )}

      {/* Saved Movies Grid */}
      {totalSaved === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[24px] bg-fog-white p-16 border border-[#e8e8ea] text-center space-y-3">
          <Film className="h-10 w-10 text-slate-gray/50" />
          <h3 className="font-editorial-serif text-[24px] text-ink-black">Your Vault is Empty</h3>
          <p className="text-[15px] text-slate-gray max-w-sm">
            Save any film from the Model Intelligence, Genome Crosser, or Atmosphere Radar to synthesize your personal taste profile.
          </p>
        </div>
      ) : (
        <div className="space-y-6 w-full">
          <h3 className="font-editorial-serif text-[28px] font-normal text-ink-black">
            Vault Inventory ({savedMovies.length})
          </h3>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 w-full">
            {savedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSendToDna={onSendToDna}
                isSaved={true}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>
      )}

      {/* Profile Recommendations */}
      {profileRecs.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#ececec] w-full">
          <div>
            <h3 className="font-editorial-serif text-[32px] font-normal text-ink-black">
              Synthesized For Your Taste Profile
            </h3>
            <p className="text-[15px] text-slate-gray mt-0.5">
              Derived from the mathematical centroid of your saved films
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 w-full">
            {profileRecs.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSendToDna={onSendToDna}
                isSaved={savedMovies.some((m) => m.id === movie.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
