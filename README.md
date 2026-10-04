# Agro Voice Dashboard

Operator dashboard for the Agro Voice MVP: farmers report coffee leaf rust by phone call or SMS, and this dashboard
shows the plots on a map with their inspection priority, the alerts waiting for review, the follow-ups, the resolved
cases and the external context sources.

Backend, advisor and communications live in the main repository (`HACK-NATION-HACKATHON`).

Built with React 19, Vite, TypeScript, Tailwind CSS, TanStack Query and MapLibre GL.

## Requirements

- Node.js **22+** and npm
- Optional: the backend running locally or deployed, to use real data

## Installation

```bash
git clone https://github.com/A01754754/dashboard.git
cd dashboard
npm install
```

## Running locally

### With mock data (no backend needed)

```bash
npm run dev
```

Open <http://localhost:5173>. This is the default mode: it uses the fixtures in `src/mocks/`.

### Against the backend

Create a `.env.local` file in the project root:

```bash
VITE_API_MODE=http
VITE_API_URL=http://localhost:8000/v1
```

Then run `npm run dev`. The backend must allow the dashboard origin in `CORS_ORIGINS`
(`http://localhost:5173` by default). To start the backend, follow the installation steps in the main repository's
README (`docker compose up -d db`, `backend/scripts/reset_db.sh`, `uvicorn backend.app.main:app --port 8000`).

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_MODE` | `mock` | `mock` uses local fixtures; `http` calls the backend |
| `VITE_API_URL` | `http://localhost:8000/v1` | Backend base URL, including `/v1` |

They are read at build time, so changing them requires restarting `npm run dev` or rebuilding.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-checks (`tsc -b`) and builds into `dist/` |
| `npm run preview` | Serves the production build locally |

## Pages

| Route | Content |
| --- | --- |
| `/` | Landing page |
| `/panel` | Map of plots with priority and filters |
| `/panel/parcela/:plotId` | Plot detail: reports, assessments and timeline |
| `/panel/alertas` | Alerts pending review |
| `/panel/seguimientos` | Follow-up calls and their status |
| `/panel/casos-resueltos` | Resolved cases |
| `/panel/contexto-externo` | External context sources |

## Project structure

```
src/
  api/          API client: mockAdapter (fixtures) and httpAdapter (backend), React Query hooks, types
  components/   Map, filters, badges, panels
  layout/       App layout with the navigation bar
  lib/          Formatting, labels and priority helpers
  mocks/        Demo data and graph fixture
  pages/        One component per route
```

## Deployment

It is a static single-page app; `vercel.json` rewrites every route to `index.html`.

- **Vercel**: import the repository, framework preset *Vite*, and set `VITE_API_MODE=http` and
  `VITE_API_URL=https://<backend-url>/v1` in the project's environment variables.
- **Render**: static site with build command `npm ci && npm run build`, publish directory `dist` and a rewrite
  from `/*` to `/index.html`.

Remember to add the dashboard's public URL to the backend's `CORS_ORIGINS`.
