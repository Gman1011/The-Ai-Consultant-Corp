# Groundworks Sentinel

Structural movement monitoring dashboard. Sentinel tracks cumulative ground
movement (in millimetres) at monitored properties and triages each site into a
status tier so crews know where to look first.

All sensor readings are collected by **GARVIS** — the *Ground Analysis &
Real-time Vigilance Intelligence System* — the sensor network that polls each
property's ground sensor and feeds the readings into the Sentinel API.

> This is a standalone project. It shares the repo's stack (Node/Express +
> React) but has no dependency on, or connection to, any other app in the
> repository.

## Status tiers

| Tier   | Movement          | Meaning                              |
| ------ | ----------------- | ------------------------------------ |
| Stable | `< 2.0 mm`        | Within normal seasonal variation     |
| Watch  | `2.0 – 4.99 mm`   | Trending — schedule an inspection    |
| Alert  | `>= 5.0 mm`       | Active movement — dispatch a crew     |

## Stack

- **Backend** — Node + Express. In-memory seeded dataset (no database
  required), so the API runs with zero external dependencies. In production the
  same server also serves the built React UI, so the whole app runs on **one
  port** from a single process.
- **Frontend** — React (Create React App), axios, a dependency-free SVG trend
  chart. Calls the API at same-origin `/api`.

## Project layout

```
groundworks-sentinel/
├── backend/
│   └── src/
│       ├── server.js            # Express app + health check
│       ├── routes/
│       │   ├── properties.js    # GET /api/properties[/:id]
│       │   └── stats.js         # GET /api/stats (fleet summary + GARVIS feed)
│       ├── data/properties.js   # seeded property/sensor records
│       └── utils/
│           ├── status.js        # movement -> Stable/Watch/Alert
│           └── garvis.js        # GARVIS feed metadata
└── frontend/
    └── src/
        ├── pages/Dashboard.js
        ├── components/          # StatCard, StatusBadge, PropertyTable,
        │                        #   PropertyDrawer, TrendChart
        ├── services/api.js
        └── utils/format.js
```

## Running it

All commands are run from `groundworks-sentinel/`.

Install everything once:

```bash
npm run setup        # installs backend + frontend dependencies
```

### Operational (single port)

Build the UI and serve the whole app — API and dashboard — from one Express
process on port `5050`:

```bash
npm run serve        # builds the frontend, then starts the server
# open http://localhost:5050
```

Already built? Just start it:

```bash
npm start            # serves the existing frontend/build + API on :5050
```

### Development (live reload, two servers)

```bash
npm run dev          # API on :5050 (nodemon) + CRA dev server on :3000
# open http://localhost:3000   (proxies /api -> :5050)
```

> Port is configurable with `PORT` (see `backend/.env.example`).

## API

| Method | Endpoint               | Description                                        |
| ------ | ---------------------- | -------------------------------------------------- |
| GET    | `/api/health`          | Service + GARVIS feed status                       |
| GET    | `/api/stats`           | Fleet summary counts, peak/avg movement, feed info |
| GET    | `/api/properties`      | All monitored properties with derived status       |
| GET    | `/api/properties/:id`  | One property plus a 30-day movement history series  |

Every reading returned by the API is tagged with `source: "GARVIS"` to
attribute the collection feed.
