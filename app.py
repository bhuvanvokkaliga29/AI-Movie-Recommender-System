import streamlit as st
import pandas as pd
import requests
import os
import ast

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="🎬 AI Movie Recommender",
    page_icon="🎥",
    layout="wide"
)

# ---------------- BACKGROUND + CSS ----------------
st.markdown("""
<style>
.stApp {
    background: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.95)),
    url("https://images.unsplash.com/photo-1524985069026-dd778a71c7b4");
    background-size: cover;
    background-position: center;
}

.title {
    font-size:50px;
    font-weight:800;
    text-align:center;
    color:#ff4b4b;
    margin-bottom:25px;
}

.subtitle {
    text-align:center;
    font-size:18px;
    color:#ccc;
    margin-bottom:30px;
}

.movie-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-radius:18px;
    padding:10px;
    text-align:center;
    transition: all 0.35s ease;
    box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}

.movie-card:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 40px rgba(255,0,0,0.5);
}

.footer {
    text-align:center;
    margin-top:40px;
    color:#aaa;
    font-size:14px;
}
</style>
""", unsafe_allow_html=True)

# ---------------- LOAD & TRAIN MODEL ----------------
@st.cache_data
def load_model():
    movies = pd.read_csv("tmdb_5000_movies.csv")
    credits = pd.read_csv("tmdb_5000_credits.csv")

    movies = movies.merge(credits, on='title')
    movies = movies[['movie_id','title','overview','genres','keywords','cast','crew']]
    movies.dropna(inplace=True)

    def convert(text):
        return [i['name'] for i in ast.literal_eval(text)]

    def fetch_director(text):
        for i in ast.literal_eval(text):
            if i['job'] == 'Director':
                return i['name']
        return ""

    movies['genres'] = movies['genres'].apply(convert)
    movies['keywords'] = movies['keywords'].apply(convert)
    movies['cast'] = movies['cast'].apply(convert)
    movies['crew'] = movies['crew'].apply(fetch_director)

    movies['overview'] = movies['overview'].apply(lambda x: x.split())

    movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast']
    movies['tags'] = movies['tags'].apply(lambda x: " ".join(x))

    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(movies['tags']).toarray()
    similarity = cosine_similarity(vectors)

    return movies, similarity

movies, similarity = load_model()

# ---------------- OMDb POSTER ----------------
API_KEY = "76e2af90"

@st.cache_data
def get_movie_details(title):
    try:
        url = f"http://www.omdbapi.com/?t={title}&apikey={API_KEY}"
        data = requests.get(url, timeout=5).json()

        poster = data.get("Poster")
        year = data.get("Year")
        rating = data.get("imdbRating")

        if not poster or poster == "N/A":
            poster = f"https://via.placeholder.com/500x750?text={title}"

        return poster, year, rating
    except:
        return f"https://via.placeholder.com/500x750?text={title}", "-", "-"

# ---------------- RECOMMEND FUNCTION ----------------
def recommend(movie):
    index = movies[movies['title'] == movie].index[0]

    distances = sorted(list(enumerate(similarity[index])),
                       reverse=True,
                       key=lambda x: x[1])

    names, posters, years, ratings = [], [], [], []

    for i in distances[1:6]:
        title = movies.iloc[i[0]].title
        poster, year, rating = get_movie_details(title)

        names.append(title)
        posters.append(poster)
        years.append(year)
        ratings.append(rating)

    return names, posters, years, ratings

# ---------------- UI ----------------
st.markdown("<div class='title'>🎬 AI Movie Recommender</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Discover movies you’ll love using AI</div>", unsafe_allow_html=True)

selected_movie = st.selectbox("🔍 Select Movie", movies['title'].values)

if st.button("🚀 Show Recommendations"):
    names, posters, years, ratings = recommend(selected_movie)

    cols = st.columns(5)
    for i in range(5):
        with cols[i]:
            st.markdown("<div class='movie-card'>", unsafe_allow_html=True)
            st.image(posters[i], use_container_width=True)
            st.markdown(f"**{names[i]}**")
            st.caption(f"📅 {years[i]} | ⭐ {ratings[i]}")
            st.markdown("</div>", unsafe_allow_html=True)

st.markdown("---")
st.markdown("<div class='footer'>Made with ❤️ by Bhuvan Gowda H K</div>", unsafe_allow_html=True)