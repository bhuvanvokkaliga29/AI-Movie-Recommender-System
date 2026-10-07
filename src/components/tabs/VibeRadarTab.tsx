"use client";

import React, { useState } from "react";
import { Sliders, RefreshCw } from "lucide-react";
import { MovieCard } from "../MovieCard";

interface VibeRadarTabProps {
  savedMovies: any[];
  onToggleSave: (movie: any) => void;
  onSendToDna: (title: string) => void;
}

export const VibeRadarTab: React.FC<VibeRadarTabProps> = ({
  savedMovies,
  onToggleSave,
  onSendToDna,
}) => {
  const [mood, setMood] = useState({
    adrenaline: 75,
    melancholy: 30,
    mind_bending: 85,
    spectacle: 80,
    warmth: 15,
    dark_noir: 60,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSliderChange = (key: keyof typeof mood, value: number) => {
    setMood((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = async (targetMood = mood) => {
    setLoading(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: targetMood, limit: 12 }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.recommendations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const moodPresets = [
    {
      name: "Late Night Existentialism",
      values: { adrenaline: 65, melancholy: 40, mind_bending: 95, spectacle: 60, warmth: 10, dark_noir: 85 },
    },
    {
      name: "Kinetic Adrenaline Rush",
      values: { adrenaline: 95, melancholy: 15, mind_bending: 35, spectacle: 90, warmth: 20, dark_noir: 50 },
    },
    {
      name: "Cosmic Grandeur",
      values: { adrenaline: 40, melancholy: 70, mind_bending: 90, spectacle: 95, warmth: 25, dark_noir: 40 },
    },
    {
      name: "Melancholic Rainy Afternoon",
      values: { adrenaline: 10, melancholy: 85, mind_bending: 20, spectacle: 20, warmth: 75, dark_noir: 20 },
    },
    {
      name: "Warm Pastoral Comfort",
      values: { adrenaline: 30, melancholy: 10, mind_bending: 15, spectacle: 50, warmth: 95, dark_noir: 10 },
    },
  ];

  const applyPreset = (presetValues: typeof mood) => {
    setMood(presetValues);
    handleSearch(presetValues);
  };

  const sliderConfig = [
    { key: "mind_bending", label: "Mind-Bending & Paradoxes", desc: "Non-linear time, simulations, memory puzzles & existential wonder" },
    { key: "spectacle", label: "Visual Spectacle & Scale", desc: "Immense cinematography, cosmic worlds & visual worldbuilding" },
    { key: "adrenaline", label: "Kinetic Adrenaline", desc: "Combat, velocity, high-stakes suspense & breathless pacing" },
    { key: "melancholy", label: "Melancholy & Drama", desc: "Emotional weight, grief, contemplation & human longing" },
    { key: "dark_noir", label: "Dark / Gritty Noir", desc: "Psychological tension, corruption, moral ambiguity & shadows" },
    { key: "warmth", label: "Warmth & Comfort", desc: "Heartfelt humor, companionship, romance & optimism" },
  ];

  return (
    <div className="space-y-12 w-full">
      {/* Title */}
      <div className="space-y-3">
        <h2 className="font-editorial-serif text-[36px] sm:text-[44px] font-normal text-ink-black tracking-tight leading-[1.2]">
          Atmosphere Radar <span className="italic font-light text-slate-gray">— emotional vector space</span>
        </h2>
        <p className="text-[16px] text-slate-gray max-w-3xl leading-relaxed">
          Calibrate a continuous 6-dimensional emotional vector. The engine scans the continuous mood topology of 4,809 films to locate nearest Euclidean matches for your exact psychological appetite.
        </p>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-slate-gray font-sans">Atmospheric Presets:</span>
        {moodPresets.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p.values)}
            className="rounded-full bg-mist-gray px-4 py-1.5 text-[13px] text-slate-gray hover:text-ink-black hover:bg-[#e4e4e7] transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Slider Controls Dashboard */}
      <div className="rounded-[24px] bg-fog-white p-6 sm:p-8 border border-[#e8e8ea] shadow-subtle space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {sliderConfig.map((item) => {
            const val = mood[item.key as keyof typeof mood];
            return (
              <div key={item.key} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[15px] font-medium text-ink-black">{item.label}</span>
                    <p className="text-[12px] text-slate-gray mt-0.5">{item.desc}</p>
                  </div>
                  <span className="font-sans text-[14px] font-medium text-ink-black bg-paper-white px-3 py-1 rounded-full border border-[#ececec] shadow-sm">
                    {val}%
                  </span>
                </div>

                <div className="relative flex items-center pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) =>
                      handleSliderChange(item.key as keyof typeof mood, parseInt(e.target.value, 10))
                    }
                    className="w-full h-2 bg-[#e4e4e7] rounded-lg appearance-none cursor-pointer accent-ink-black"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button Strip */}
        <div className="pt-4 border-t border-[#ececec] flex flex-wrap items-center gap-4">
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-pill-filled px-7 py-3 text-[15px] font-sans"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-paper-white border-t-transparent" />
                <span>Locating Euclidean Coordinates...</span>
              </>
            ) : (
              <>
                <Sliders className="h-4 w-4" />
                <span>Locate Atmospheric Matches in 4,809 Vector Space</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              setMood({
                adrenaline: 50,
                melancholy: 50,
                mind_bending: 50,
                spectacle: 50,
                warmth: 50,
                dark_noir: 50,
              })
            }
            className="btn-pill-ghost text-[14px] py-2.5 px-5 font-sans"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Neutral Centroid</span>
          </button>
        </div>
      </div>

      {/* Output Results */}
      {results.length > 0 && (
        <div className="space-y-6 w-full">
          <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
            <h3 className="font-editorial-serif text-[28px] font-normal text-ink-black">
              Euclidean Atmosphere Matches ({results.length})
            </h3>
            <span className="text-[13px] text-slate-gray">
              Ranked by Euclidean Proximity
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 w-full">
            {results.map((movie) => (
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
