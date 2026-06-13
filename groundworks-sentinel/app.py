"""Groundworks Sentinel — structural movement monitoring dashboard.

A lightweight Flask application that surfaces foundation/structural movement
readings for monitored properties. Each property is tracked by a ground sensor
that reports cumulative movement (in millimetres). Readings are classified into
a status tier so crews can triage which sites need attention.
"""

from datetime import datetime, timedelta
import math

from flask import Flask, jsonify, render_template, abort

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Status model
# ---------------------------------------------------------------------------
# Cumulative movement is measured in millimetres. Thresholds determine the tier:
#   Stable : movement < 2.0 mm        -> within normal seasonal variation
#   Watch  : 2.0 mm <= movement < 5.0 -> trending, schedule an inspection
#   Alert  : movement >= 5.0 mm       -> active movement, dispatch a crew
STABLE_THRESHOLD = 2.0
WATCH_THRESHOLD = 5.0


def classify(movement):
    """Return the status tier for a cumulative movement reading (mm)."""
    if movement < STABLE_THRESHOLD:
        return "Stable"
    if movement < WATCH_THRESHOLD:
        return "Watch"
    return "Alert"


# ---------------------------------------------------------------------------
# Mock data
# ---------------------------------------------------------------------------
# In production these would come from a database fed by field sensors. Each
# record carries enough metadata to render a useful operations view.
properties = {
    1: {
        "name": "1427 Palm Grove Lane",
        "city": "Orlando, FL",
        "movement": 0.8,
        "sensor_id": "GW-SENS-0142",
        "foundation": "Slab-on-grade",
        "installed": "2024-03-11",
        "lat": 28.5383,
        "lng": -81.3792,
    },
    2: {
        "name": "8932 Cypress Drive",
        "city": "Tampa, FL",
        "movement": 4.2,
        "sensor_id": "GW-SENS-0233",
        "foundation": "Pier & beam",
        "installed": "2023-11-02",
        "lat": 27.9506,
        "lng": -82.4572,
    },
    3: {
        "name": "204 Mockingbird Court",
        "city": "Jacksonville, FL",
        "movement": 6.7,
        "sensor_id": "GW-SENS-0319",
        "foundation": "Slab-on-grade",
        "installed": "2023-06-18",
        "lat": 30.3322,
        "lng": -81.6557,
    },
    4: {
        "name": "55 Harborview Terrace",
        "city": "Miami, FL",
        "movement": 1.4,
        "sensor_id": "GW-SENS-0407",
        "foundation": "Pile-supported",
        "installed": "2024-01-27",
        "lat": 25.7617,
        "lng": -80.1918,
    },
    5: {
        "name": "3110 Sandhill Road",
        "city": "Gainesville, FL",
        "movement": 5.9,
        "sensor_id": "GW-SENS-0512",
        "foundation": "Pier & beam",
        "installed": "2023-09-09",
        "lat": 29.6516,
        "lng": -82.3248,
    },
    6: {
        "name": "781 Lakeshore Boulevard",
        "city": "St. Petersburg, FL",
        "movement": 0.3,
        "sensor_id": "GW-SENS-0588",
        "foundation": "Slab-on-grade",
        "installed": "2024-04-30",
        "lat": 27.7676,
        "lng": -82.6403,
    },
}


def _movement_history(seed, current, points=30):
    """Generate a deterministic 30-day movement trend ending at ``current``.

    Real deployments would query stored readings; here we synthesize a smooth,
    repeatable series so the trend charts are meaningful without a database.
    """
    history = []
    today = datetime.utcnow().date()
    for i in range(points):
        day = today - timedelta(days=points - 1 - i)
        # Ease from ~40% of the current reading up to the current value, with a
        # small deterministic ripple so the line looks like real field data.
        progress = i / (points - 1)
        base = current * (0.4 + 0.6 * progress)
        ripple = math.sin((i + seed) * 0.7) * (current * 0.05)
        value = max(0.0, round(base + ripple, 2))
        history.append({"date": day.isoformat(), "movement": value})
    return history


def _enrich(prop_id, record):
    """Return a property record with its derived status and freshness fields."""
    movement = record["movement"]
    enriched = dict(record)
    enriched["id"] = prop_id
    enriched["status"] = classify(movement)
    # Stagger the "last reading" timestamps so the feed feels live.
    enriched["last_reading"] = (
        datetime.utcnow() - timedelta(minutes=7 * prop_id)
    ).isoformat(timespec="seconds") + "Z"
    return enriched


@app.route("/")
def index():
    return render_template("dashboard.html")


@app.route("/api/properties")
def get_properties():
    """Return all monitored properties with derived status."""
    return jsonify([_enrich(pid, rec) for pid, rec in sorted(properties.items())])


@app.route("/api/properties/<int:prop_id>")
def get_property(prop_id):
    """Return a single property plus its 30-day movement history."""
    record = properties.get(prop_id)
    if record is None:
        abort(404, description="Property not found")
    detail = _enrich(prop_id, record)
    detail["history"] = _movement_history(prop_id, record["movement"])
    return jsonify(detail)


@app.route("/api/stats")
def get_stats():
    """Return fleet-wide summary counts used by the dashboard header."""
    tiers = {"Stable": 0, "Watch": 0, "Alert": 0}
    movements = []
    for record in properties.values():
        tiers[classify(record["movement"])] += 1
        movements.append(record["movement"])
    total = len(properties)
    return jsonify(
        {
            "total": total,
            "stable": tiers["Stable"],
            "watch": tiers["Watch"],
            "alert": tiers["Alert"],
            "avg_movement": round(sum(movements) / total, 2) if total else 0.0,
            "max_movement": max(movements) if movements else 0.0,
            "updated": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        }
    )


@app.errorhandler(404)
def not_found(err):
    return jsonify({"error": getattr(err, "description", "Not found")}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
