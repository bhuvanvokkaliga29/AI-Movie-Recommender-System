import pandas as pd
import numpy as np
import json
import ast
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import io
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

print("[INFO] Starting AI Movie Data Preparation...")

# Load datasets
movies = pd.read_csv('tmdb_5000_movies.csv')
credits = pd.read_csv('tmdb_5000_credits.csv')

# Merge
df = movies.merge(credits, on='title')
print(f"Loaded {len(df)} movies.")

# Safe parser for JSON-like string columns
def safe_parse(text):
    if not isinstance(text, str) or pd.isna(text):
        return []
    try:
        return ast.literal_eval(text)
    except Exception:
        return []

def get_names(items, max_count=None):
    parsed = safe_parse(items)
    res = []
    for item in parsed:
        if isinstance(item, dict) and 'name' in item:
            res.append(item['name'])
            if max_count and len(res) >= max_count:
                break
    return res

def get_director(crew_items):
    parsed = safe_parse(crew_items)
    for member in parsed:
        if isinstance(member, dict) and member.get('job') == 'Director':
            return member.get('name', '')
    return ''

df['genre_list'] = df['genres'].apply(lambda x: get_names(x))
df['keyword_list'] = df['keywords'].apply(lambda x: get_names(x, 10))
df['cast_list'] = df['cast'].apply(lambda x: get_names(x, 5))
df['director'] = df['crew'].apply(get_director)

# Filter out movies without valid overview or title
df['overview'] = df['overview'].fillna('')
df['tagline'] = df['tagline'].fillna('')
df['release_date'] = df['release_date'].fillna('2000-01-01')
df['year'] = df['release_date'].apply(lambda x: str(x)[:4] if isinstance(x, str) and len(str(x)) >= 4 else 'N/A')
df['vote_average'] = df['vote_average'].fillna(6.0).round(1)
df['vote_count'] = df['vote_count'].fillna(0).astype(int)
df['runtime'] = df['runtime'].fillna(100).astype(int)

# Mood Profile Vector Calculator (6 dimensions: Adrenaline, Melancholy, MindBending, Spectacle, Warmth, DarkNoir)
def compute_mood(row):
    genres = set(g.lower() for g in row['genre_list'])
    keywords = set(k.lower() for k in row['keyword_list'])
    overview = row['overview'].lower()

    # Heuristic scoring based on semantic signals
    adr = 10
    if 'action' in genres: adr += 40
    if 'adventure' in genres: adr += 25
    if 'thriller' in genres: adr += 20
    if any(w in overview or any(w in k for k in keywords) for w in ['chase', 'explosion', 'fight', 'gun', 'assassin', 'heist', 'survival', 'speed', 'race']):
        adr += 25

    mel = 10
    if 'drama' in genres: mel += 40
    if 'romance' in genres: mel += 25
    if any(w in overview or any(w in k for k in keywords) for w in ['loss', 'grief', 'death', 'tragedy', 'illness', 'sorrow', 'divorce', 'tear', 'depression']):
        mel += 30

    mb = 10
    if 'science fiction' in genres or 'sci-fi' in genres: mb += 35
    if 'mystery' in genres: mb += 30
    if any(w in overview or any(w in k for k in keywords) for w in ['time travel', 'simulation', 'dimension', 'mind', 'dream', 'memory', 'conspiracy', 'hallucination', 'puzzle', 'alien']):
        mb += 30

    spec = 10
    if 'fantasy' in genres: spec += 35
    if 'science fiction' in genres: spec += 25
    if 'adventure' in genres: spec += 20
    if row.get('budget', 0) > 80000000: spec += 20
    if any(w in overview or any(w in k for k in keywords) for w in ['galaxy', 'epic', 'universe', 'magic', 'kingdom', 'superhero', 'visual']):
        spec += 20

    warm = 10
    if 'comedy' in genres: warm += 35
    if 'family' in genres or 'animation' in genres: warm += 35
    if 'romance' in genres: warm += 20
    if any(w in overview or any(w in k for k in keywords) for w in ['love', 'friendship', 'holiday', 'heartwarming', 'dog', 'laugh', 'cute', 'summer']):
        warm += 20

    dark = 10
    if 'horror' in genres: dark += 45
    if 'crime' in genres: dark += 30
    if 'thriller' in genres: dark += 20
    if any(w in overview or any(w in k for k in keywords) for w in ['murder', 'serial killer', 'blood', 'demon', 'monster', 'haunted', 'dark', 'evil', 'sinister', 'psychopath']):
        dark += 30

    # Clamp 0-100
    return {
        'adrenaline': min(100, adr),
        'melancholy': min(100, mel),
        'mind_bending': min(100, mb),
        'spectacle': min(100, spec),
        'warmth': min(100, warm),
        'dark_noir': min(100, dark)
    }

