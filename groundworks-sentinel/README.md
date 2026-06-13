# Groundworks Sentinel

A structural movement monitoring dashboard. Properties instrumented with ground
sensors report cumulative foundation movement (in millimetres); Sentinel
classifies each site into a status tier and surfaces the fleet in a single
operations view so crews can triage what needs attention.

## Status tiers

Movement is cumulative, measured in millimetres:

| Tier   | Range            | Meaning                              |
|--------|------------------|--------------------------------------|
| Stable | `< 2.0 mm`       | Within normal seasonal variation     |
| Watch  | `2.0 – 5.0 mm`   | Trending — schedule an inspection    |
| Alert  | `>= 5.0 mm`      | Active movement — dispatch a crew     |

## Features

- **Fleet summary** — counts per tier plus peak/average movement.
- **Property table** — sortable by movement, filterable by status.
- **Detail drawer** — per-property metadata and a 30-day movement trend chart.
- **JSON API** — `/api/properties`, `/api/properties/<id>`, `/api/stats`.

## Tech stack

- **Backend**: Python + Flask
- **Frontend**: Vanilla HTML/CSS/JS, [Chart.js](https://www.chartjs.org/) (CDN)
- **Data**: In-memory mock dataset (swap for a database in production)

## Running locally

```bash
cd groundworks-sentinel
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open <http://localhost:5000>.

## API

### `GET /api/properties`
Returns all monitored properties with a derived `status` and `last_reading`.

### `GET /api/properties/<id>`
Returns a single property plus a 30-day `history` array for the trend chart.
Responds `404` if the property does not exist.

### `GET /api/stats`
Returns fleet-wide counts (`stable`, `watch`, `alert`), `total`,
`avg_movement`, `max_movement`, and an `updated` timestamp.

## Project layout

```
groundworks-sentinel/
├── app.py                 # Flask app + API + status model
├── requirements.txt
├── templates/
│   └── dashboard.html
└── static/
    ├── css/styles.css
    └── js/dashboard.js
```

## Notes

The dataset lives in memory in `app.py`. To go to production, replace the
`properties` dict and `_movement_history()` with queries against a datastore fed
by the field sensors; the status model (`classify`) and API shape stay the same.
