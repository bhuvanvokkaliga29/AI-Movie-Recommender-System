"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Info, Bookmark, Plus, Check, Dna, ArrowUpRight } from "lucide-react";

export interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: string;
    vote_average: number;
    score?: number;
    shared_genres?: string[];
    shared_keywords?: string[];
    same_director?: boolean;
    poster?: string;
    imdbRating?: string;
    tagline?: string;
    overview?: string;
    xai?: {
      thematicResonance: number;
      genreAffinity: number;
      directorStyle: number;
      keywordOverlap: number;
    };
  };
  onSelectMovie?: (title: string) => void;
  onSendToDna?: (title: string) => void;
  isSaved?: boolean;
  onToggleSave?: (movie: any) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onSendToDna,
  isSaved = false,
  onToggleSave,
}) => {
  const [showXai, setShowXai] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackPoster =
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
  const posterSrc = imgError || !movie.poster || movie.poster === "N/A" ? fallbackPoster : movie.poster;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-paper-white border border-[#e8e8ea] hover:border-[#d4d4d8] shadow-subtle hover:shadow-subtle-2 transition-all duration-300">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-mist-gray">
        <Image
          src={posterSrc}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setImgError(true)}
          unoptimized
        />

        {/* Soft bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {movie.score !== undefined ? (
            <div className="flex items-center gap-1.5 rounded-full bg-paper-white/95 px-2.5 py-1 text-ink-black shadow-sm backdrop-blur-md border border-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-sienna-brown"></span>
              <span className="font-sans text-[12px] font-medium tracking-tight">
                {movie.score}% match
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Watchlist toggle */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(movie);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? "bg-ink-black text-paper-white shadow-sm"
                  : "bg-paper-white/90 text-ink-black hover:bg-paper-white border border-white/60 shadow-sm"
              }`}
              title={isSaved ? "Saved in Vault" : "Save to Vault"}
            >
              {isSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* DNA Crosser Button */}
        {onSendToDna && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSendToDna(movie.title);
            }}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper-white/95 text-slate-gray hover:text-ink-black hover:bg-paper-white shadow-sm border border-white/40 transition-colors"
            title="Blend in Genome Crosser"
          >
            <Dna className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col justify-between p-4 pt-3">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[13px] text-slate-gray mb-1.5 font-sans">
            <span>{movie.year || "—"}</span>
            <span className="flex items-center gap-1 font-medium text-ink-black">
              <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
              {movie.imdbRating && movie.imdbRating !== "-"
                ? movie.imdbRating
                : movie.vote_average || "7.2"}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectMovie && onSelectMovie(movie.title)}
            className="line-clamp-1 font-sans text-[15px] font-medium text-ink-black hover:text-sienna-brown cursor-pointer transition-colors"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Tagline / Overview */}
          <p className="mt-1 line-clamp-2 text-[13px] text-slate-gray leading-relaxed">
            {movie.tagline || movie.overview || "High-dimensional cinematic affinity."}
          </p>

          {/* Category Tags */}
          {movie.shared_genres && movie.shared_genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {movie.shared_genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-mist-gray px-2.5 py-0.5 text-[11px] text-slate-gray"
                >
                  {g}
                </span>
              ))}
              {movie.same_director && (
                <span className="rounded-full bg-blush-peach px-2 py-0.5 text-[11px] text-sienna-brown font-medium">
                  Same Auteur
                </span>
              )}
            </div>
          )}
        </div>

        {/* Explainable AI Attribution */}
        {movie.xai && (
          <div className="mt-3.5 border-t border-[#ececec] pt-2.5">
            <button
              onClick={() => setShowXai(!showXai)}
              className="flex w-full items-center justify-between text-[12px] text-slate-gray hover:text-ink-black transition-colors"
            >
              <span className="flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                Attribution
              </span>
              <span className="font-sans">{showXai ? "Hide ↑" : "Inspect ↓"}</span>
            </button>

            {showXai && (
              <div className="mt-2.5 space-y-2 rounded-[16px] bg-fog-white p-2.5 text-[12px] border border-[#ececec]">
                <div className="flex justify-between text-slate-gray">
                  <span>Thematic Resonance:</span>
                  <span className="font-medium text-ink-black">{movie.xai.thematicResonance}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-mist-gray overflow-hidden">
                  <div
                    className="h-full bg-ink-black rounded-full"
                    style={{ width: `${movie.xai.thematicResonance}%` }}
                  />
                </div>

                <div className="flex justify-between text-slate-gray">
                  <span>Genre Affinity:</span>
                  <span className="font-medium text-ink-black">{movie.xai.genreAffinity}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-mist-gray overflow-hidden">
                  <div
                    className="h-full bg-sienna-brown rounded-full"
                    style={{ width: `${movie.xai.genreAffinity}%` }}
                  />
                </div>

                <div className="flex justify-between text-slate-gray">
                  <span>Director Style:</span>
                  <span className="font-medium text-ink-black">{movie.xai.directorStyle}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-mist-gray overflow-hidden">
                  <div
                    className="h-full bg-slate-gray rounded-full"
                    style={{ width: `${movie.xai.directorStyle}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
