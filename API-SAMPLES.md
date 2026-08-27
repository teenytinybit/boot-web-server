# API Request & Response Samples

Every request/response example for the Chirpy API, in one place. The main
[`README.md`](README.md) links to the relevant section for each endpoint.

> Note: all JSON bodies need a `Content-Type: application/json` header, and protected
> routes need `Authorization: Bearer <token>`. The Polka webhook uses
> `Authorization: ApiKey <key>` instead.

## Table of Contents

- [Health Check](#health-check)
- [Users](#users)
  - [Create User](#create-user)
  - [Login](#login)
  - [Update User](#update-user)
- [Tokens](#tokens)
  - [Refresh Token](#refresh-token)
  - [Revoke Token](#revoke-token)
- [Chirps](#chirps)
  - [Get Chirps](#get-chirps)
  - [Get a Chirp](#get-a-chirp)
  - [Create a Chirp](#create-a-chirp)
  - [Delete a Chirp](#delete-a-chirp)
- [Webhooks](#webhooks)
  - [Polka Webhook](#polka-webhook)
- [Admin](#admin)
  - [Get Metrics](#get-metrics)
  - [Reset](#reset)

---

## Health Check

Simple "is the server up?" check. No auth.

```http
GET /api/healthz
```

**Response — `200 OK`**

```text
OK
```

## Users

### Create User

Registers a new user.

```http
POST /api/users
Content-Type: application/json
```

```json
{ "email": "ada@example.com", "password": "super-secret" }
```

**Response — `201 Created`**

```json
{
  "id": "3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
  "createdAt": "2026-08-27T10:00:00.000Z",
  "updatedAt": "2026-08-27T10:00:00.000Z",
  "email": "ada@example.com",
  "isChirpyRed": false
}
```

### Login

Validates the password and returns tokens. The `token` is a JWT you use for protected
requests; the `refreshToken` is for getting new access tokens later.

```http
POST /api/login
Content-Type: application/json
```

```json
{ "email": "ada@example.com", "password": "super-secret" }
```

**Response — `200 OK`**

```json
{
  "id": "3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
  "createdAt": "2026-08-27T10:00:00.000Z",
  "updatedAt": "2026-08-27T10:00:00.000Z",
  "email": "ada@example.com",
  "isChirpyRed": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "9f8e7d6c5b4a39281706f5e4d3c2b1a0099887766..."
}
```

**Response — `401 Unauthorized`** (bad email/password)

```json
{ "error": "Incorrect email or password" }
```

### Update User

Updates the logged-in user's email and password. Requires auth.

```http
PUT /api/users
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{ "email": "ada@new-domain.com", "password": "new-password" }
```

**Response — `200 OK`**

```json
{
  "id": "3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
  "createdAt": "2026-08-27T10:00:00.000Z",
  "updatedAt": "2026-08-27T11:00:00.000Z",
  "email": "ada@new-domain.com",
  "isChirpyRed": false
}
```

## Tokens

### Refresh Token

Trades a valid refresh token for a fresh access token.

```http
POST /api/refresh
Authorization: Bearer <refreshToken>
```

**Response — `200 OK`**

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Response — `401 Unauthorized`** (missing/expired/revoked refresh token)

```json
{ "error": "Invalid token" }
```

### Revoke Token

Invalidates a refresh token so it can't be used again.

```http
POST /api/revoke
Authorization: Bearer <refreshToken>
```

**Response — `204 No Content`** (no body)

## Chirps

### Get Chirps

Lists all chirps (oldest first). Supports optional query params:

- `authorId` — only chirps from a specific user
- `sort=desc` — newest first

```http
GET /api/chirps?authorId=3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f&sort=desc
```

**Response — `200 OK`**

```json
[
  {
    "id": "b3d0c5f2-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    "createdAt": "2026-08-27T09:00:00.000Z",
    "updatedAt": "2026-08-27T09:00:00.000Z",
    "body": "Hello world!",
    "userId": "3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f"
  }
]
```

### Get a Chirp

Fetches a single chirp by its ID.

```http
GET /api/chirps/b3d0c5f2-4e5f-6a7b-8c9d-0e1f2a3b4c5d
```

**Response — `200 OK`**

```json
{
  "id": "b3d0c5f2-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
  "createdAt": "2026-08-27T09:00:00.000Z",
  "updatedAt": "2026-08-27T09:00:00.000Z",
  "body": "Hello world!",
  "userId": "3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f"
}
```

**Response — `404 Not Found`**

```json
{ "error": "Chirp not found" }
```

### Create a Chirp

Posts a new chirp. Requires auth. Bodies are capped at 140 characters, and a few
profanity words (`kerfuffle`, `sharbert`, `fornax`) get masked to `****`.

```http
POST /api/chirps
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{ "body": "My very first chirp!" }
```

**Response — `201 Created`**

```json
{
  "id": "c1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a",
  "createdAt": "2026-08-27T12:00:00.000Z",
  "updatedAt": "2026-08-27T12:00:00.000Z",
  "body": "My very first chirp!",
  "userId": "3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f"
}
```

**Response — `400 Bad Request`** (missing body or too long)

```json
{ "error": "Chirp is too long. Max length is 140" }
```

### Delete a Chirp

Deletes a chirp. **Only the author can delete their own chirp.**

```http
DELETE /api/chirps/b3d0c5f2-4e5f-6a7b-8c9d-0e1f2a3b4c5d
Authorization: Bearer <token>
```

**Response — `204 No Content`** (no body)

**Response — `403 Forbidden`** (not the author)

```json
{ "error": "Unauthorized" }
```

## Webhooks

### Polka Webhook

Receives events from a fake payment provider called **Polka**. This one upgrades a user
to **Chirpy Red** when they pay. Uses an API key header, not a Bearer token.

```http
POST /api/polka/webhooks
Authorization: ApiKey <POLKA_KEY>
Content-Type: application/json
```

```json
{
  "event": "user.upgraded",
  "data": { "userId": "3f2b6a9e-1a2b-3c4d-5e6f-7a8b9c0d1e2f" }
}
```

**Response — `204 No Content`** (the user is now `isChirpyRed: true`)

**Response — `401 Unauthorized`** (wrong or missing API key)

```json
{ "error": "Invalid API key" }
```

## Admin

### Get Metrics

Shows how many times the static `/app` page has been viewed.

```http
GET /admin/metrics
```

**Response — `200 OK`** (HTML)

```html
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited 7 times!</p>
  </body>
</html>
```

### Reset

Wipes all users (and anything that references them) and resets the hit counter.
**Only works when `PLATFORM=dev`.**

```http
POST /admin/reset
```

**Response — `200 OK`**

```text
OK
```

**Response — `403 Forbidden`** (not in dev mode)

```json
{ "error": "Forbidden" }
```
