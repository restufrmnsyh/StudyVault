# StudyVault

> Your Academic Knowledge, Organized in One Place.

A modern Academic Knowledge Hub designed for university students to organize courses, lecture notes, learning materials, tasks, and study planning in one unified workspace.

![Status](https://img.shields.io/badge/Status-Beta-yellow)
![Version](https://img.shields.io/badge/Version-v0.7.1-blue)
![License](https://img.shields.io/badge/License-Educational-green)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)
- [Future Features](#future-features)
- [Author](#author)
- [License](#license)

---

## Features

### 🔐 Authentication
- Secure Sign In / Sign Up
- Supabase Authentication
- Session Management
- Protected Routes
- Sign Out

### 📊 Dashboard
- Dynamic Hero Section
- Overview Cards
- Today's Focus
- Upcoming Deadlines
- Recent Activity
- Continue Learning
- Recent Notes
- Quick Actions

### 📚 Courses
- Create, Edit, Delete Courses
- Favorite & Archive Courses
- Course Detail Pages
- Course-based Notes
- Course Materials
- Related Tasks

### 📝 Notes
- Rich Note Management
- Create, Edit, Delete Notes
- Favorite & Archive Notes
- Course-based Organization
- Related Tasks & Materials
- Note Detail Pages
- Rich Content Protection Warning

### 📁 Materials
- File Upload with Type Detection
- Supported Formats:
  - PDF (with preview)
  - Images (with preview)
  - Word Documents
  - PowerPoint Presentations
  - Excel Spreadsheets
  - ZIP Archives
- Download, Replace & Delete Files

### 📅 Planner
- Task Management
- Due Dates & Priority Levels
- Checklist & Progress Tracking
- Upcoming Deadlines
- Task Detail Pages
- Related Notes & Resources

### 🔎 Global Search
- Search across Courses, Notes, Materials, Tasks
- Smart Result Ranking
- Keyword Highlighting
- Recent Searches
- Keyboard Shortcuts (`Ctrl + K` / `Cmd + K`)
- Arrow Key Navigation
- Escape to Close

### ⚙️ Settings & Profile
- View & Edit Profile
- Update Major & Semester
- Account Information
- Appearance Preferences
- Sign Out

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Backend | Supabase |
| Database | PostgreSQL |
| Storage | Supabase Storage |
| Authentication | Supabase Auth |
| Icons | Lucide React |

---

## Architecture

StudyVault follows a layered architecture pattern:

```
Components
    ↓
Query Hooks
    ↓
Services
    ↓
Supabase
```

This separation ensures clean code organization and maintainability.

---

## Project Structure

```
src/
├── components/
│   ├── common/
│   ├── courses/
│   ├── dashboard/
│   ├── landing/
│   ├── notes/
│   ├── planner/
│   ├── profile/
│   ├── search/
│   └── ui/
├── hooks/
│   ├── queries/
│   ├── useDebounce.ts
│   ├── useGlobalSearch.ts
│   └── useRecentSearches.ts
├── pages/
│   ├── DashboardPage.tsx
│   ├── CoursesPage.tsx
│   ├── CourseDetailPage.tsx
│   ├── NotesPage.tsx
│   ├── NoteDetailPage.tsx
│   ├── PlannerPage.tsx
│   ├── TaskDetailPage.tsx
│   └── SettingsPage.tsx
├── services/
├── utils/
│   ├── search.utils.ts
│   └── highlight.utils.ts
├── types/
├── lib/
└── assets/
```

---

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/restufrmnsyh/StudyVault.git
cd StudyVault
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Build for production:**
```bash
npm run build
```

6. **Run linting:**
```bash
npm run lint
```

---

## Roadmap

### ✅ Completed

- **v0.1** - Foundation (React + Vite setup, Tailwind CSS)
- **v0.2** - Landing Experience (Landing Page, Responsive Design)
- **v0.3** - Dashboard (Foundation, Layout, Core Widgets)
- **v0.4** - Authentication (Supabase Auth, Protected Routes)
- **v0.5** - Academic Workspace (Courses, Notes, Materials, Planner)
- **v0.6** - Dashboard & Knowledge Management (Dynamic Dashboard, Material Preview, Relationships)
- **v0.7** - Beta Experience (Global Search, Keyboard Navigation, Settings, UX Fixes)

### 📅 Planned

- **v0.8** - Polish & Insights
  - Progress Analytics
  - Calendar View
  - Dashboard Enhancements
  - Material Upload Progress

- **v0.9** - Smart Learning
  - AI Study Assistant
  - AI Note Summary
  - AI Quiz Generator

- **v1.0** - Production Release
  - Production-Ready Release
  - Stability Improvements
  - Final UX Polish
  - Performance Optimization

---

## Future Features

- 📊 Progress Analytics
- 📅 Calendar View
- 📚 Advanced Study Planning
- 📤 Material Upload Progress
- 🎨 Theme Switching
- 📧 Email Change Flow
- 👤 Avatar Upload
- 👥 Study Groups
- 🤖 AI Study Assistant
- 📝 AI Note Summary
- ❓ AI Quiz Generator
- 💡 Smart Study Recommendations
- 🔔 Notifications

---

## Recent Improvements (Beta QA)

- Removed non-functional notification controls
- Avatar now provides direct access to Settings
- Removed placeholder actions with no functionality
- Added warnings before editing rich-formatted notes
- Improved empty state actions
- Enhanced navigation consistency
- Optimized Global Search experience

---

## Vision

StudyVault aims to become the complete Academic Knowledge Hub where students can manage every aspect of their learning journey—from courses and lecture materials to notes, task planning, and knowledge organization.

**Goal:** Spend less time organizing academic information and more time learning.

---

## Author

**Muhammad Restu Firmansyah**

- Informatics Student
- UPN "Veteran" Yogyakarta
- GitHub: [@restufrmnsyh](https://github.com/restufrmnsyh)

---

## License

This project is developed for educational and portfolio purposes.

© 2026 Muhammad Restu Firmansyah. All rights reserved.

---

**Current Version:** v0.7.1 (Beta)  
**Last Updated:** August 2026
