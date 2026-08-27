# Boot Web Server

A small **Twitter clone API** called **Chirpy**. Users can sign up, log in, and post
140-character messages called **chirps**. It's a learning project, so I wouldn't
count on any scalability awards.

## Tech Stack

- [Express](https://expressjs.com/) 5 — web framework
- [TypeScript](https://www.typescriptlang.org/) — typed JavaScript
- [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) — database
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — access tokens
- [argon2](https://www.npmjs.com/package/argon2) — password hashing

## Table of Contents

- [How It Works](#how-it-works)
  - [Request Flow](#request-flow)
  - [Auth Flow](#auth-flow)
- [Getting Started](#getting-started)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Set Up Environment Variables](#2-set-up-environment-variables)
  - [3. Run the Database Migrations](#3-run-the-database-migrations)
  - [4. Start the Server](#4-start-the-server)
- [Project Layout](#project-layout)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Tokens](#tokens)
  - [Chirps](#chirps)
  - [Webhooks](#webhooks)
  - [Admin](#admin)
  - [Static Files](#static-files)
- [Common Errors](#common-errors)
- [Running Tests](#running-tests)

---

## How It Works

The server reads your `.env` file, connects to Postgres, runs any pending database
migrations, then starts an Express app on port `8080`.

### Request Flow

1. Express receives the request in [`src/index.ts`](src/index.ts).
2. The request passes through middleware (JSON parsing, logging).
3. The router in [`src/routes/`](src/routes/) matches the URL to a handler.
4. Validator middleware checks the body/query before the handler runs.
5. The handler talks to the DB through [`src/db/queries/`](src/db/queries/).
6. The handler sends back a JSON response.
7. If anything throws, the error handler at the bottom of [`src/index.ts`](src/index.ts)
   catches it and returns a friendly `{ "error": "..." }` response.

### Auth Flow

- **Access token** — a JWT that expires after **1 hour**. Send it on protected routes as
  `Authorization: Bearer <token>`.
- **Refresh token** — a random string valid for **60 days**, stored in the DB. Use it to
  get a fresh access token when the old one expires.
- Passwords are **hashed with argon2** — never stored in plain text.
- The Polka webhook instead uses `Authorization: ApiKey <key>` (see
  [Polka Webhook](API-SAMPLES.md#polka-webhook)).

## Getting Started

### 1. Install Dependencies

Requires Node (see [`.nvmrc`](.nvmrc)).

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root with these values:

```bash
DB_URL=postgres://user:password@localhost:5432/chirpy
JWT_SECRET=some-long-random-string
POLKA_KEY=some-shared-secret
PLATFORM=dev
```

| Variable       | What it's for                                      |
| -------------- | -------------------------------------------------- |
| `DB_URL`       | Postgres connection string                         |
| `JWT_SECRET`   | Signs and verifies access tokens                   |
| `POLKA_KEY`    | Authenticates the Polka webhook                    |
| `PLATFORM`     | Set to `dev` to allow the admin reset endpoint     |

### 3. Run the Database Migrations

```bash
npm run gen      # generate a migration from the schema (only when schema changes)
npm run migrate  # apply pending migrations to the database
```

### 4. Start the Server

```bash
npm run dev    # compile TypeScript, then run
```

The API will be listening at `http://localhost:8080`.

## Project Layout

```
src/
├── app/            # static files served at /app (a simple HTML page)
├── db/
│   ├── migrations/ # SQL migrations
│   ├── queries/    # database functions (users, chirps, refresh tokens)
│   └── schema.ts   # Drizzle table definitions
├── handlers/       # one function per endpoint
├── middleware/     # request logging + metrics
├── routes/         # maps URLs to handlers
├── validators/     # checks request bodies/query strings
├── auth.ts         # JWT + password helpers
├── config.ts       # reads env vars
├── errors.ts       # custom error classes
└── index.ts        # app entry point
```

## API Endpoints

Request/response examples for every endpoint live in
[`API-SAMPLES.md`](API-SAMPLES.md) — each entry below links to its section.

### Users

| Method | Route         | Description                              | Auth       |
| ------ | ------------- | ---------------------------------------- | ---------- |
| POST   | `/api/users`  | Register a new user                      | No         |
| PUT    | `/api/users`  | Update the logged-in user's email/pass   | Bearer     |
| POST   | `/api/login`  | Log in and get access + refresh tokens   | No         |

→ See [Users samples](API-SAMPLES.md#users)

### Tokens

| Method | Route           | Description                                  | Auth       |
| ------ | --------------- | -------------------------------------------- | ---------- |
| POST   | `/api/refresh`  | Trade a refresh token for a new access token | Bearer     |
| POST   | `/api/revoke`   | Invalidate a refresh token                   | Bearer     |

→ See [Tokens samples](API-SAMPLES.md#tokens)

### Chirps

| Method | Route                  | Description                                | Auth   |
| ------ | ---------------------- | ------------------------------------------ | ------ |
| GET    | `/api/chirps`          | List chirps (`?authorId=`, `?sort=desc`)   | No     |
| GET    | `/api/chirps/:id`      | Get a single chirp                         | No     |
| POST   | `/api/chirps`          | Create a chirp (max 140 chars)             | Bearer |
| DELETE | `/api/chirps/:id`      | Delete a chirp (author only)               | Bearer |

→ See [Chirps samples](API-SAMPLES.md#chirps)

### Webhooks

| Method | Route                  | Description                                | Auth     |
| ------ | ---------------------- | ------------------------------------------ | -------- |
| POST   | `/api/polka/webhooks`  | Receive payment events (upgrades to Red)   | ApiKey   |

→ See [Polka Webhook sample](API-SAMPLES.md#polka-webhook)

### Admin

| Method | Route             | Description                                      | Auth |
| ------ | ----------------- | ------------------------------------------------ | ---- |
| GET    | `/admin/metrics`  | Show how many times the static page was viewed   | No   |
| POST   | `/admin/reset`    | Wipe users + reset metrics (dev only)            | No   |

→ See [Admin samples](API-SAMPLES.md#admin)

### Static Files

| Route  | Description                              |
| ------ | ---------------------------------------- |
| `/app` | Serves the simple HTML page from `src/app` |

## Common Errors

Every error response follows the same shape: `{ "error": "message" }`.

| Status | Meaning                                              |
| ------ | ---------------------------------------------------- |
| `400`  | Bad request — missing/invalid JSON or query params   |
| `401`  | Not authenticated — bad token, password, or API key  |
| `403`  | Not allowed — not the chirp owner, or reset in prod  |
| `404`  | Resource not found                                   |
| `500`  | Something went wrong on the server's end             |

## Running Tests

Unit tests use [Vitest](https://vitest.dev/) and cover password hashing + JWT logic.

```bash
npm test
```
