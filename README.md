# 🍛 ChopSense

> A conversational Nigerian food intelligence agent that understands who you are, where you are, and what you're feeling — then tells you exactly where to eat next, in language that sounds like it came from someone who actually lives in Lagos.

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent-FF6B6B.svg)](https://github.com/langchain-ai/langgraph)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg)](https://www.postgresql.org/)
[![pgvector](https://img.shields.io/badge/pgvector-Enabled-4B8BBE.svg)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Redis-7+-DC382D.svg)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [The Problem We Are Solving](#-the-problem-we-are-solving)
- [What ChopSense Is](#-what-chopsense-is)
- [Project Aims and Success Criteria](#-project-aims-and-success-criteria)
- [Key Features](#-key-features)
- [Future Features](#-future-features)
- [Real Life User Workflows](#-real-life-user-workflows)
- [System Architecture](#-system-architecture)
- [The Technology Behind ChopSense](#-the-technology-behind-chopsense)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Frontend](#-frontend)
- [Configuration](#-configuration)
- [Evaluation](#-evaluation)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Overview

ChopSense is a production-grade, context-aware food recommendation agent built specifically for Nigerian users. It does what no existing recommendation system on the market does — it thinks like a knowledgeable Lagos friend who knows the food scene, understands your personality, hears the context of your moment, and gives you an honest, specific, culturally authentic recommendation.

The system runs on a five-stage agentic pipeline that separates fast candidate retrieval from precise relevance ranking, then layers in LLM reasoning and Nigerian cultural adaptation before delivering its response. Every stage is measurable, explainable, and built for production reliability.

ChopSense is not a search engine with a chat wrapper. It is a reasoning agent that processes who you are, where you are, who you are with, what mood you are in, and what occasion you are celebrating — before it says a single word about food.

---

## 🎯 The Problem We Are Solving

Most recommendation systems, even the most sophisticated ones, fail Nigerian users in three fundamental ways.

**They ignore cultural context.** A recommendation engine trained on global data does not know the difference between owambe and a quiet weekday lunch. It does not understand that "correct pepper soup" means something very specific that no amount of keyword matching can capture. It does not know that a restaurant perfect in Lekki may be completely wrong for someone in Surulere. Cultural context is not a feature these systems were designed to carry — and Nigerian users feel that gap every time they use them.

**They fail new users completely.** Collaborative filtering — the backbone of most recommendation systems — requires historical data to function. A new user with no review history gets the same generic popular items everyone else gets. This cold-start problem is especially severe in Nigeria, where most users do not have years of platform history sitting in any single recommendation engine.

**They treat recommendations as a lookup, not a conversation.** Real food decisions are dynamic. "Where should I eat?" means something completely different at 7am on a Monday than it does at 9pm on a Saturday with friends at a birthday celebration. Static recommendation systems cannot capture this dynamism because they process a single query in a single pass. They do not ask follow-up questions. They do not remember what you said two turns ago. They do not adjust when you change your mind mid-conversation.

ChopSense is built from the ground up to solve all three problems simultaneously — with a system that is culturally aware, cold-start resilient, and genuinely conversational.

---

## 🍽 What ChopSense Is

ChopSense is best understood as a highly knowledgeable Lagos foodie friend you can talk to. You describe your situation — where you are, who you are with, what mood you are in, what you feel like eating, how much you want to spend — and it reasons through all of that before telling you exactly where to go and why.

The keyword is *reasons*. ChopSense does not return the first matching result from a database query. It runs a multi-stage pipeline that separates fast candidate retrieval from precise relevance ranking, then passes those ranked results to a large language model that thinks through the user's full context before composing a recommendation that is specific, well-explained, and culturally authentic.

A new user who has never used the system before is onboarded through a short conversational exchange — three smart questions is enough to build a working persona and produce a strong first recommendation. A returning user gets recommendations enriched by their full behavioral history. In both cases the agent adapts its language and references to sound like a natural Nigerian speaker, not a Western AI assistant.

---

## 🎯 Project Aims and Success Criteria

This section defines exactly what the project must achieve and how we measure whether we have succeeded.

### The Aim

To build a recommendation agent that consistently produces accurate, culturally authentic, contextually relevant food recommendations for Nigerian users — and to demonstrate, through measurable evaluation, that it outperforms baseline approaches by a clear margin.

### Success Criteria — How We Know It Works

| Criterion | Target | How We Measure It |
|---|---|---|
| **Ranking Accuracy** | NDCG@10 above 0.65 | Hold out 5 visits per user, evaluate on test split |
| **Cold-Start Recovery** | Within 80% of full-history quality after 3 turns | Wipe history of 20 users, measure post-onboarding recommendations |
| **Cultural Authenticity** | At least 4 out of 5 Nigerian evaluators rate responses as authentic | Structured human evaluation with rubric |
| **Response Quality** | Above 80% relevance rating in human eval | 5-point scale across 50 test queries |
| **System Reliability** | Less than 1% error rate across 1000 test calls | Automated load testing with real personas |
| **Response Latency** | Under 5 seconds end-to-end | Tracked per request from API entry to final response |
| **Pipeline Reproducibility** | Any judge can clone, run, and get results in under 5 minutes | Docker Compose with single command setup |

### What Makes The Project Smart Enough

The intelligence of ChopSense comes from five carefully engineered layers working together. Each layer addresses a specific failure mode of existing systems.

**Layer 1 — Persona Extraction:** Converts raw conversational input into a structured user persona. This layer ensures the system understands what the user actually wants, not just what they typed. It handles vague queries, implicit context, and emotional signals.

**Layer 2 — Vector Retrieval:** Uses semantic embeddings to retrieve restaurants whose meaning matches the user's intent — not just keyword matches. This catches the difference between "I want something heavy" (which implies portion size and Nigerian comfort food) and "I want something light" (which implies salads or lighter international fare).

**Layer 3 — Cross-Encoder Re-ranking:** The 50 candidates retrieved in Layer 2 are re-evaluated as user-restaurant pairs by a cross-encoder model. This joint evaluation catches subtle context fits that bi-encoder retrieval alone cannot. A restaurant that scored high on similarity but is wrong for the occasion gets pushed down here.

**Layer 4 — LLM Reasoning:** The top 10 re-ranked candidates are passed to Claude Sonnet, which reasons over them in natural language. The model considers context the previous layers cannot — implicit social signals, the weight of an occasion, the difference between a first date and a family dinner.

**Layer 5 — Cultural Adaptation:** The reasoning output is refined for Nigerian authenticity. Natural Pidgin where it fits, local food references, neighborhood awareness, conversational warmth. This is the layer that makes responses feel human, not artificial.

Together these five layers ensure that ChopSense is accurate at the database level, intelligent at the reasoning level, and authentic at the language level.

---

## ✨ Key Features

### 🗣️ Conversational Cold-Start Onboarding
New users with zero history are not shown generic popular items. The agent opens a short natural conversation — asking about location, dining context, mood, and budget — and builds a working persona from answers alone. Three turns is enough for a strong first recommendation.

### 🧠 Two-Stage Retrieval and Re-Ranking Pipeline
Stage 1 uses pgvector approximate nearest neighbor search to retrieve 50 candidates in milliseconds. Stage 2 passes those candidates through a cross-encoder re-ranker that evaluates user context and each candidate together as a pair, producing a precise top-10 ranking.

### 🔄 Multi-Turn Conversation Memory
The agent maintains complete session context across every turn using Redis. If a user asks for something cheaper on turn 3, the agent adjusts without losing what was established on turns 1 and 2. Context never resets mid-conversation.

### 🌍 Cross-Domain Recommendations
A single behavioral profile can produce recommendations for restaurants, street food spots, bukas, catering services, food delivery options, and event dining. One user profile, multiple recommendation domains — directly satisfying the cross-domain scoring criteria.

### 🇳🇬 Nigerian Cultural Adaptation Layer
Every response passes through a dedicated cultural processing module. The system understands Pidgin English naturally, references Nigerian food culture authentically, recognizes Lagos neighborhood character, and adapts its tone to match each interaction.

### 📊 Agentic Reasoning Trace
Every recommendation includes a visible chain of thought explaining exactly why the agent picked what it picked, what alternatives it considered, and what tradeoffs it made. This transparency builds user trust and supports the solution paper narrative.

### 🎯 Occasion Intelligence
The agent has specific awareness of Nigerian occasions — business lunch, first date, owambe, NYSC celebration, group hangout, family outing, detty December, burial reception. Each occasion triggers a distinct recommendation strategy.

### 🗺️ Live Map Interface
The frontend renders recommended restaurants as pins on an interactive map that updates in real time. Pins are clickable and show the restaurant card on hover.

### ⚡ Contextual Signal Processing
The agent processes time-of-day, day-of-week, group composition, and location together in every request. A spot perfect on a quiet Tuesday afternoon may be wrong on a busy Friday evening — the agent accounts for this in every recommendation.

### 🎙️ Voice Interface (Frontend Mock — Demo Ready)
A microphone button in the chat interface records user voice input. Currently mocked for live demo purposes, with placeholder slots for pre-recorded Yoruba, Igbo, Hausa, and Pidgin audio. Full speech-to-text and text-to-speech integration is planned in the future features roadmap.

---

## 🚀 Future Features

These represent the next phase of ChopSense — documented in the solution paper under future work and partially scaffolded in the codebase.

### 🎙️ Full Nigerian Language Voice Pipeline
Speech-to-text and text-to-speech for Yoruba, Igbo, Hausa, and Pidgin using Meta's MMS-300M model for African language transcription and Meta's MMS-TTS for response synthesis. Users speak in their native language and hear the response back in the same language. The frontend mock is already in place; backend integration is the next step.

### 🔥 Taste Evolution Tracker
The current system builds a static behavioral profile per user. The next version introduces temporal behavioral modeling — tracking how taste shifts over time and updating the profile automatically as drift is detected.

### 👥 Group Consensus Engine
When multiple users with conflicting preferences dine together, the agent collects all preferences and solves a multi-stakeholder optimization problem to find the single restaurant that best satisfies the whole group.

### 🚦 Real-Time Context Injection
Live integration with external data — Lagos traffic via Google Maps API, current weather, public holiday awareness, real-time restaurant wait times — so recommendations reflect the full real-world context of the moment.

### 🔁 Behavioral Feedback Loop
After a user visits a recommended restaurant and gives feedback, that signal retrains the ranking model continuously. The system becomes more accurate for each user the more they use it.

### 👫 Social Graph Recommendations
Surface recommendations that people in the user's social circle have validated recently. Trust signals from known connections are the strongest recommendation signals in existence.

### ❌ Anti-Recommendation Engine
A permanent cross-session exclusion list built from explicit complaints. Once a user has expressed dissatisfaction with a restaurant, it never appears in their recommendations again — regardless of overall popularity.

### 🏙️ Neighbourhood Persona Engine
Lagos neighborhoods have distinct personalities — Lekki is different from Yaba which is different from Surulere. This engine builds neighborhood-aware recommendation strategies reflecting the character of each area.

---

## 👤 Real Life User Workflows

These three stories show how the system handles different real-world scenarios — from a brand new user to a returning power user.

### Story 1 — Tunde: The Cold-Start User

Tunde just relocated to Lagos from Abuja. He opens ChopSense for the first time. The system knows absolutely nothing about him.

The agent welcomes him warmly and asks where he is and what he feels like eating. Tunde says he is in Lekki Phase 1, very hungry, and on a tight budget. The agent immediately extracts three signals — location, hunger intensity, price sensitivity — and asks one follow-up about whether he is eating alone.

Tunde says he is alone. That is enough. The agent reasons through his location, solo dining context, budget constraint, and hunger level — filters for affordable, filling, nearby options — and returns two specific recommendations with explanations in natural Nigerian English.

First interaction. Zero history. The recommendation already feels personal and local.

### Story 2 — Adaeze: The Returning User

Adaeze has used ChopSense before. The system knows she is mostly vegetarian, prefers calm environments, and works in Victoria Island.

On a Wednesday at 1pm she opens the app and says: *"I have a lunch meeting with a client visiting from London, somewhere nice in VI, not too loud."* The agent processes her existing profile alongside the new contextual signals — business meeting, international guest, professional setting, her known sensitivity to noise — and reasons that this occasion overrides her casual preferences.

It recommends a specific upscale restaurant with a note to call ahead, plus a backup option. Adaeze books immediately. Total interaction time: under 30 seconds. The agent logs the business dining context to her profile for future enrichment.

### Story 3 — Chukwuemeka: The Multi-Turn Power User

Chukwuemeka wants to plan a special anniversary dinner. He tells the agent the occasion. The agent asks about budget, location, and food preferences. He says his girlfriend loves seafood, they can travel from Ikeja, and the budget is ₦30-40k for two.

The agent reasons through the occasion weight, seafood preference, budget range, and willingness to travel — and recommends a waterfront restaurant in Victoria Island. Chukwuemeka asks if there is somewhere with a rooftop. The agent does not restart the conversation. It adjusts within the existing context and surfaces two rooftop alternatives with a comparison. Chukwuemeka picks Cova. Done.

Three turns. Complete context maintained throughout. Each follow-up refined the recommendation without losing what was established before.

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND                             │
│  Chat interface (left)  +  Live Leaflet.js map (right)            │
│  Voice input (mocked)   +  Restaurant cards rendered inline       │
└─────────────────────────┬────────────────────────────────────────┘
                          │ HTTP / WebSocket
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND                             │
│   POST /recommend   |   POST /recommend/chat   |   GET /health   │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  LANGGRAPH AGENT STATE MACHINE                    │
│                                                                   │
│   [understand_user]                                               │
│         │                                                         │
│         ▼                                                         │
│   [retrieve_candidates]  ←─── pgvector Stage 1 (top 50)           │
│         │                                                         │
│         ▼                                                         │
│   [rerank]               ←─── CrossEncoder Stage 2 (top 10)       │
│         │                                                         │
│         ▼                                                         │
│   [reason_and_respond]   ←─── Claude Sonnet                       │
│         │                                                         │
│         ▼                                                         │
│   [nigerianize]          ←─── Cultural adaptation                 │
└─────────────────────────┬────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌───────────────┐  ┌───────────────┐
│  PostgreSQL  │  │     Redis     │  │ Claude Sonnet │
│  + pgvector  │  │   (session    │  │  (reasoning + │
│  (restaurant │  │     cache)    │  │  generation)  │
│   catalogue) │  └───────────────┘  └───────────────┘
└──────────────┘
```

---

## 🔬 The Technology Behind ChopSense

This section explains, in plain language, what each technology does and why it was chosen. This is what makes the project accurate and smart.

### Sentence Transformer Embeddings — How The System "Understands" Restaurants

Every restaurant in the database is converted into a 768-dimensional vector using the `all-mpnet-base-v2` model. This vector is a mathematical representation of what the restaurant *means* — its cuisine, atmosphere, price level, the kind of experience it offers. When a user describes what they want, their query is converted into a vector the same way, and the system finds restaurants whose meaning is closest to the user's intent. This is why ChopSense understands "somewhere chill for vibes" without needing those exact words to appear in any restaurant description.

### pgvector — Production-Grade Semantic Search

We use PostgreSQL with the pgvector extension instead of a dedicated vector database. This was a deliberate choice: it lets us combine structured filters (price range, city, minimum rating) with semantic vector search in a single SQL query. This is significantly more accurate than retrieving candidates by vector similarity and then filtering them afterward, because filters apply before ranking — not after.

### Cross-Encoder Re-Ranking — The Precision Layer

After the initial vector search returns 50 candidates, those candidates are re-evaluated by a cross-encoder model (`cross-encoder/ms-marco-MiniLM-L-6-v2`). The crucial difference is that the cross-encoder looks at the user context AND each restaurant *together* as a single input — not separately. This joint evaluation catches subtle fit issues that vector similarity alone misses. It is computationally more expensive, but it only runs on 50 items so the speed cost is negligible, while the accuracy gain is significant.

### LangGraph — Why The Agent Has Explicit Stages

The agent is built as a LangGraph state machine — not as a single LLM call wrapped in a function. Each stage of reasoning is an explicit, typed node with a clear input and output. This means we can: see exactly where in the pipeline a failure happens, swap out individual nodes for ablation studies, run only part of the pipeline for testing, and explain every step clearly in the solution paper. Most hackathon teams treat the agent as a black box. We treat it as engineered software.

### Claude Sonnet — Why This Specific Model

We use Claude Sonnet (`claude-sonnet-4-20250514`) for the reasoning and generation layers. It was chosen over alternatives for three reasons: it produces more natural conversational tone than GPT-3.5/4, it follows structured output instructions more reliably than open-source alternatives, and it handles cultural and linguistic nuance better than most models we tested when prompted to write in Nigerian English.

### Redis — Conversation Memory

Every conversation session is stored in Redis with a configurable TTL (default 1 hour). This is what allows the agent to maintain context across multiple API calls. When a user says "actually, somewhere cheaper" on turn 3, Redis has the full context from turns 1 and 2 instantly accessible — no database query, no re-parsing, no context loss.

### Two-Stage Retrieval Architecture — The Performance/Accuracy Tradeoff

The two-stage architecture exists because there is a fundamental tradeoff in recommendation systems: fast methods are imprecise, precise methods are slow. Stage 1 uses a fast approximate method to narrow down millions of possible options to 50 reasonable candidates in milliseconds. Stage 2 uses a slow precise method to re-evaluate those 50 candidates carefully. This is exactly how Google Search, Netflix, and Spotify recommendation systems work in production. It gives the best of both worlds.

### Docker Compose — Why Everything Runs Together

The entire system — API, database, cache, frontend — runs through a single Docker Compose command. This is not just for convenience. It means any judge or engineer can clone the repo and have the full system running in under 5 minutes, with no environment setup. This directly affects the Code Reproducibility scoring criterion.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **LLM** | Claude Sonnet (`claude-sonnet-4-20250514`) | User intent parsing, candidate reasoning, response generation |
| **Embeddings** | `sentence-transformers/all-mpnet-base-v2` | Semantic representation of restaurants and user context |
| **Re-Ranking** | `cross-encoder/ms-marco-MiniLM-L-6-v2` | Joint relevance scoring of user-candidate pairs |
| **Vector Database** | PostgreSQL 16 + pgvector | Structured filtering and semantic search in one query |
| **Session Cache** | Redis 7 | Multi-turn conversation context persistence |
| **Agent Framework** | LangGraph | Graph-based agentic workflow with typed state transitions |
| **API Framework** | FastAPI + Pydantic v2 | Typed, validated REST endpoints with auto-generated docs |
| **Frontend** | React 18 + Vite + Tailwind CSS | Conversational chat interface with live map |
| **Map** | Leaflet.js + OpenStreetMap | Real-time restaurant pinning on an interactive map |
| **Voice Recording** | MediaRecorder API | Browser-native audio capture for the voice input mock |
| **Containerization** | Docker + Docker Compose | Full system orchestration in one command |
| **Evaluation** | NDCG@10, Hit Rate, BERTScore | Offline ranking quality and relevance measurement |
| **Data** | Yelp Open Dataset (Parquet) | Restaurant catalogue and user review history |

---

## 📁 Project Structure

```
chopsense/
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI application entrypoint
│   ├── config.py                     # Settings from environment variables
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── graph.py                  # LangGraph state machine definition
│   │   ├── state.py                  # Typed agent state schema
│   │   └── nodes/
│   │       ├── __init__.py
│   │       ├── understand.py         # User intent and context extraction
│   │       ├── retrieve.py           # pgvector candidate generation
│   │       ├── rerank.py             # CrossEncoder re-ranking
│   │       ├── reason.py             # LLM reasoning over candidates
│   │       └── nigerianize.py        # Nigerian cultural adaptation
│   ├── db/
│   │   ├── __init__.py
│   │   ├── postgres.py               # pgvector queries and connection pool
│   │   ├── redis.py                  # Session state management
│   │   └── migrations/
│   │       └── 001_initial.sql       # Schema with pgvector setup
│   ├── embeddings/
│   │   ├── __init__.py
│   │   └── encoder.py                # Sentence transformer utilities
│   └── schemas/
│       ├── __init__.py
│       ├── request.py                # Pydantic input models
│       └── response.py               # Pydantic output models
├── frontend/
│   ├── public/
│   │   └── audio/                    # Pre-recorded demo audio slots
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx              # Main conversational interface
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── MapView.jsx           # Leaflet.js live map
│   │   │   ├── VoiceInput.jsx        # Microphone recording (mock)
│   │   │   ├── LanguageSelector.jsx  # Yoruba / Igbo / Hausa / Pidgin
│   │   │   └── QuickActions.jsx      # Contextual suggestion buttons
│   │   ├── hooks/
│   │   │   └── useChat.js            # Chat state and API integration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── data/
│   └── pipeline.py                   # Yelp dataset processing
├── scripts/
│   └── embed_businesses.py           # One-time business embedding script
├── evaluation/
│   ├── __init__.py
│   ├── ndcg.py                       # NDCG@10 and Hit Rate metrics
│   ├── cold_start.py                 # Cold-start performance evaluation
│   └── human_eval.py                 # Human evaluation framework
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   ├── test_agent.py
│   ├── test_retrieval.py
│   ├── test_reranking.py
│   └── test_nigerianize.py
├── notebooks/
│   └── 01_recommendation_exploration.ipynb
├── .env.example
├── .gitignore
├── .pre-commit-config.yaml
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.frontend
├── requirements.txt
├── requirements-dev.txt
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- Anthropic API key from https://console.anthropic.com

### Option A — Run With Docker (Recommended)

This spins up the full system — API, PostgreSQL with pgvector, Redis, and the React frontend — in a single command.

```bash
# 1. Clone the repository
git clone https://github.com/your-org/chopsense.git
cd chopsense

# 2. Configure environment
cp .env.example .env
# Edit .env and fill in your API keys

# 3. Build and start all services
docker-compose up --build

# 4. Embed the restaurant catalogue (first time only)
docker-compose exec api python -m scripts.embed_businesses

# 5. Access the services
# Frontend:  http://localhost:3000
# API Docs:  http://localhost:8000/docs
```

### Option B — Run Locally for Development

```bash
# 1. Set up Python environment
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

# 2. Start infrastructure only
docker-compose up db redis -d

# 3. Run migrations and embed businesses
python -m app.db.migrations
python -m scripts.embed_businesses

# 4. Start the API
uvicorn app.main:app --reload --port 8000

# 5. Start the frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

---

## 📡 API Documentation

### `POST /recommend`

Single-turn endpoint. Returns ranked recommendations immediately from a complete persona.

**Request:**

```json
{
  "persona": {
    "location": "Lekki Phase 1, Lagos",
    "group_size": 1,
    "budget_ngn": 3000,
    "mood": "very hungry, want something filling",
    "occasion": "quick solo lunch",
    "cuisine_preferences": ["Nigerian"],
    "dietary_restrictions": []
  }
}
```

**Response:**

```json
{
  "recommendations": [
    {
      "rank": 1,
      "name": "Mama Cass",
      "category": "Nigerian",
      "address": "Admiralty Way, Lekki Phase 1",
      "price_range": "₦₦",
      "rating": 4.3,
      "why_picked": "Affordable filling portions, walking distance, strong match for solo lunch.",
      "coordinates": { "lat": 6.4395, "lng": 3.4759 },
      "confidence": 0.91
    }
  ],
  "agent_response": "For a quick solo lunch in Lekki Phase 1, Mama Cass on Admiralty Way is your best bet — affordable, filling, and walking distance from you.",
  "reasoning_trace": "User is solo, price-sensitive, very hungry, in Lekki Phase 1...",
  "total_candidates_evaluated": 50
}
```

### `POST /recommend/chat`

Multi-turn conversational endpoint. Maintains session context across turns via `session_id`.

```json
{
  "session_id": "session_001",
  "message": "Actually, is there somewhere with a rooftop?"
}
```

### `GET /health`

```json
{ "status": "ok", "version": "1.0.0", "environment": "production" }
```

---

## 🖥 Frontend

The frontend is a React single-page application with a split-panel layout.

**Left Panel — Conversation Interface**
WhatsApp-style chat where the user types or speaks naturally and the agent responds conversationally. Restaurant recommendations render as rich cards directly inside the chat — each showing name, cuisine, price range, rating, distance, and the agent's specific reason for choosing it.

**Right Panel — Live Map**
Leaflet.js interactive map that pins each recommended restaurant in real time as the agent responds.

**Voice Input (Mock)**
A microphone button below the chat input. Tap to record voice in the browser using MediaRecorder API. Pre-recorded demo audio slots are available for live presentations in Yoruba, Igbo, Hausa, and Pidgin.

**Bottom Bar — Quick Actions**
Contextual buttons that appear dynamically: *"Show cheaper options"*, *"Filter for vegetarian"*, *"I'm in a different area"*, *"What about delivery?"*

**Design Language**
Deep navy background with warm gold and forest green accents. Confident, modern, distinctly Nigerian.

---

## ⚙ Configuration

All settings are managed through the `.env` file. Copy `.env.example` and fill in your values.

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude Sonnet API access key |
| `DATABASE_URL` | ✅ | Full PostgreSQL connection string |
| `REDIS_URL` | ✅ | Full Redis connection string |
| `LLM_MODEL` | ✅ | Claude model identifier |
| `EMBEDDING_MODEL` | ✅ | Sentence transformer model |
| `RERANKER_MODEL` | ✅ | Cross-encoder model |
| `RETRIEVAL_TOP_K` | ✅ | Stage 1 candidate count (default 50) |
| `RERANK_TOP_N` | ✅ | Final recommendations count (default 10) |
| `SESSION_TTL_SECONDS` | ✅ | Redis session expiry (default 3600) |
| `ENABLE_CULTURAL_LAYER` | ✅ | Toggle Nigerian adaptation layer |
| `ENABLE_REASONING_TRACE` | ✅ | Include reasoning in API response |

See `.env.example` for the complete annotated list.

---

## 📊 Evaluation

ChopSense is evaluated on four dimensions aligned with the competition scoring rubric.

### Ranking Quality — NDCG@10 and Hit Rate (30 pts)

```bash
python -m evaluation.ndcg --split test --k 10
```

### Cold-Start Evaluation (25 pts)

```bash
python -m evaluation.cold_start --users 20 --turns 3
```

### Human Evaluation — Contextual Relevance (20 pts)

```bash
python -m evaluation.human_eval --export results/human_eval.csv
```

### Run Full Evaluation Suite

```bash
python -m evaluation.run_all --output results/
```

---

## 🤝 Contributing

### Workflow

1. Branch from `develop` — never commit directly to `main`
2. Naming: `feature/<name>`, `fix/<name>`, `docs/<name>`
3. Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
4. All PRs require at least one team review
5. Run `black .` and `flake8` before every commit

### Development Setup

```bash
pip install -r requirements-dev.txt
pre-commit install
```

### Running Tests

```bash
pytest tests/ -v --cov=app --cov-report=html
```

---

## 👥 Team

| Name | Role | Contact |
|---|---|---|
| _Add your name_ | Project Lead / ML Engineer | _email_ |
| _Add team member_ | Backend + Agent Engineer | _email_ |
| _Add team member_ | Data Engineer | _email_ |
| _Add team member_ | Frontend Engineer | _email_ |

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgments

- Yelp for the open dataset used for training and evaluation
- Anthropic for the Claude API powering the reasoning layers
- The sentence-transformers community for the embedding and cross-encoder models
- The open-source ML community for LangGraph, FastAPI, pgvector, Redis, and every tool that made this system possible

---

<p align="center">
  <strong>Built for Nigeria. Powered by intelligence. Designed for the way Nigerians actually eat.</strong>
</p>
