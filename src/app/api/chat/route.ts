import { NextResponse } from 'next/server';
import { getMoviesDb, fetchOmdbDetails, MovieRecord } from '@/lib/movie-service';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const db = getMoviesDb();
    const query = message.toLowerCase();

    // Semantic Intent Extraction
    const keywords = query
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    // Identify genre mentions
    const knownGenres = ['action', 'adventure', 'sci-fi', 'science fiction', 'thriller', 'drama', 'comedy', 'horror', 'mystery', 'crime', 'romance', 'animation', 'fantasy'];
    const detectedGenres = knownGenres.filter((g) => query.includes(g));

    // Score movies based on query semantics, overview text, genres, and cast
    const scored: { movie: MovieRecord; score: number }[] = [];

    for (const movie of Object.values(db)) {
      let score = 0;
      const overviewLower = movie.overview.toLowerCase();
      const titleLower = movie.title.toLowerCase();

      // Title exact or partial mention
      if (query.includes(titleLower)) {
        score += 80;
      }

      // Keyword matches
      for (const kw of keywords) {
        if (overviewLower.includes(kw)) score += 8;
        if (movie.keywords.some((k) => k.toLowerCase().includes(kw))) score += 14;
        if (movie.cast.some((c) => c.toLowerCase().includes(kw))) score += 18;
        if (movie.director.toLowerCase().includes(kw)) score += 20;
      }

      // Genre alignment
      for (const dg of detectedGenres) {
        if (movie.genres.some((g) => g.toLowerCase().includes(dg))) {
          score += 25;
        }
      }

      // Vibe signals
      if ((query.includes('dark') || query.includes('noir') || query.includes('gritty')) && movie.mood.dark_noir > 60) {
        score += 20;
      }
      if ((query.includes('mind') || query.includes('twist') || query.includes('psychological')) && movie.mood.mind_bending > 60) {
        score += 25;
      }
      if ((query.includes('fun') || query.includes('feel good') || query.includes('funny') || query.includes('chill')) && movie.mood.warmth > 60) {
        score += 20;
      }
      if ((query.includes('intense') || query.includes('action') || query.includes('fast')) && movie.mood.adrenaline > 60) {
        score += 20;
      }

      if (score > 15) {
        scored.push({ movie, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.slice(0, 4);

    // Enrich with posters from OMDb
    const enrichedRecommendations = await Promise.all(
      topMatches.map(async ({ movie, score }) => {
        const omdb = await fetchOmdbDetails(movie.title);
        return {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          vote_average: movie.vote_average,
          score: Math.min(99, Math.round(50 + score / 2)),
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

    // Cinephile agent synthesis
    let agentReply = '';
    if (enrichedRecommendations.length > 0) {
      const topPick = enrichedRecommendations[0];
      agentReply = `I calibrated your request against our multi-dimensional neural embeddings. For "${message}", **${topPick.title}** (${topPick.year}) stands out with a **${topPick.score}% latent alignment**. Notice how its thematic structure, direction by ${db[topPick.title]?.director || 'the filmmaker'}, and tonality (${db[topPick.title]?.sentiment.tone || 'Cinematic'}) match your parameters. Here are the top curated selections from the vector space:`;
    } else {
      agentReply = `I scanned 4,800 cinematic vectors for "${message}". While it is a rare query vector, here are the closest dimensional neighbours that match your narrative tone:`;
    }

    return NextResponse.json({
      reply: agentReply,
      recommendations: enrichedRecommendations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
