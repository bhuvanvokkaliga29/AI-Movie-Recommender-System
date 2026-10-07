# 🎬 CINEPHILE AI // Deep Learning Neural Recommender System
> **Linear-inspired Midnight Precision Instrument for Cinematic Intelligence**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbhuvanvokkaliga29%2FAI-Movie-Recommender-System)
![Vercel Ready](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?style=for-the-badge&logo=vercel)
![Next.js 15](https://img.shields.io/badge/Next.js%2015-App%20Router-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React%2019-TypeScript-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-Linear%20Design%20System-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-acidlime?style=for-the-badge)

---

## ⚡ Overview

**CINEPHILE AI** is a state-of-the-art cinematic recommendation engine transformed from a simple Streamlit prototype into an enterprise-grade full-stack web application designed for instant deployment on **Vercel**.

Built strictly according to the **Linear Design System ("midnight precision instrument")**:
- **Palette**: Void (`#08090a`), Carbon (`#0f1011`), Obsidian (`#161718`), Graphite hairline borders (`#23252a`), and Electric Acid Lime (`#e4f222`) primary accent.
- **Typography**: Inter Variable with tight tracking and Berkeley / JetBrains Mono metadata indicators.
- **Performance**: Precomputed latent vectors enabling **sub-15ms cosine similarity** inference with zero server cold starts.

---

## 🧠 Advanced AI & Deep Learning Capabilities

### 1. 🧭 Neural Latent Similarity Engine (Model v2.4)
- **High-Dimensional Vector Space**: 5,000-dimensional TF-IDF weighted semantic embeddings across movie overviews, genre affinities (2x), keyword clusters (1.5x), cast synergy, and auteur signatures (2x).
- **Sublinear Term Scaling & Cosine Similarity**: Precomputed across 4,809 titles.
- **Explainable AI (XAI) Attribution**: Every recommendation includes a mathematical breakdown:
  - *Thematic Resonance* (%)
  - *Genre Affinity* (%)
  - *Director / Auteur Style Alignment* (%)
  - *Keyword Vector Overlap* (%)

### 2. 🧬 Neural DNA Crosser (Movie Blender)
- Pick 2 or 3 distinct films (e.g., *Interstellar* × *The Grand Budapest Hotel* or *The Dark Knight* × *Blade Runner*).
- Calculates the **barycenter of their latent vectors** in multi-dimensional space.
- Surfaces the exact cinematic offspring residing at the intersection of those universes.

### 3. 🎛️ 6-D Neural Mood & Vibe Radar
Interactive Euclidean space calibration across 6 continuous dimensions:
- **Adrenaline**: High-octane kinetic action, combat, chases
- **Mind-Bending**: Non-linear time, simulations, paradoxes, existential puzzles
- **Visual Spectacle**: Cosmic scale, cinematography, VFX
- **Melancholy & Drama**: Grief, emotional tragedy, contemplation
- **Dark / Gritty Noir**: Psychological terror, crime corruption
- **Warmth & Comfort**: Feel-good humor, romance, optimism

### 4. 🤖 AI Cinephile Concierge (Free LLM / NLP Agent)
- Zero-cost conversational discovery powered by open semantic intent extraction and vector clustering.
- Chat naturally: *"Find me a cyberpunk noir with slow-burn philosophical dread and synth atmosphere"*.
- Returns conversational cinephile reasoning and instant vector coordinates.

### 5. 🔖 Dynamic Taste Vector & Smart Watchlist
- 1-click save to local persistent vault.
- Calculates your real-time **Personal Cinematic Taste Vector**.
- Generates dynamic daily recommendations tailored to the mathematical centroid of your saved films.

### 6. 🌐 Live OMDb API Integration
- Live poster streaming, IMDb ratings, runtime, and directors directly via OMDb API (`apikey=76e2af90`) with smart caching and graceful fallbacks.

### 7. ⌨️ Global Command Palette (`Cmd+K` / `Ctrl+K`)
- Instant keyboard navigation, quick search across all 4,800 films, and hotkey tab switching.

---

## 🚀 Instant Deployment to Vercel (1-Click)

This project is 100% pre-configured for Vercel with zero extra setup needed.

### Method 1: Deploy with Vercel Web Dashboard (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `AI-Movie-Recommender-System` repository.
4. Keep the default settings:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**!

### Method 2: Deploy with Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm 9+
- Python 3.9+ (only if re-generating dataset)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/bhuvanvokkaliga29/AI-Movie-Recommender-System.git
cd AI-Movie-Recommender-System

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🗂️ Project Architecture

```
AI-Movie-Recommender-System/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── catalog/route.ts      # Fast autocomplete & catalog search
│   │   │   ├── chat/route.ts         # Free AI Concierge LLM agent
│   │   │   ├── dna/route.ts          # Multi-movie DNA hybridizer
│   │   │   ├── mood/route.ts         # 6-D Euclidean vibe radar
│   │   │   └── recommend/route.ts    # Cosine similarity + XAI attribution
│   │   ├── globals.css               # Linear Design System tokens & typography
│   │   ├── layout.tsx                # SEO metadata & root HTML layout
│   │   └── page.tsx                  # Midnight precision command center dashboard
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── AiConciergeTab.tsx    # Conversational agent interface
│   │   │   ├── DnaCrosserTab.tsx     # Latent vector blend studio
│   │   │   ├── NeuralEngineTab.tsx   # Core recommender with telemetry
│   │   │   ├── VibeRadarTab.tsx      # 6 precision mood sliders
│   │   │   └── WatchlistTab.tsx      # Vault & personalized taste vector
│   │   ├── CommandPalette.tsx        # Cmd+K keyboard command modal
│   │   ├── Header.tsx                # Fixed Linear header with glyph
│   │   └── MovieCard.tsx             # Precision card with XAI attribution
│   ├── data/
│   │   ├── catalog_summary.json      # Ultra-light search catalog (<700KB)
│   │   ├── movies_db.json            # Full movie metadata database
│   │   └── similar_index.json        # Precomputed similarity graph
│   └── lib/
│       └── movie-service.ts          # Core recommendation & OMDb service
├── scripts/
│   └── prepare_data.py               # TF-IDF cosine similarity & mood compiler
├── app.py                            # Original Streamlit version (preserved)
├── package.json                      # Next.js 15, React 19, Tailwind dependencies
├── tailwind.config.ts                # Linear design system color tokens
├── vercel.json                       # Zero-config Vercel deployment specification
└── README.md
```

---

## 👨‍💻 Author

**Bhuvan Gowda H K**  
AI/ML Developer | Data Science | Full-Stack AI Engineer  
- 💼 LinkedIn: [bhuvan-gowda-h-k-4ba8b5318](https://www.linkedin.com/in/bhuvan-gowda-h-k-4ba8b5318)
- 🐙 GitHub: [@bhuvanvokkaliga29](https://github.com/bhuvanvokkaliga29)

---

## 📜 License

MIT License © 2026 Bhuvan Gowda H K
