# 🎓 OctoStudy - AI-Powered Spaced Repetition Learning Platform

<div align="center">

![OctoStudy Banner](https://img.shields.io/badge/OctoStudy-AI%20Learning-4F46E5?style=for-the-badge&logo=graduation-cap)

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Transform your notes into personalized micro-lessons with AI-powered spaced repetition**

[Live Demo](https://octostudy.vercel.app) • [Report Bug](https://github.com/yourusername/octostudy/issues) • [Request Feature](https://github.com/yourusername/octostudy/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

OctoStudy is a modern, AI-powered learning platform that helps students master any subject through:

- **AI-Generated Micro-Lessons**: Automatically converts your study materials into bite-sized lessons
- **Spaced Repetition System (SRS)**: Scientific algorithm optimizes review timing for maximum retention
- **Active Recall Quizzes**: MCQ and short-answer questions test your understanding
- **Progress Tracking**: Detailed analytics and visualizations of your learning journey
- **Pomodoro Timer**: Built-in focus timer to maintain concentration

### 🎯 Perfect For:
- Students preparing for exams
- Professionals learning new skills
- Anyone wanting to retain information efficiently

---

## ✨ Features

### 🤖 AI-Powered Content Generation
- Import from text, URLs, or PDFs
- Automatically generates 3 micro-lessons per content
- Creates 2 MCQ + 1 short answer question per lesson
- Intelligent content summarization

### 🧠 Spaced Repetition (SM-2 Algorithm)
- Scientifically proven retention optimization
- Adaptive scheduling based on performance
- Easiness factor calculation for each card
- Smart interval adjustment

### 📊 Comprehensive Analytics
- Review accuracy tracking
- Daily streak counter
- Activity heatmaps
- Performance trends over 30 days

### 🎨 Modern UI/UX
- Dark/Light theme support
- Responsive design (mobile-first)
- Smooth animations and transitions
- Accessible components (ARIA compliant)

### ⚡ Performance Optimized
- Server-side rendering with Next.js 16
- Efficient database queries with Supabase
- Edge-optimized API routes
- Lazy loading and code splitting

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: React Hooks
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes (Server Actions)
- **File Storage**: Supabase Storage (future)

### AI/ML
- **LLM Provider**: OpenRouter
- **Model**: DeepSeek R1 Chimera
- **SRS Algorithm**: SM-2 Implementation

### DevOps
- **Hosting**: Vercel
- **CI/CD**: Vercel Git Integration
- **Analytics**: Vercel Analytics
- **Monitoring**: Vercel Logs

---

## 📁 Project Structure

```
octostudy/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── due/                  # Fetch due cards
│   │   ├── generate/             # Generate lessons from content
│   │   ├── import/               # Import content
│   │   ├── progress/             # User progress stats
│   │   └── review/               # Submit card reviews
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   └── sign-up-success/
│   ├── dashboard/                # Main dashboard
│   ├── generate/[contentId]/     # Lesson generation page
│   ├── import/                   # Content import page
│   ├── progress/                 # Progress analytics page
│   ├── study/                    # Study session page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (40+ components)
│   ├── generate-lessons.tsx      # Lesson generation UI
│   ├── import-form.tsx           # Content import form
│   ├── navbar.tsx                # Navigation bar
│   ├── pomodoro-timer.tsx        # Focus timer
│   ├── progress-dashboard.tsx    # Analytics dashboard
│   ├── quiz-card.tsx             # Quiz question card
│   ├── study-session.tsx         # Study session manager
│   └── theme-provider.tsx        # Theme context
│
├── lib/                          # Utilities & Logic
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   ├── __tests__/                # Unit tests
│   │   └── srs.test.ts
│   ├── llm.ts                    # LLM integration
│   ├── srs.ts                    # Spaced repetition algorithm
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Helper functions
│
├── hooks/                        # Custom React Hooks
│   ├── use-mobile.ts             # Mobile detection
│   └── use-toast.ts              # Toast notifications
│
├── scripts/                      # Database Scripts
│   └── 001_initial_schema.sql   # Database schema
│
├── public/                       # Static Assets
│   ├── icon.svg
│   ├── icon-light-32x32.png
│   └── icon-dark-32x32.png
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── components.json               # shadcn/ui config
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── proxy.ts                      # Supabase middleware
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8.0 or higher (Recommended) or npm/yarn
- **Git**: Latest version ([Download](https://git-scm.com/))

```bash
# Check versions
node --version  # Should be v18+
pnpm --version  # Should be v8+
git --version
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/octostudy.git
cd octostudy
```

2. **Install dependencies**

```bash
# Using pnpm (recommended)
pnpm install

# OR using npm
npm install

# OR using yarn
yarn install
```

### Environment Setup

1. **Copy environment template**

```bash
cp .env.example .env.local
```

2. **Configure environment variables**

Open `.env.local` and fill in the required values:


#### 📝 Getting API Keys:

**Supabase Setup:**

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (or select existing)
3. Go to **Settings** → **API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

**OpenRouter Setup:**

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up and create an account
3. Navigate to **API Keys**
4. Generate new API key → `OPENROUTER_API_KEY`
5. Add credits to your account (required for API usage)

### Database Setup

1. **Connect to Supabase**

In Supabase Dashboard:
- Go to **SQL Editor**
- Click **New Query**

2. **Run the schema script**

Copy the contents of `scripts/001_initial_schema.sql` and execute it in the SQL Editor.

This will create:
- ✅ Tables: profiles, contents, lessons, cards, reviews
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers and functions

3. **Verify setup**

Go to **Table Editor** and confirm all tables are created:
- `profiles`
- `contents`
- `lessons`
- `cards`
- `reviews`

---

## 💻 Running Locally

### Development Server

```bash
# Start development server
pnpm dev

# Server will start at http://localhost:3000
```

### Build for Production

```bash
# Create production build
pnpm build

# Run production server
pnpm start
```

### Run Tests

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click **New Project**
- Import your GitHub repository
- Configure environment variables (same as `.env.local`)
- Click **Deploy**

3. **Configure Environment Variables**

In Vercel Dashboard:
- Go to **Settings** → **Environment Variables**
- Add all variables from `.env.local`
- Click **Save**

4. **Redeploy**

- Vercel will automatically redeploy on git push
- Or manually trigger deployment from dashboard

### Deploy to Other Platforms

<details>
<summary><b>Deploy to Netlify</b></summary>

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
pnpm build
netlify deploy --prod
```

3. Set environment variables in Netlify Dashboard
</details>

<details>
<summary><b>Deploy to Railway</b></summary>

1. Go to [Railway](https://railway.app/)
2. Create new project from GitHub repo
3. Add environment variables
4. Deploy automatically
</details>

<details>
<summary><b>Deploy with Docker</b></summary>

```bash
# Build image
docker build -t octostudy .

# Run container
docker run -p 3000:3000 --env-file .env.local octostudy
```
</details>

---

## 📚 API Documentation

### Authentication

All API routes require authentication via Supabase session cookie.

### Endpoints

#### `POST /api/import`
Import new study content.

**Request Body:**
```json
{
  "title": "Biology Chapter 3",
  "sourceType": "text",
  "text": "Content here...",
  "url": null
}
```

**Response:**
```json
{
  "contentId": "uuid",
  "message": "Content imported successfully"
}
```

#### `POST /api/generate`
Generate AI lessons from content.

**Request Body:**
```json
{
  "contentId": "uuid"
}
```

**Response:**
```json
{
  "message": "Lessons generated successfully",
  "lessonIds": ["uuid1", "uuid2", "uuid3"],
  "lessonsCreated": 3,
  "cardsCreated": 9
}
```

#### `GET /api/due`
Fetch cards due for review.

**Response:**
```json
{
  "cards": [...],
  "count": 10
}
```

#### `POST /api/review`
Submit a card review.

**Request Body:**
```json
{
  "cardId": "uuid",
  "correct": true,
  "confidence": "medium"
}
```

**Response:**
```json
{
  "message": "Review recorded successfully",
  "nextDue": "2024-01-15T10:00:00Z",
  "interval": 6
}
```

#### `GET /api/progress`
Get user progress statistics.

**Response:**
```json
{
  "totalCards": 50,
  "dueToday": 10,
  "accuracy": 85,
  "streak": 7,
  "totalReviews": 200,
  "activityData": [...]
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test srs.test.ts

# Run with coverage
pnpm test --coverage
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Content import (text, URL)
- [ ] AI lesson generation
- [ ] Study session flow
- [ ] Card review and SRS updates
- [ ] Progress dashboard display
- [ ] Dark/light theme toggle
- [ ] Mobile responsiveness

---


### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Write tests for new features
- Update documentation as needed

---



## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [OpenRouter](https://openrouter.ai/) - LLM API
- [Vercel](https://vercel.com/) - Hosting platform

