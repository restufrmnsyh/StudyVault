# 📚 StudyVault

> **Your Academic Knowledge, Organized in One Place.**

StudyVault is a modern Academic Knowledge Hub built for university students to organize courses, lecture notes, learning materials, and study planning in one unified workspace.

Designed with a clean UI, powerful organization tools, and scalable architecture, StudyVault helps students focus on learning instead of managing scattered files.

---

## 🚀 Project Status

**Version:** `v0.6.6`

**Status:** 🚧 Active Development

**Current Sprint:** `Sprint 7.0 — Global Search`

---

# ✨ Features

## ✅ Authentication

- Secure Sign In / Sign Up
- Session Management
- Protected Routes

---

## ✅ Dashboard

A personalized dashboard powered by real Supabase data.

Features include:

- Dynamic Hero
- Overview Cards
- Today's Focus
- Upcoming Deadlines
- Recent Activity
- Continue Learning

---

## ✅ Courses

- Create Course
- Edit Course
- Delete Course
- Favorite Course
- Archive Course
- Course Detail Page

---

## ✅ Notes

- Rich Note Management
- Create / Edit / Delete
- Favorite Notes
- Archive Notes
- Course-based Notes

---

## ✅ Materials

- Upload Files
- PDF Preview
- Image Preview
- Download Files
- Replace Files
- Delete Materials

Supported formats:

- PDF
- Images
- Word
- PowerPoint
- Excel
- ZIP

---

## ✅ Planner

- Task Management
- Due Dates
- Priorities
- Checklist
- Progress Tracking
- Upcoming Deadlines
- Today's Focus Integration

---

## ✅ Profile

- User Profile
- Semester
- Major
- Avatar
- Personal Information

---

## 🚧 Currently Building

- Global Search
- Dashboard Polish

---

## 🔮 Future Features

- Progress Analytics
- Calendar View
- Study Groups
- AI Study Assistant
- AI Note Summary
- AI Quiz Generator
- Notifications

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
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

# 🏗 Architecture

StudyVault follows a layered architecture.

```
Components
      │
      ▼
Query Hooks
      │
      ▼
Services
      │
      ▼
Supabase
```

Business logic is separated from UI to keep components reusable and maintainable.

---

# 📂 Project Structure

```text
src/
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── courses/
│   ├── notes/
│   ├── planner/
│   ├── profile/
│   ├── landing/
│   └── ui/
│
├── hooks/
│   └── queries/
│
├── services/
│
├── utils/
│
├── pages/
│
├── types/
│
├── lib/
│
└── assets/
```

---

# 📷 Screenshots

Coming soon.

- Landing Page
- Dashboard
- Courses
- Course Detail
- Notes
- Planner
- Profile
- Mobile View

---

# 🗺 Roadmap

## v0.1
- ✅ Project Setup
- ✅ React + Vite
- ✅ Tailwind CSS

## v0.2
- ✅ Landing Page
- ✅ Responsive Design

## v0.3
- ✅ Dashboard Foundation

## v0.4
- ✅ Authentication
- ✅ User Profile

## v0.5
- ✅ Supabase Integration
- ✅ Courses
- ✅ Notes
- ✅ Materials
- ✅ Planner

## v0.6
- ✅ Dynamic Dashboard
- ✅ Material Preview
- ✅ Material Download

## v0.7
- 🚧 Global Search

## v0.8
- 📅 Progress Tracking

## v0.9
- 📅 Planner Enhancement

## v1.0
- 🚀 Production Release

---

# ⚙️ Getting Started

Clone the repository

```bash
git clone https://github.com/restufrmnsyh/StudyVault.git
```

Go to the project directory

```bash
cd StudyVault
```

Install dependencies

```bash
npm install
```

Create an environment file

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Run development server

```bash
npm run dev
```

Build production

```bash
npm run build
```

---

# 🎯 Vision

StudyVault aims to become a complete Academic Knowledge Hub where students can manage every aspect of their learning journey—from lecture materials and notes to planning, organization, and future AI-powered learning assistance.

---

# 👨‍💻 Author

**Muhammad Restu Firmansyah**

Informatics Student

UPN "Veteran" Yogyakarta

GitHub

https://github.com/restufrmnsyh

---

# 📄 License

This project is developed for educational and portfolio purposes.

Copyright © 2026 Muhammad Restu Firmansyah.
