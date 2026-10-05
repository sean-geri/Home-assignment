# Pokemon Trainer Bank

Full-stack home assignment for managing **trainers**, searching **Pokemon**, and organizing them between a shared **Bank** and a limited **Bag**.

The repository is split into two packages:

| Package | Description | Docs |
|---------|-------------|------|
| [`backend/`](./backend) | NestJS REST API + PostgreSQL | [backend/README.md](./backend/README.md) |
| [`client/`](./client) | React + TypeScript + Vite UI | [client/README.md](./client/README.md) |

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Backend | NestJS 12, TypeORM |
| Database | PostgreSQL |
| External data | [PokeAPI](https://pokeapi.co/) (synced into the local DB on startup) |

## Domain logic

1. **Trainers** — create and list trainers (name, age, gender).
2. **Pokemon catalog** — on backend startup, missing Pokemon are synced from PokeAPI into PostgreSQL. The client can search that catalog by name.
3. **Assignment** — a selected trainer can receive a Pokemon with nickname, level, and gender. New assignments start in the **Bank**.
4. **Bank vs Bag** — each trainer’s Pokemon live in one of two locations:
   - `BANK` — storage
   - `BAG` — active party (maximum **6** Pokemon)
5. **Moves** — the client can move Pokemon from bank → bag or bag → bank via a location update. The API rejects a move to the bag when it is already full.

```text
Client  →  Nest API  →  PostgreSQL
                ↑
             PokeAPI (startup sync)
```

## Prerequisites

- **Node.js** 20+ (22 recommended for the Vite 8 client)
- **PostgreSQL** running locally (or reachable from your machine)
- `npm`

## Environment configuration

Backend configuration lives in [`backend/.env`](./backend/.env). Create or edit that file before starting the API:

```env
PORT=3008
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port for the Nest API (default in code is `3000` if unset) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |

The client talks to the API using `BASE_URL` in [`client/src/app-api.ts`](./client/src/app-api.ts). By default it targets `http://localhost:3008`, which should match `PORT` in `backend/.env`.

> Ensure the PostgreSQL database named in `DB_NAME` already exists, and that the credentials can connect. TypeORM runs with `synchronize: true` in development, so schema is created/updated automatically.

## How to run

Use two terminals.

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

The API listens on the port from `.env` (e.g. `http://localhost:3008`).  
Health check: `GET /health`.

On first boot, the server may take a while while it syncs Pokemon from PokeAPI.

More detail: **[backend/README.md](./backend/README.md)**

### 2. Client

```bash
cd client
npm install
nvm use 22   # if needed
npm run dev
```

Open the Vite URL (typically `http://localhost:5173`).

More detail: **[client/README.md](./client/README.md)**

## Project structure

```text
Home-assignment/
├── README.md                 ← you are here
├── backend/                  ← NestJS API
│   ├── .env                  ← server & database config
│   ├── README.md
│   └── src/
│       ├── pokemon/          ← catalog + PokeAPI sync
│       └── trainer/          ← trainers, bank/bag assignments
└── client/                   ← React UI
    ├── README.md
    └── src/
        ├── app-api.ts        ← HTTP layer
        ├── operations/       ← user actions
        └── components/       ← bank / bag / cards
```

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/trainers` | List trainers |
| `POST` | `/trainers` | Create trainer |
| `GET` | `/pokemon?search=` | Search Pokemon |
| `GET` | `/trainers/:trainerId/pokemon` | List trainer Pokemon |
| `POST` | `/trainers/:trainerId/pokemon` | Assign Pokemon to bank |
| `PATCH` | `/trainers/:trainerId/pokemon/:id/location` | Move between `BANK` and `BAG` |

For client architecture and UI details, see [client/README.md](./client/README.md).  
For Nest scripts, tests, and framework docs, see [backend/README.md](./backend/README.md).
