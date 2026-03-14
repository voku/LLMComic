<div align="center">
  <img width="1200" height="475" alt="LLMComic banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LLMComic

An interactive noir comic about AI-assisted software development, built with React, TypeScript, Vite, Tailwind CSS, and a small Express server for optional image generation workflows.

## Production overview

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Server:** Express + TSX during development
- **Static deployment:** GitHub Pages via Vite build output
- **Dynamic/local deployment:** Node server for `/api/*` image-generation endpoints

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy `.env.example` to `.env.local` and update values as needed:

```bash
cp .env.example .env.local
```

Available variables:

- `API_KEY` — optional provider API key used by the local image-generation scripts/server
- `APP_URL` — optional application base URL for deployed environments

> The static GitHub Pages site uses the pre-generated assets in `public/generated` and does not require a server-side API.

### Run locally

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Build and verification

Run the existing checks:

```bash
npm run lint
npm run build
```

To create the static site bundle only:

```bash
npm run build:web
```

To preview the static Vite build locally:

```bash
npm run preview
```

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow that automatically deploys the Vite build to GitHub Pages on pushes to `main`.

- Workflow file: `.github/workflows/deploy-pages.yml`
- Published URL: `https://voku.github.io/LLMComic/`

## Project structure

- `src/App.tsx` — top-level story layout and footer
- `src/data.ts` — comic content, panel definitions, hotspots, and prompts
- `src/components/ComicPanel.tsx` — scroll-driven comic panel renderer
- `src/components/PointAndClickScene.tsx` — interactive investigation scenes
- `src/components/ImageGenerator.tsx` — image loading for generated panel assets
- `server.ts` — local Express server for dev mode and optional image-generation endpoints
- `public/generated/` — pre-generated comic artwork used by the static deployment

## Helper prompt: Key Files Detector

Use this helper prompt when you want an LLM to identify the most relevant files before editing the project:

```text
You are reviewing the LLMComic repository. Identify the smallest set of files I should read first for this task.

Task:
{{describe_the_change}}

For each recommended file, explain:
1. Why it matters
2. What part of the task it affects
3. Whether it is safe to edit directly or only useful for context

Prefer the minimal set of files needed to make a correct change.
```

## Contributing

Issues and pull requests are welcome at:

https://github.com/voku/LLMComic
