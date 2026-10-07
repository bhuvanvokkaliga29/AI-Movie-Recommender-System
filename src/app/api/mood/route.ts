import { NextResponse } from 'next/server';
import { searchByMood } from '@/lib/movie-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mood, limit } = body;

    if (!mood) {
      return NextResponse.json({ error: 'Mood vector is required' }, { status: 400 });
    }

    const normalizedMood = {
      adrenaline: Number(mood.adrenaline) || 0,
      melancholy: Number(mood.melancholy) || 0,
      mind_bending: Number(mood.mind_bending) || 0,
      spectacle: Number(mood.spectacle) || 0,
      warmth: Number(mood.warmth) || 0,
      dark_noir: Number(mood.dark_noir) || 0,
    };

    const results = await searchByMood(normalizedMood, limit || 8);
    return NextResponse.json({ mood: normalizedMood, recommendations: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
