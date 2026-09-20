# DataPilot UI

React + TypeScript + Vite frontend for the DataPilot AI backend.
<img width="1917" height="1092" alt="image" src="https://github.com/user-attachments/assets/7dbb7419-86f8-4170-b627-346ac8ce8af7" />
<img width="1918" height="1086" alt="image" src="https://github.com/user-attachments/assets/5db42751-92e5-4996-860c-7d91fe501c62" />



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
