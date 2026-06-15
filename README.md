<div align="center">

# 🌿 CarbonMind AI

### *Your Personal Carbon Intelligence Engine*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://carbonmind-ai-674054017244.asia-south1.run.app)
[![GCP](https://img.shields.io/badge/Hosted_on-GCP_Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_+_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-00f59b?style=for-the-badge)](LICENSE)

<br/>

> **CarbonMind AI** is a premium, AI-powered carbon footprint tracking and coaching platform designed for urban Indian users.  
> It combines real-time habit analysis, gamification, and a carbon intelligence reasoning engine to help you understand, reduce, and compete on your environmental impact.

<br/>

![CarbonMind AI Banner](https://img.shields.io/badge/🌱_Carbon_Score-Gamified_Sustainability_Intelligence-00f59b?style=flat-square)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🖥️ Screenshots & Screens](#%EF%B8%8F-screenshots--screens)
- [🏗️ System Architecture](#%EF%B8%8F-system-architecture)
- [🔄 User Flow](#-user-flow)
- [🧠 AI Coach Engine Flow](#-ai-coach-engine-flow)
- [🏆 Gamification & Scoring Flow](#-gamification--scoring-flow)
- [🚀 Deployment Architecture](#-deployment-architecture)
- [⚡ Quick Start — Local Development](#-quick-start--local-development)
- [☁️ Deploy to GCP Cloud Run](#%EF%B8%8F-deploy-to-gcp-cloud-run)
- [🔌 API Reference](#-api-reference)
- [🎨 Design System](#-design-system)
- [📁 Project Structure](#-project-structure)
- [🛣️ Roadmap](#%EF%B8%8F-roadmap)

---

## ✨ Features

| Feature | Description |
|:--|:--|
| 🎯 **Carbon Impact Score (0–1000)** | Animated SVG gauge updated in real-time as you modify habits |
| 🧠 **Master AI Coach Prompt Engine** | Structured JSON responses — cause → effect carbon reasoning, not generic tips |
| 📊 **Lifestyle Breakdown** | Donut + bar charts for Transport, Diet, Energy, and Waste categories |
| 🏆 **Gamification Leaderboard** | Eco Levels, Badges, Streak counters, and competitive community ranks |
| 🎉 **Canvas Confetti Rewards** | Fires when your Carbon Score improves |
| 📱 **Mobile-First Responsive** | Full bottom-nav experience on phones, sidebar on desktop |
| ☁️ **Single Cloud Run Deploy** | Backend + Frontend in one container — no CDN or separate hosting needed |
| 🔌 **OpenAI-Ready** | Plug in `OPENAI_API_KEY` for GPT-4o-mini powered live reasoning |

---

## 🖥️ Screenshots & Screens

### 4 Core Screens

```
┌─────────────────────────────────────────────────────┐
│  📊 Dashboard    │  Animated score gauge, habit      │
│                  │  modifiers, AI recommendations,   │
│                  │  weekly savings trend chart        │
├─────────────────────────────────────────────────────┤
│  🥧 Breakdown    │  Donut chart by category,          │
│                  │  hotspot critical alert,           │
│                  │  category deep-dive cards          │
├─────────────────────────────────────────────────────┤
│  🤖 AI Coach     │  Chat interface, quick prompts,    │
│                  │  structured intelligence reports,  │
│                  │  carbon personality type           │
├─────────────────────────────────────────────────────┤
│  🏆 Eco Level    │  Level progress bar, badge board,  │
│                  │  streak counter, leaderboard       │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Layer"]
        UI["Browser / Mobile\n(index.html + JS)"]
    end

    subgraph CLOUDRUN["☁️ GCP Cloud Run — carbonmind-ai"]
        direction TB
        FASTAPI["⚡ FastAPI Server\n(uvicorn on $PORT)"]
        STATIC["📁 StaticFiles\n/static/*\n(style.css, app.js)"]
        API["🔌 REST API\n/leaderboard\n/user/rank\n/coach/ask\n/user/sync"]
        COACH["🧠 AI Coach Engine\nRule-based Carbon\nReasoning Logic"]
        OPENAI["🤖 OpenAI GPT-4o-mini\n(optional — via API key)"]
    end

    subgraph GCP["🏗️ GCP Infrastructure"]
        ARTIFACT["📦 Artifact Registry\nDocker Image Store"]
        CLOUDBUILD["🔨 Cloud Build\nDockerfile → Image"]
        IAM["🔒 IAM\nAllowUnauthenticated"]
    end

    UI -->|"HTTP GET /"| FASTAPI
    FASTAPI -->|"Serves"| STATIC
    FASTAPI -->|"Routes"| API
    API --> COACH
    COACH -->|"If OPENAI_API_KEY set"| OPENAI
    CLOUDBUILD -->|"Push image"| ARTIFACT
    ARTIFACT -->|"Pull & run"| FASTAPI
    IAM --> FASTAPI

    style CLIENT fill:#0c120e,stroke:#00f59b,color:#f3f4f6
    style CLOUDRUN fill:#0f1913,stroke:#00f59b,color:#f3f4f6
    style GCP fill:#080b09,stroke:#4285F4,color:#f3f4f6
```

---

## 🔄 User Flow

```mermaid
flowchart TD
    A([🌐 User opens app]) --> B[Dashboard loads\nwith default habits]
    B --> C{User adjusts\nhabit modifier}

    C -->|Transport changed| D[Carbon Calculator\nruns instantly]
    C -->|Diet changed| D
    C -->|Energy changed| D
    C -->|Waste changed| D

    D --> E{Score\nimproved?}
    E -->|Yes ✅| F[🎉 Confetti fires\n+ Green toast\n+ Score animates up]
    E -->|No ❌| G[⚠️ Warning toast\n+ Score animates down]

    F --> H[Badges unlock\nautomatically]
    G --> I[AI Recommendation\nupdates]

    H --> J[Navigate to\nEco Level screen]
    I --> K[Navigate to\nAI Coach screen]

    J --> L[View Leaderboard\nrank change]
    K --> M[Send question\nto AI Coach]

    M --> N[Typing indicator\nappears — 1.5s delay]
    N --> O[Structured JSON\nreport renders]
    O --> P[View: Personality Type\nTop 3 Actions\nMicro Actions\n30-day Projection]

    P --> Q([✅ User understands\ntheir carbon footprint])

    style A fill:#00f59b,stroke:#00f59b,color:#080b09
    style Q fill:#00f59b,stroke:#00f59b,color:#080b09
    style F fill:#0f1913,stroke:#00f59b,color:#f3f4f6
    style E fill:#0f1913,stroke:#ff9f43,color:#f3f4f6
```

---

## 🧠 AI Coach Engine Flow

```mermaid
flowchart LR
    subgraph INPUT["📥 Input"]
        Q["User Question\n+ Lifestyle Data"]
    end

    subgraph ENGINE["🧠 Carbon Intelligence Engine"]
        direction TB
        MATCH["Keyword\nMatcher"]
        KEY{OpenAI\nAPI Key?}
        GPT["GPT-4o-mini\nwith Master Prompt"]
        LOCAL["Local Rule-Based\nReasoning Engine"]
        SCORE["Carbon Score\nCalculator"]
        RANK["Personality\nClassifier"]
    end

    subgraph OUTPUT["📤 Structured JSON Output"]
        direction TB
        P["carbon_personality_type"]
        F["total_footprint_estimate"]
        H["impact_hotspots[ ]"]
        A["top_3_actions[\n  action\n  why_it_matters\n  co2_saving_estimate\n  effort_level\n]"]
        M["micro_actions[ ]"]
        PR["future_projection_30_days"]
        MI["motivational_insight"]
    end

    Q --> MATCH
    MATCH --> KEY
    KEY -->|Yes| GPT
    KEY -->|No| LOCAL
    LOCAL --> SCORE --> RANK
    GPT --> P
    RANK --> P
    P --> F --> H --> A --> M --> PR --> MI

    style INPUT fill:#0c120e,stroke:#00f59b,color:#f3f4f6
    style ENGINE fill:#0f1913,stroke:#ff9f43,color:#f3f4f6
    style OUTPUT fill:#080b09,stroke:#00f59b,color:#f3f4f6
```

#### Master AI Coach Prompt Rules

> The coach is instructed to:
> - ✅ Analyze **cause → effect**, not give generic tips
> - ✅ Prioritize by **highest CO₂ contributor first**
> - ✅ Compare alternatives **realistically for Indian urban users**
> - ✅ Classify personality: `Eco Beginner` → `Conscious Commuter` → `Green Optimizer`
> - ❌ Never preach or guilt-trip the user
> - ❌ Output must be **JSON only** — no markdown, no prose wrapper

---

## 🏆 Gamification & Scoring Flow

```mermaid
flowchart TD
    subgraph HABITS["⚙️ Daily Habit Inputs"]
        T["🚗 Transport\ncar_single → cycle"]
        D["🥗 Diet\nmeat_heavy → vegan"]
        E["⚡ Energy\nhigh AC → solar"]
        W["🗑️ Waste\nnone → compost"]
    end

    subgraph CALC["🧮 Score Formula"]
        SUM["Daily CO₂ kg =\nTransport + Diet + Energy + Waste"]
        SCORE["Carbon Score =\n1000 − (CO₂ × 20)\nClamped 0–1000"]
    end

    subgraph LEVELS["🏅 Eco Levels"]
        L1["0–300\n🔴 High Impact User"]
        L2["301–600\n🟡 Eco Beginner"]
        L3["601–750\n🔵 Conscious User"]
        L4["751–900\n🟢 Balanced User"]
        L5["901–1000\n✨ Green Optimizer"]
    end

    subgraph BADGES["🎖️ Badge Unlocks"]
        B1["🚗 Low Car Hero\nMetro / EV / Cycle"]
        B2["🥗 Plant-Based Week\nVegetarian / Vegan"]
        B3["⚡ Energy Saver\nLow / Solar energy"]
        B4["♻️ Zero Waste Day\nCompost selected"]
        B5["🔥 Consistency Streak\n10+ day streak"]
    end

    T & D & E & W --> SUM --> SCORE
    SCORE --> L1 & L2 & L3 & L4 & L5
    T -->|"metro/ev/cycle"| B1
    D -->|"vegetarian/vegan"| B2
    E -->|"low/solar"| B3
    W -->|"compost"| B4

    style L5 fill:#0f1913,stroke:#00f59b,color:#00f59b
    style L4 fill:#0f1913,stroke:#10b981,color:#f3f4f6
    style L1 fill:#0f1913,stroke:#ff4757,color:#ff4757
```

#### Deduction Table

| Category | Option | CO₂/day | Score Impact |
|:--|:--|:--:|:--:|
| 🚗 Transport | Solo Petrol Car | 12.0 kg | −240 pts |
| 🚗 Transport | Car Pool | 6.0 kg | −120 pts |
| 🚗 Transport | Metro Rail | 1.5 kg | −30 pts |
| 🚗 Transport | Electric Vehicle | 0.8 kg | −16 pts |
| 🚗 Transport | Cycle / Walk | 0.0 kg | **0 pts** |
| 🥗 Diet | Frequent Red Meat | 8.0 kg | −160 pts |
| 🥗 Diet | Balanced Meat | 4.5 kg | −90 pts |
| 🥗 Diet | Vegetarian | 2.0 kg | −40 pts |
| 🥗 Diet | Vegan | 0.8 kg | −16 pts |
| ⚡ Energy | High AC (>8h) | 9.0 kg | −180 pts |
| ⚡ Energy | Medium AC | 5.0 kg | −100 pts |
| ⚡ Energy | Low AC | 2.0 kg | −40 pts |
| ⚡ Energy | Solar | 0.2 kg | −4 pts |
| ♻️ Waste | No Segregation | 3.0 kg | −60 pts |
| ♻️ Waste | Dry/Wet Split | 1.0 kg | −20 pts |
| ♻️ Waste | Compost | 0.2 kg | −4 pts |

---

## 🚀 Deployment Architecture

```mermaid
flowchart LR
    subgraph DEV["💻 Developer Machine"]
        SRC["Source Code\n(Dockerfile + backend/ + static files)"]
    end

    subgraph GCP["☁️ Google Cloud Platform"]
        subgraph BUILD["Cloud Build"]
            UPLOAD["📤 Source Upload"]
            DOCKER["🐳 Dockerfile Build\npython:3.11-slim\n+ pip install\n+ copy files"]
            IMAGE["📦 Docker Image"]
        end

        subgraph REGISTRY["Artifact Registry"]
            REPO["cloud-run-source-deploy\nasia-south1"]
        end

        subgraph CLOUDRUN["Cloud Run"]
            SVC["carbonmind-ai service\nRegion: asia-south1\nMemory: 512Mi\nCPU: 1\nScale: 0→3 instances"]
            URL["🌐 Public HTTPS URL\ncarbonmind-ai-*.asia-south1.run.app"]
        end
    end

    SRC -->|"gcloud run deploy\n--source ."| UPLOAD
    UPLOAD --> DOCKER --> IMAGE
    IMAGE -->|"push"| REPO
    REPO -->|"pull & deploy"| SVC
    SVC --> URL

    style DEV fill:#0c120e,stroke:#9ca3af,color:#f3f4f6
    style BUILD fill:#0f1913,stroke:#4285F4,color:#f3f4f6
    style REGISTRY fill:#080b09,stroke:#4285F4,color:#f3f4f6
    style CLOUDRUN fill:#0c120e,stroke:#00f59b,color:#f3f4f6
```

---

## ⚡ Quick Start — Local Development

### Option 1: Open the interactive prototype directly *(no install needed)*

```bash
# Simply open in any browser
start "F:\Carbon Footprint\index.html"
```

> The root `index.html` is a fully interactive, self-contained SPA — no build step required.

---

### Option 2: Run the FastAPI backend locally

**Prerequisites:** Python 3.9+

```bash
# 1. Navigate to the backend directory
cd "F:\Carbon Footprint\backend"

# 2. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. (Optional) Set OpenAI key for live GPT-4o-mini coaching
$env:OPENAI_API_KEY = "your-key-here"

# 5. Start the server
uvicorn app:app --host 0.0.0.0 --port 10000 --reload

# Visit: http://localhost:10000
# API Docs: http://localhost:10000/docs
```

---

### Option 3: Run the React frontend *(requires Node.js 18+)*

```bash
# Navigate to frontend
cd "F:\Carbon Footprint\frontend"

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Visit: http://localhost:3000
```

---

## ☁️ Deploy to GCP Cloud Run

### Prerequisites

- Google Cloud SDK (`gcloud`) installed
- GCP project with billing enabled

### One-Command Deploy

```bash
# 1. Authenticate (if not already logged in)
gcloud auth login

# 2. Set your project
gcloud config set project YOUR_PROJECT_ID

# 3. Enable required APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# 4. Deploy (builds + pushes + deploys in one step — no Docker needed locally)
gcloud run deploy carbonmind-ai \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --quiet
```

### 🔁 Redeploy after changes

```bash
gcloud run deploy carbonmind-ai --source . --region asia-south1 --quiet
```

### 📜 View live logs

```bash
gcloud run services logs read carbonmind-ai --region asia-south1 --limit 50
```

---

## 🔌 API Reference

Base URL: `https://carbonmind-ai-674054017244.asia-south1.run.app`

| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/` | Serves the full interactive web app |
| `GET` | `/api/health` | Health check |
| `GET` | `/leaderboard` | Returns all users ranked by Carbon Score |
| `GET` | `/user/rank/{user_id}` | Get a user's rank and profile |
| `GET` | `/user/badges/{user_id}` | Get a user's unlocked badges |
| `POST` | `/user/sync` | Sync local score to the server |
| `POST` | `/coach/ask` | Get AI carbon intelligence report |
| `GET` | `/docs` | Interactive Swagger API documentation |

#### Example: Ask the AI Coach

```bash
curl -X POST https://carbonmind-ai-674054017244.asia-south1.run.app/coach/ask \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_self",
    "question": "How do I reduce my AC footprint?",
    "lifestyle": {
      "transport_habits": "car_single",
      "diet_pattern": "meat_heavy",
      "electricity_usage": "high",
      "waste_generation": "none"
    }
  }'
```

#### Response structure

```json
{
  "carbon_personality_type": "High Impact Consumer",
  "total_footprint_estimate": "32.0 kg CO₂/day",
  "impact_hotspots": ["Solo car commuting", "High AC load"],
  "top_3_actions": [
    {
      "action": "Switch to Metro Rail",
      "why_it_matters": "Cuts transport footprint by 85%",
      "co2_saving_estimate": "340 kg CO₂ annually",
      "effort_level": "medium"
    }
  ],
  "micro_actions": ["Unplug chargers at night"],
  "future_projection_30_days": "Saves 45 kg CO₂ this month",
  "motivational_insight": "Small shifts carry enormous leverage."
}
```

---

## 🎨 Design System

CarbonMind AI uses a custom **Dark Eco-Tech** design language — a fusion of Apple Health (metrics), Duolingo (gamification), Notion (minimalism), and Tesla Dashboard (telemetry aesthetics).

### Color Palette

| Token | Value | Usage |
|:--|:--|:--|
| `--bg-primary` | `#060907` | Deep ink-green base background |
| `--bg-card` | `rgba(15,25,19,0.55)` | Glassmorphic card background |
| `--accent-neon` | `#00f59b` | Score gauge, badges, progress bars |
| `--accent-warn` | `#ff9f43` | Medium-impact habits, streak flame |
| `--accent-alert` | `#ff4757` | High-impact hotspots, critical alerts |
| `--text-main` | `#f3f4f6` | Primary readable text |
| `--text-muted` | `#9ca3af` | Subtitles, tooltips, labels |

### Typography

- **Display** — `Outfit` — Used for scores, headings, level names
- **Body** — `Inter` — Used for descriptions, labels, chat messages

### Key Components

- **Glass Cards** — `backdrop-filter: blur(16px)` + semi-transparent background
- **Gauge** — Custom SVG arc path with gradient stroke and drop-shadow glow
- **Charts** — Vanilla SVG bar + line charts (no dependencies)
- **Confetti** — Custom canvas particle emitter (no library)

---

## 📁 Project Structure

```
Carbon Footprint/
│
├── 📄 index.html              # Interactive SPA prototype (open directly in browser)
├── 🎨 style.css               # Full design system & glassmorphism styles
├── ⚙️ app.js                  # Carbon calculator, AI coach sim, confetti engine
│
├── 🐳 Dockerfile              # Production container (python:3.11-slim)
├── 🚫 .dockerignore           # Excludes frontend/, venv/, __pycache__
│
├── backend/                   # FastAPI production backend
│   ├── 🐍 app.py              # All endpoints + Master AI Coach engine
│   ├── 📦 requirements.txt    # Python dependencies
│   └── 📖 README.md           # Backend setup & Render deploy guide
│
└── frontend/                  # React + Vite production frontend
    ├── 📄 index.html          # Vite entry point
    ├── ⚙️ vite.config.js      # Vite bundler config
    ├── 📦 package.json        # npm dependencies
    ├── 📖 README.md           # Frontend setup & Vercel deploy guide
    └── src/
        ├── 🚀 main.jsx        # ReactDOM render root
        ├── 🎛️ App.jsx         # State coordinator + route switcher
        ├── 🎨 index.css       # Global CSS design tokens
        └── components/
            ├── 📊 Dashboard.jsx      # Score gauge, habits, trend chart
            ├── 🥧 Breakdown.jsx      # Donut chart, hotspot panel
            ├── 🤖 AICoach.jsx        # Chat interface, report cards
            ├── 🏆 Gamification.jsx   # Badges, levels, leaderboard
            └── 🧭 Navbar.jsx         # Sidebar navigation
```

---

## 🛣️ Roadmap

```mermaid
gantt
    title CarbonMind AI Development Roadmap
    dateFormat  YYYY-MM
    section Phase 1 — Core ✅
    Interactive SPA UI         :done, 2026-05, 1M
    Carbon Calculator Engine   :done, 2026-05, 1M
    AI Coach Simulation        :done, 2026-05, 1M
    Gamification System        :done, 2026-05, 1M
    GCP Cloud Run Deploy       :done, 2026-06, 1M

    section Phase 2 — Intelligence 🔄
    OpenAI GPT-4o Integration  :active, 2026-06, 1M
    Real User Auth (Firebase)  :2026-07, 1M
    Persistent Leaderboard DB  :2026-07, 1M

    section Phase 3 — Scale 🚀
    Mobile App (React Native)  :2026-08, 2M
    Carbon Offset Marketplace  :2026-09, 2M
    Corporate Dashboard Tier   :2026-10, 2M
```

---

<div align="center">

### Built with 🌱 for a greener planet

**Stack:** `FastAPI` · `Vanilla JS` · `React` · `Vite` · `GCP Cloud Run` · `Cloud Build` · `Artifact Registry`

**Designed for:** Urban Indian users making realistic, impactful lifestyle transitions

---

[![Live App](https://img.shields.io/badge/🌐_Open_Live_App-carbonmind--ai.run.app-00f59b?style=for-the-badge)](https://carbonmind-ai-674054017244.asia-south1.run.app)

*Made with ❤️ — CarbonMind AI © 2026*

</div>
