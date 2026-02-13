import pandas as pd
import numpy as np
import ast
import pickle

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------- LOAD DATA ----------------
movies = pd.read_csv('tmdb_5000_movies.csv')
credits = pd.read_csv('tmdb_5000_credits.csv')

# ---------------- MERGE ----------------
movies = movies.merge(credits, on='title')

# ---------------- SELECT FEATURES ----------------
movies = movies[['movie_id','title','overview','genres','keywords','cast','crew']]

# ---------------- CLEANING ----------------
movies.dropna(inplace=True)

# convert string list into python list
def convert(text):
    L = []
    for i in ast.literal_eval(text):
        L.append(i['name'])
    return L

# convert top 3 cast only
def convert_cast(text):
    L = []
    counter = 0
    for i in ast.literal_eval(text):
        if counter != 3:
            L.append(i['name'])
            counter += 1
        else:
            break
    return L

# fetch director from crew
def fetch_director(text):
    L = []
    for i in ast.literal_eval(text):
        if i['job'] == 'Director':
            L.append(i['name'])
    return L

# ---------------- APPLY FUNCTIONS ----------------
movies['genres'] = movies['genres'].apply(convert)
movies['keywords'] = movies['keywords'].apply(convert)
movies['cast'] = movies['cast'].apply(convert_cast)
movies['crew'] = movies['crew'].apply(fetch_director)

# ---------------- PROCESS OVERVIEW ----------------
movies['overview'] = movies['overview'].apply(lambda x: x.split())

# remove spaces between names (so ML treats as one word)
movies['genres'] = movies['genres'].apply(lambda x: [i.replace(" ","") for i in x])
movies['keywords'] = movies['keywords'].apply(lambda x: [i.replace(" ","") for i in x])
movies['cast'] = movies['cast'].apply(lambda x: [i.replace(" ","") for i in x])
movies['crew'] = movies['crew'].apply(lambda x: [i.replace(" ","") for i in x])

# ---------------- CREATE TAGS ----------------
movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']

new_df = movies[['movie_id','title','tags']]

# convert list to string
new_df['tags'] = new_df['tags'].apply(lambda x: " ".join(x))

# ---------------- TEXT VECTORIZE ----------------
cv = CountVectorizer(max_features=5000, stop_words='english')

vectors = cv.fit_transform(new_df['tags']).toarray()

# ---------------- SIMILARITY ----------------
similarity = cosine_similarity(vectors)

# ---------------- SAVE FILES ----------------
pickle.dump(new_df, open('movie_list.pkl','wb'))
pickle.dump(similarity, open('similarity.pkl','wb'))

print("✅ Model trained successfully!")