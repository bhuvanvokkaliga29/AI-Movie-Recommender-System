import { NextResponse } from 'next/server';
import { getCatalogSummary } from '@/lib/movie-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const genre = searchParams.get('genre')?.toLowerCase() || '';

    const catalog = getCatalogSummary();
    let results: any[] = Array.isArray(catalog) ? catalog : [];

    if (query) {
      results = results.filter(
        (m: any) =>
          m.title.toLowerCase().includes(query) ||
          (m.director && m.director.toLowerCase().includes(query))
      );
    }

    if (genre && genre !== 'all') {
      results = results.filter((m: any) =>
        m.genres?.some((g: string) => g.toLowerCase() === genre)
      );
    }

    const limitParam = searchParams.get('limit');
    let limit = 50;
    if (limitParam === 'all') {
      limit = results.length;
    } else if (limitParam) {
      limit = parseInt(limitParam, 10) || 50;
    } else if (!query) {
      limit = results.length; // Return all movies when no query specified
    }

    return NextResponse.json({
      total: results.length,
      movies: results.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