# NLP Sentiment Tone Classifier
def compute_sentiment(row):
    genres = set(g.lower() for g in row['genre_list'])
    overview = row['overview'].lower()
    
    positive_words = ['love', 'hope', 'triumph', 'friendship', 'joy', 'humor', 'hero', 'save', 'dream', 'adventure', 'celebrate']
    negative_words = ['death', 'murder', 'war', 'destroy', 'betrayal', 'kill', 'tragedy', 'dark', 'evil', 'disaster', 'revenge']
    
    pos_score = sum(1 for w in positive_words if w in overview)
    neg_score = sum(1 for w in negative_words if w in overview)
    
    polarity = 0.0
    if pos_score + neg_score > 0:
        polarity = round((pos_score - neg_score) / (pos_score + neg_score), 2)
    elif 'comedy' in genres or 'animation' in genres:
        polarity = 0.5
    elif 'horror' in genres or 'crime' in genres:
        polarity = -0.5

    if 'horror' in genres or 'crime' in genres:
        tone = 'Dark & Gritty'
    elif 'comedy' in genres or 'animation' in genres:
        tone = 'Uplifting & Humorous'
    elif 'science fiction' in genres or 'mystery' in genres:
        tone = 'Intense & Mind-Bending'
    elif 'drama' in genres or 'romance' in genres:
        tone = 'Emotional & Contemplative'
    else:
        tone = 'High-Stakes & Adventurous'

    return {
        'polarity': polarity,
        'tone': tone
    }

print("Computing mood & sentiment vectors...")
df['mood'] = df.apply(compute_mood, axis=1)
df['sentiment'] = df.apply(compute_sentiment, axis=1)

# NLP Feature Engineering for Cosine Similarity
def make_tags(row):
    overview_clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', row['overview']).lower()
    # Genres given 2x weight
    genres_clean = " ".join([g.replace(" ", "").lower() for g in row['genre_list']] * 2)
    # Keywords given 1.5x weight
    keywords_clean = " ".join([k.replace(" ", "").lower() for k in row['keyword_list']])
    # Cast given 1.5x weight
    cast_clean = " ".join([c.replace(" ", "").lower() for c in row['cast_list']])
    # Director given 2x weight
    director_clean = (row['director'].replace(" ", "").lower() + " ") * 2 if row['director'] else ""
    
    return f"{overview_clean} {genres_clean} {keywords_clean} {cast_clean} {director_clean}"

df['tags'] = df.apply(make_tags, axis=1)

print("Vectorizing tags using TF-IDF (5000 max features, sublinear tf)...")
tfidf = TfidfVectorizer(max_features=5000, stop_words='english', sublinear_tf=True, ngram_range=(1, 2))
matrix = tfidf.fit_transform(df['tags'])
print("Matrix shape:", matrix.shape)

print("Computing cosine similarity...")
sim_matrix = cosine_similarity(matrix)

# Build movies lookup and precomputed top-20 similarity index
movies_db = {}
catalog_summary = []
similar_index = {}

indices = df.index.tolist()

for i, row in df.iterrows():
    movie_id = int(row['id']) if not pd.isna(row['id']) else i
    title = str(row['title']).strip()
    
    # Precompute top 15 recommendations
    sim_scores = list(enumerate(sim_matrix[i]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    top_matches = []
    for match_idx, score in sim_scores[1:16]:
        match_row = df.iloc[match_idx]
        match_title = str(match_row['title']).strip()
        shared_genres = list(set(row['genre_list']).intersection(set(match_row['genre_list'])))
        shared_keywords = list(set(row['keyword_list']).intersection(set(match_row['keyword_list'])))[:3]
        same_director = bool(row['director'] and row['director'] == match_row['director'])
        
        match_percentage = min(99.4, round(float(score) * 100, 1))
        
        top_matches.append({
            'id': int(match_row['id']),
            'title': match_title,
            'year': match_row['year'],
            'vote_average': match_row['vote_average'],
            'score': match_percentage,
            'shared_genres': shared_genres,
            'shared_keywords': shared_keywords,
            'same_director': same_director
        })

    similar_index[title] = top_matches

    # Catalog summary for lightning-fast search
    catalog_summary.append({
        'id': movie_id,
        'title': title,
        'year': row['year'],
        'genres': row['genre_list'][:3],
        'vote_average': row['vote_average'],
        'director': row['director']
    })

    # Detailed movie record
    movies_db[title] = {
        'id': movie_id,
        'title': title,
        'tagline': row['tagline'],
        'overview': row['overview'],
        'genres': row['genre_list'],
        'keywords': row['keyword_list'][:8],
        'cast': row['cast_list'][:4],
        'director': row['director'],
        'year': row['year'],
        'runtime': int(row['runtime']),
        'vote_average': float(row['vote_average']),
        'vote_count': int(row['vote_count']),
        'popularity': round(float(row['popularity']), 2),
        'mood': row['mood'],
        'sentiment': row['sentiment']
    }

os.makedirs('src/data', exist_ok=True)

with open('src/data/movies_db.json', 'w', encoding='utf-8') as f:
    json.dump(movies_db, f)

with open('src/data/similar_index.json', 'w', encoding='utf-8') as f:
    json.dump(similar_index, f)

with open('src/data/catalog_summary.json', 'w', encoding='utf-8') as f:
    json.dump(catalog_summary, f)

print(f"[SUCCESS] Successfully generated database with {len(movies_db)} movies!")
print("Files saved to src/data/movies_db.json, similar_index.json, catalog_summary.json")
