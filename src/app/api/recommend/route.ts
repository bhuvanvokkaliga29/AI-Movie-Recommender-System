import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/movie-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movie = searchParams.get('movie') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!movie) {
      return NextResponse.json({ error: 'Movie parameter is required' }, { status: 400 });
    }

    const result = await getRecommendations(movie, limit);

    if (!result.sourceMovie) {
      return NextResponse.json({ error: `Movie "${movie}" not found in neural index` }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
