# Netra AI Workflow — Claude Instructions

## Project Overview
This is the **Netra AI Workflow** app — a Next.js 16 application for AI-powered social media content creation and scheduling. It lets users generate captions and images, schedule posts, and manage multiple platforms (Instagram, etc.).

## GitHub Repository
- **Remote:** https://github.com/NetraAI-Services/netra-ai-workflow.git
- **Branch:** master
- **Auto-push:** Enabled — every Claude session automatically commits and pushes changes to GitHub when the conversation ends.

## How to Run Locally
```bash
cd "c:/Users/62878/Desktop/Netra AI Workflow/netra-ai-workflow"
npm run dev
# Open http://localhost:3000
```

## Key Folders
- `src/app/(app)/` — All main app pages (dashboard, create, analytics, calendar, etc.)
- `src/components/` — Reusable UI components
- `src/store/` — Zustand state stores
- `src/app/api/` — API routes (image generation, caption generation, platform OAuth)
- `src/types/` — TypeScript type definitions

## Tech Stack
- **Framework:** Next.js 16 (Turbopack)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Language:** TypeScript

## Important Rules for Claude
- Always read a file before editing it
- Do not add unnecessary comments or docstrings
- Do not create new files unless absolutely required
- Keep changes minimal and focused on what was asked
- After making changes, they will be auto-pushed to GitHub at end of session

## Auto-Push Behavior
A hook in `~/.claude/settings.json` runs at the end of every Claude session:
1. Stages all changed files (`git add -A`)
2. Commits with message "Auto-save: Claude session changes" (only if there are changes)
3. Pushes to `origin master` on GitHub
