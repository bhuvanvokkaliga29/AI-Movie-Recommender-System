import pickle
import streamlit as st
import requests
import os

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="🎬 AI Movie Recommender",
    page_icon="🎥",
    layout="wide"
)

# ---------------- BACKGROUND + ADVANCED CSS ----------------
st.markdown("""
<style>

/* Background */
.stApp {
    background: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.95)),
    url("https://images.unsplash.com/photo-1524985069026-dd778a71c7b4");
    background-size: cover;
    background-position: center;
}

/* Title */
.title {
    font-size:50px;
    font-weight:800;
    text-align:center;
    color:#ff4b4b;
    margin-top:10px;
    margin-bottom:25px;
    letter-spacing:1px;
}

/* Subtitle */
.subtitle {
    text-align:center;
    font-size:18px;
    color:#ccc;
    margin-bottom:30px;
}

/* Glass card */
.movie-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-radius:18px;
    padding:10px;
    text-align:center;
    transition: all 0.35s ease;
    box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}

/* Hover Animation */
.movie-card:hover {
    transform: scale(1.08) translateY(-5px);
    box-shadow: 0 8px 40px rgba(255,0,0,0.5);
}

/* Poster image */
.poster {
    border-radius:12px;
}

/* Button style */
.stButton>button {
    background: linear-gradient(90deg,#ff4b4b,#ff7a18);
    color:white;
    border:none;
    border-radius:8px;
    padding:10px 25px;
    font-size:16px;
    font-weight:600;
    transition: 0.3s;
}
.stButton>button:hover {
    transform: scale(1.05);
    background: linear-gradient(90deg,#ff7a18,#ff4b4b);
}

/* Footer */
.footer {
    text-align:center;
    margin-top:40px;
    color:#aaa;
    font-size:14px;
}

</style>
""", unsafe_allow_html=True)

# ---------------- LOAD DATA ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

movies = pickle.load(open(os.path.join(BASE_DIR, 'movie_list.pkl'), 'rb'))
similarity = pickle.load(open(os.path.join(BASE_DIR, 'similarity.pkl'), 'rb'))

# ---------------- OMDb API FUNCTION ----------------
API_KEY = "76e2af90"

@st.cache_data(show_spinner=False)
def get_movie_details(title):
    try:
        url = f"http://www.omdbapi.com/?t={title}&apikey={API_KEY}"
        data = requests.get(url, timeout=5).json()

        poster = data.get("Poster")
        year = data.get("Year")
        rating = data.get("imdbRating")

        if not poster or poster == "N/A":
            poster = f"https://via.placeholder.com/500x750?text={title.replace(' ','+')}"

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

# ---------------- HEADER ----------------
st.markdown("<div class='title'>🎬 AI Movie Recommender System</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Discover movies you’ll love using AI recommendations</div>", unsafe_allow_html=True)

# ---------------- SEARCH ----------------
movie_list = movies['title'].values

selected_movie = st.selectbox("🔍 Search or select a movie", movie_list)

# ---------------- BUTTON ----------------
if st.button("🚀 Show Recommendations"):

    names, posters, years, ratings = recommend(selected_movie)

    st.markdown("## ⭐ Recommended Movies")

    cols = st.columns(5)

    for i in range(5):
        with cols[i]:
            st.markdown("<div class='movie-card'>", unsafe_allow_html=True)
            st.image(posters[i], use_container_width=True)
            st.markdown(f"**{names[i]}**")
            st.caption(f"📅 {years[i]}  |  ⭐ {ratings[i]}")
            st.markdown("</div>", unsafe_allow_html=True)

# ---------------- FOOTER ----------------
st.markdown("---")
st.markdown(
    "<div class='footer'>Made with ❤️ by Bhuvan Gowda H K | AI + ML Movie Recommender</div>",
    unsafe_allow_html=True
)