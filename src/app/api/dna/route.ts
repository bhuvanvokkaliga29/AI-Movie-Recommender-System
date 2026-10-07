import { NextResponse } from 'next/server';
import { blendMovieDNA } from '@/lib/movie-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { movies, limit } = body;

    if (!Array.isArray(movies) || movies.length < 2) {
      return NextResponse.json(
        { error: 'Please provide at least 2 movies to blend DNA' },
        { status: 400 }
      );
    }

    const result = await blendMovieDNA(movies, limit || 8);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
