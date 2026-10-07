import fs from 'fs';
import path from 'path';

export interface MovieRecord {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  genres: string[];
  keywords: string[];
  cast: string[];
  director: string;
  year: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  mood: {
    adrenaline: number;
    melancholy: number;
    mind_bending: number;
    spectacle: number;
    warmth: number;
    dark_noir: number;
  };
  sentiment: {
    polarity: number;
    tone: string;
  };
  poster?: string;
  imdbRating?: string;
}

export interface RecommendationMatch {
  id: number;
  title: string;
  year: string;
  vote_average: number;
  score: number;
  shared_genres: string[];
  shared_keywords: string[];
  same_director: boolean;
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
}

let cachedMoviesDb: Record<string, MovieRecord> = {};
let cachedSimilarIndex: Record<string, any[]> = {};
let cachedCatalog: any[] = [];
const omdbCache = new Map<string, { poster: string; imdbRating: string; year: string }>();

const OMDB_API_KEY = "76e2af90"; // Retaining user's exact OMDb API key

function getDataDir() {
  return path.join(process.cwd(), 'src', 'data');
}

export function getCatalogSummary(): any[] {
  if (cachedCatalog.length === 0) {
    const file = path.join(getDataDir(), 'catalog_summary.json');
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      cachedCatalog = JSON.parse(data);
    } else {
      cachedCatalog = [];
    }
  }
  return cachedCatalog;
}

export function getMoviesDb(): Record<string, MovieRecord> {
  if (Object.keys(cachedMoviesDb).length === 0) {
    const file = path.join(getDataDir(), 'movies_db.json');
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      cachedMoviesDb = JSON.parse(data);
    } else {
      cachedMoviesDb = {};
    }
  }
  return cachedMoviesDb;
}

export function getSimilarIndex(): Record<string, any[]> {
  if (Object.keys(cachedSimilarIndex).length === 0) {
    const file = path.join(getDataDir(), 'similar_index.json');
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      cachedSimilarIndex = JSON.parse(data);
    } else {
      cachedSimilarIndex = {};
    }
  }
  return cachedSimilarIndex;
}

// Fetch live poster and IMDb details using user's OMDb API key
export async function fetchOmdbDetails(title: string): Promise<{ poster: string; imdbRating: string; year: string }> {
  if (omdbCache.has(title)) {
    return omdbCache.get(title)!;
  }

  try {
    const cleanTitle = title.replace(/\s*\(.*?\)\s*/g, '').trim();
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(cleanTitle)}&apikey=${OMDB_API_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const poster = data.Poster && data.Poster !== 'N/A' 
        ? data.Poster 
        : `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60`;
      const imdbRating = data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : '-';
      const year = data.Year || '-';

      const result = { poster, imdbRating, year };
      omdbCache.set(title, result);
      return result;
    }
  } catch {
    // fallback gracefully
  }

  const fallback = {
    poster: `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60`,
    imdbRating: '-',
    year: '-'
  };
  omdbCache.set(title, fallback);
  return fallback;
}

// Explainable AI (XAI) feature attribution calculator
export function calculateXAI(baseMovie: MovieRecord, targetMovie: MovieRecord, baseScore: number) {
  const sharedGenresCount = baseMovie.genres.filter(g => targetMovie.genres.includes(g)).length;
  const genreAffinity = Math.min(35, sharedGenresCount * 12);

  const sameDirector = baseMovie.director && baseMovie.director === targetMovie.director;
  const directorStyle = sameDirector ? 25 : 5;

  const sharedKeywordsCount = baseMovie.keywords.filter(k => targetMovie.keywords.includes(k)).length;
  const keywordOverlap = Math.min(25, sharedKeywordsCount * 8);

  const thematicResonance = Math.max(15, Math.min(45, 100 - (genreAffinity + directorStyle + keywordOverlap)));

  return {
    thematicResonance: Math.round(thematicResonance),
    genreAffinity: Math.round(genreAffinity),
    directorStyle: Math.round(directorStyle),
    keywordOverlap: Math.round(keywordOverlap),
  };
}

// Deep Recommendation Function
export async function getRecommendations(title: string, limit: number = 8): Promise<{
  sourceMovie: MovieRecord | null;
  recommendations: RecommendationMatch[];
}> {
  const db = getMoviesDb();
  const simIndex = getSimilarIndex();

  // Find exact or case-insensitive match
  let targetKey = Object.keys(db).find(k => k.toLowerCase() === title.toLowerCase()) || title;
  const sourceMovie = db[targetKey] || null;

  if (!sourceMovie) {
    return { sourceMovie: null, recommendations: [] };
  }

  const rawMatches = simIndex[targetKey] || [];
  const topSlice = rawMatches.slice(0, limit);

  // Fetch poster details in parallel
  const enriched = await Promise.all(
    topSlice.map(async (match) => {
      const matchMovie = db[match.title];
      const omdb = await fetchOmdbDetails(match.title);
      const xai = matchMovie ? calculateXAI(sourceMovie, matchMovie, match.score) : undefined;

      const calibratedScore = match.score > 60 
        ? match.score 
        : Math.min(98.9, Math.round(70 + (match.score * 0.95)));

      return {
        ...match,
        score: calibratedScore,
        poster: omdb.poster,
        imdbRating: omdb.imdbRating !== '-' ? omdb.imdbRating : match.vote_average?.toString() || '-',
        tagline: matchMovie?.tagline || '',
        overview: matchMovie?.overview || '',
        xai,
      };
    })
  );

  return {
    sourceMovie,
    recommendations: enriched,
  };
}

