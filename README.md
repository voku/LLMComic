<div align="center">
  <img width="1200" height="475" alt="LLMComic banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LLMComic

An interactive noir comic about AI-assisted software development, built with React, TypeScript, Vite, Tailwind CSS, and a small Express server that serves the shipped comic-image manifest in development.

## Production overview

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Server:** Express + TSX during development
- **Static deployment:** GitHub Pages via Vite build output
- **Dynamic/local deployment:** Node server for `/api/*` image-manifest endpoints

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

- `APP_URL` — optional application base URL for deployed environments

> The comic uses the pre-generated assets in `public/generated` and does not require a provider API key.

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

## Pre-generated panel images

Pre-generated images are committed in `public/generated/`. To verify that the local manifest and the shipped files still match, start the dev server then run the manifest check:

```bash
npm run dev          # terminal 1 — starts local server on port 3000
npx tsx scripts/auto-generate.ts   # terminal 2 — verifies every shipped comic image
```

The script fetches the image manifest from `/api/generation-plan`, then calls `/api/generate-single` for each image ID to confirm the asset path that the web app uses.

## Project structure

- `src/App.tsx` — top-level story layout, groups panels into comic strips and interactive scenes
- `src/data.ts` — comic content, panel definitions, hotspots, and art-direction copy
- `src/generatedImages.ts` — explicit manifest of the shipped comic artwork
- `src/components/ComicStrip.tsx` — groups narrative panels in a 2-column comic-book grid with noir gutters
- `src/components/ComicPanel.tsx` — individual panel with background image, title banner, and caption boxes
- `src/components/PointAndClickScene.tsx` — interactive investigation scenes (point-and-click gameplay)
- `src/components/ImageGenerator.tsx` — image loading for the shipped panel assets
- `server.ts` — local Express server for dev mode and image-manifest endpoints
- `scripts/auto-generate.ts` — CLI helper to verify the shipped image manifest via the dev server
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
