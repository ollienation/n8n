# n8n with PostgreSQL (Docker Compose)

(AI generated README)

This setup runs [n8n](https://n8n.io) with PostgreSQL as its database using Docker Compose.
All configuration is handled via Compose and environment variables.

## Features

- **Reliable startup**: n8n waits for PostgreSQL to be healthy before connecting.
- **Strong defaults**: All credentials and database names configured via a simple `.env` file.
- **No image overrides**: Uses the official images for both services.
- **Simple management**: Single command to start, stop, and reset.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed (v2 or newer recommended)
- Ubuntu or other Linux OS

## How to Use

### 1. Configure Credentials

Copy the provided `.env` example or create your own in the project root:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=AdminPass
POSTGRES_DB=n8n
POSTGRES_NON_ROOT_USER=n8n_user
POSTGRES_NON_ROOT_PASSWORD=UserPass
```

> **Change all passwords and usernames before deploying in production!**

### 2. Start the Stack

```bash
docker compose up -d
```

This will:

- Create Docker volumes for persistent Postgres and n8n storage
- Initialize the Postgres DB and create a non-root user (via `init-data.sh`)
- Launch n8n, waiting until the database is ready

### 3. Access n8n

Open [http://localhost:5678](http://localhost:5678) in your browser.

### 4. Stop the Stack

```bash
docker compose down
```

### 5. Reset Everything

**Warning:** This deletes all data!

```bash
docker compose down -v
```

## Configuration Files

### `.env`

Defines usernames and passwords for Postgres and n8n. Change as needed.

### `init-data.sh`

Ensures a non-root user is created for n8n in the database on first startup (uses quoted identifiers for compatibility).

Example contents:

```bash
#!/bin/bash
set -e

if [ -n "${POSTGRES_NON_ROOT_USER:-}" ] && [ -n "${POSTGRES_NON_ROOT_PASSWORD:-}" ]; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER "${POSTGRES_NON_ROOT_USER}" WITH PASSWORD '${POSTGRES_NON_ROOT_PASSWORD}';
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO "${POSTGRES_NON_ROOT_USER}";
    GRANT CREATE ON SCHEMA public TO "${POSTGRES_NON_ROOT_USER}";
EOSQL
else
  echo "SETUP INFO: No Environment variables given!"
fi
```

## Troubleshooting

- **Check logs**

```
docker compose logs -f n8n
docker compose logs -f postgres
```

- **If services fail to start:** - Ensure `.env` has correct values - Ensure `init-data.sh` is executable:
  `chmod +x init-data.sh` - Run `docker compose down -v` to reset state and try again
- **For production:**
  - Use secure and unique credentials
  - Set up volumes with backups
  - Consider HTTPS and user auth in n8n

## References

- [n8n Documentation](https://docs.n8n.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

Enjoy your automated workflows with n8n and PostgreSQL!
