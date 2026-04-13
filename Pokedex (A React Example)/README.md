# Pokédex

A React + TypeScript Pokédex that fetches data from [PokéAPI](https://pokeapi.co/), built to compare raw `fetch` against [TanStack Query](https://tanstack.com/query) (React Query) side-by-side. The same UI can be toggled between two data-fetching implementations so the caching difference is visible in real time.

**Live demo:** https://pokedex-a-react-example.vercel.app

---

## Features

- **Browse 150 Pokémon** with image, name, and type badges
- **Search** by name with partial matching (client-side filter over the full dataset)
- **Detail page** at `/item/:id` with full stats, abilities, height, and weight
- **Four async states** handled explicitly: loading (skeleton cards), error (with retry), empty (no results), and success
- **Data source toggle** — switch between raw `fetch` and React Query to compare behavior
- **Race condition handling** via `AbortController` — in-flight requests are cancelled when the component unmounts
- **Instant back navigation** via React Query's cache — revisiting the list or a detail page uses cached data with no refetch
- **Responsive grid** — 1 column on mobile, up to 4 on desktop

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm (`npm install -g pnpm`)

### Install and run

```bash
cd Pokedex\ \(A\ React\ Example\)/ 
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```bash
pnpm build      # production build
pnpm preview    # preview the production build locally
pnpm lint       # run ESLint
```

---

## Deployment

Deployed to Vercel. The production build is a static SPA; no backend configuration required.

```bash
pnpm build       # outputs to dist/
```

---

## Notes on AI Usage

Per the project guideline, AI was used only for:
- Explaining concepts (React Query internals, discriminated unions, AbortController lifecycle)
- Debugging specific errors

All components, hooks, and types were written by hand.