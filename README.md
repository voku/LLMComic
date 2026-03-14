# LLMComic

LLMComic is a scroll-driven interactive comic about AI-assisted software development, plausible correctness, and the difference between believing code and knowing a system.

## What this project includes

- A React + Vite front end for the comic experience
- Pre-generated static artwork in `public/generated/` so the story works without any API setup
- An optional Express server for self-hosted image generation and local API routes
- A GitHub Pages deployment workflow for the static production build

## Quick start

### Prerequisites

- Node.js 20+
- npm

### Install and run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` when you want to run the optional server-assisted image generation flow locally.

| Variable | Required | Purpose |
| --- | --- | --- |
| `API_KEY` | No | Optional API key used by the local/self-hosted server when generating images |
| `APP_URL` | No | Public base URL for the app when self-hosting |

If you do not provide an `API_KEY`, the application still works with the checked-in generated assets and image fallbacks.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run the TypeScript type check |
| `npm run build` | Build the static client bundle and the Node server bundle |
| `npm run build:pages` | Build the static site for GitHub Pages |
| `npm run preview` | Preview the built static client |
| `npm start` | Run the built Node server from `dist/server.cjs` |

## Production deployment

### GitHub Pages

This repository includes a GitHub Actions workflow that deploys the static comic to GitHub Pages on pushes to `main`.

- The workflow builds the Vite app with the repository base path
- Static assets are published from `dist/`
- The GitHub Pages version is intended for the interactive reading experience and checked-in artwork
- Server-only features such as runtime image generation are not available on GitHub Pages

### Self-hosted Node deployment

If you want the Express server endpoints as well:

```bash
npm install
npm run build
npm start
```

## Key files

- `src/App.tsx` — top-level layout, intro screen, comic flow, and footer links
- `src/data.ts` — comic story content, panels, and interactive hotspot definitions
- `src/components/ImageGenerator.tsx` — generated image loading and fallback behavior
- `index.html` — document metadata, favicon, and social preview tags
- `vite.config.ts` — Vite configuration, including GitHub Pages base-path support
- `.github/workflows/deploy-pages.yml` — automatic GitHub Pages deployment workflow
- `server.ts` — local/self-hosted Express server and API routes

## Helper prompt: Key Files Detector

Use this prompt when you want an assistant to identify the files that matter before making a change:

```text
You are reviewing the LLMComic repository.

Identify the key files I should inspect before making changes to this project.
Group the results into:
1. app entry points
2. UI layout and content
3. image loading or generation logic
4. deployment and metadata
5. documentation

For each file, explain in one sentence why it matters.
Prefer the smallest set of files that gives full context.
```

## Contributing

Contributions are welcome at:

https://github.com/voku/LLMComic
