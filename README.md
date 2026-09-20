# DataPilot UI

React + TypeScript + Vite frontend for the DataPilot AI backend.

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS v4 (class-based dark mode)
- `react-markdown` + `remark-gfm` for markdown table rendering
- `react-syntax-highlighter` for SQL blocks
- Recharts for chart view

## Local Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

Set `VITE_API_BASE_URL` in a `.env.local` file to point at a non-local backend:

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## Build

```bash
npm run build
```

Output goes to `dist/`. The `public/_redirects` file configures Render for SPA routing.
