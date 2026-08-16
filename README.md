# Zoravix Photography Template

Payload CMS template for photography sites. SQLite/libsql database, Cloudflare R2 media storage.

## Stack

- **Payload 3** + Next.js
- **Database**: SQLite via `@payloadcms/db-sqlite` (local file or remote libsql server)
- **Media storage**: `@payloadcms/storage-s3` pointed at Cloudflare R2's S3-compatible API

## Quick start

1. `cp .env.example .env` and fill in `PAYLOAD_SECRET` (any random string for dev)
2. `pnpm install && pnpm dev`
3. Open `http://localhost:3000/admin` and create your first admin user

By default `DATABASE_URL=file:./payload.db` (local SQLite file, zero setup) and R2 vars point at a local MinIO instance — see [Docker](#docker) if you want those running too. For production, swap `DATABASE_URL` for a remote libsql/Turso URL and fill in real R2 credentials.

### Cloudflare R2 setup (production)

1. Create a bucket in the Cloudflare dashboard (R2 → Create bucket)
2. Create an API token (R2 → Manage API Tokens) scoped to that bucket
3. Set in `.env`:
   ```
   R2_BUCKET=your-bucket-name
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   ```

## Docker

`docker-compose.yml` runs the full dev stack: the app, a `libsql-server` database, and a `minio` service standing in for R2 (S3-compatible, no real Cloudflare account needed).

```
docker compose up
```

This starts:

- `payload` — the app on `http://localhost:3000`
- `libsql` — database on port `8080`
- `minio` — S3-compatible storage on `9000` (API) and `9001` (console, login `minioadmin`/`minioadmin`)
- `minio-init` — one-shot job that creates the `dev-bucket` used by `.env.example`

## Collections

- **Users** — auth-enabled, admin panel access. See [Authentication docs](https://payloadcms.com/docs/authentication/overview).
- **Media** — uploads collection, stored in R2/MinIO via the S3 storage adapter.

## Production

```
pnpm build
pnpm start
```

## Questions

[Payload Docs](https://payloadcms.com/docs) · [Discord](https://discord.com/invite/payload)