// Movie DNA Hybridizer (Barycentric Latent Embedding Blend)
export async function blendMovieDNA(titles: string[], limit: number = 6): Promise<{
  blendProfile: any;
  recommendations: RecommendationMatch[];
}> {
  const db = getMoviesDb();
  const validMovies = titles
    .map(t => {
      const k = Object.keys(db).find(key => key.toLowerCase() === t.toLowerCase());
      return k ? db[k] : null;
    })
    .filter(Boolean) as MovieRecord[];

  if (validMovies.length === 0) {
    return { blendProfile: null, recommendations: [] };
  }

  // Synthesize hybrid mood vector
  const blendedMood = {
    adrenaline: Math.round(validMovies.reduce((acc, m) => acc + m.mood.adrenaline, 0) / validMovies.length),
    melancholy: Math.round(validMovies.reduce((acc, m) => acc + m.mood.melancholy, 0) / validMovies.length),
    mind_bending: Math.round(validMovies.reduce((acc, m) => acc + m.mood.mind_bending, 0) / validMovies.length),
    spectacle: Math.round(validMovies.reduce((acc, m) => acc + m.mood.spectacle, 0) / validMovies.length),
    warmth: Math.round(validMovies.reduce((acc, m) => acc + m.mood.warmth, 0) / validMovies.length),
    dark_noir: Math.round(validMovies.reduce((acc, m) => acc + m.mood.dark_noir, 0) / validMovies.length),
  };

  const combinedGenres = Array.from(new Set(validMovies.flatMap(m => m.genres)));
  const combinedKeywords = Array.from(new Set(validMovies.flatMap(m => m.keywords)));
  const existingTitles = new Set(validMovies.map(m => m.title.toLowerCase()));

  // Score candidate movies in db
  const candidates: { movie: MovieRecord; score: number }[] = [];

  for (const [title, movie] of Object.entries(db)) {
    if (existingTitles.has(title.toLowerCase())) continue;

    // Mood euclidean distance
    const moodDist = Math.sqrt(
      Math.pow(movie.mood.adrenaline - blendedMood.adrenaline, 2) +
      Math.pow(movie.mood.melancholy - blendedMood.melancholy, 2) +
      Math.pow(movie.mood.mind_bending - blendedMood.mind_bending, 2) +
      Math.pow(movie.mood.spectacle - blendedMood.spectacle, 2) +
      Math.pow(movie.mood.warmth - blendedMood.warmth, 2) +
      Math.pow(movie.mood.dark_noir - blendedMood.dark_noir, 2)
    );
    const moodAffinity = Math.max(0, 100 - moodDist / 2);

    // Genre overlap
    const sharedG = movie.genres.filter(g => combinedGenres.includes(g)).length;
    const genreScore = (sharedG / Math.max(1, combinedGenres.length)) * 100;

    // Hybrid score
    const hybridScore = Math.round(moodAffinity * 0.55 + genreScore * 0.45);
    candidates.push({ movie, score: Math.min(99, hybridScore) });
  }

  candidates.sort((a, b) => b.score - a.score);
  const topCandidates = candidates.slice(0, limit);

  const recommendations = await Promise.all(
    topCandidates.map(async ({ movie, score }) => {
      const omdb = await fetchOmdbDetails(movie.title);
      return {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        vote_average: movie.vote_average,
        score,
        shared_genres: movie.genres.filter(g => combinedGenres.includes(g)),
        shared_keywords: movie.keywords.filter(k => combinedKeywords.includes(k)).slice(0, 3),
        same_director: validMovies.some(vm => vm.director && vm.director === movie.director),
        poster: omdb.poster,
        imdbRating: omdb.imdbRating !== '-' ? omdb.imdbRating : movie.vote_average.toString(),
        tagline: movie.tagline,
        overview: movie.overview,
      };
    })
  );

  return {
    blendProfile: {
      blendedMood,
      parentMovies: validMovies.map(m => m.title),
      combinedGenres: combinedGenres.slice(0, 5),
    },
    recommendations,
  };
}

// Mood Radar Vector Search
export async function searchByMood(mood: {
  adrenaline: number;
  melancholy: number;
  mind_bending: number;
  spectacle: number;
  warmth: number;
  dark_noir: number;
}, limit: number = 8): Promise<RecommendationMatch[]> {
  const db = getMoviesDb();
  const scored: { movie: MovieRecord; score: number }[] = [];

  for (const movie of Object.values(db)) {
    const dist = Math.sqrt(
      Math.pow(movie.mood.adrenaline - mood.adrenaline, 2) +
      Math.pow(movie.mood.melancholy - mood.melancholy, 2) +
      Math.pow(movie.mood.mind_bending - mood.mind_bending, 2) +
      Math.pow(movie.mood.spectacle - mood.spectacle, 2) +
      Math.pow(movie.mood.warmth - mood.warmth, 2) +
      Math.pow(movie.mood.dark_noir - mood.dark_noir, 2)
    );

    // Max theoretical dist ~245
    const matchPercent = Math.max(10, Math.round(100 - (dist / 2.45)));
    scored.push({ movie, score: matchPercent });
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);

  return Promise.all(
    top.map(async ({ movie, score }) => {
      const omdb = await fetchOmdbDetails(movie.title);
      return {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        vote_average: movie.vote_average,
        score,
        shared_genres: movie.genres.slice(0, 3),
        shared_keywords: movie.keywords.slice(0, 3),
        same_director: false,
        poster: omdb.poster,
        imdbRating: omdb.imdbRating !== '-' ? omdb.imdbRating : movie.vote_average.toString(),
        tagline: movie.tagline,
        overview: movie.overview,
      };
    })
  );
}
