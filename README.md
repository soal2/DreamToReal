# DreamToReal

Dream to Real Agent backend MVP.

## Backend Quick Start

```bash
cd /Users/eversse/Documents/codes/DTR
python -m pip install -r backend/requirements.txt
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

Initialize or migrate the SQLite database:

```bash
PYTHONPATH=backend python3 backend/scripts/init_db.py
```

Create a database at a custom path:

```bash
PYTHONPATH=backend python3 backend/scripts/init_db.py --database /path/to/dream_to_real.sqlite3
```

Initialize with demo records:

```bash
PYTHONPATH=backend python3 backend/scripts/init_db.py --seed-demo-data
```

Implemented MVP endpoints:

- `POST /api/v1/dreams`
- `GET /api/v1/dreams`
- `GET /api/v1/dreams/{dream_id}`
- `POST /api/v1/dreams/{dream_id}/reorganize`
- `POST /api/v1/dreams/{dream_id}/generate-image`
- `DELETE /api/v1/dreams/{dream_id}`
- `GET /api/v1/health`

The backend uses SQLite, seeded demo records, a mock dream organizer, and a mock image provider so the demo flow works even without real model credentials.
