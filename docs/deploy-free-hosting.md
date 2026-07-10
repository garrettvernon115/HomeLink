# Migrating HomeLink off AWS to Free Hosting

## Why

The AWS account is on the Free Plan with limited credits, and access to all resources is lost when the credits run out or the plan period ends.
The current stack (S3 + CloudFront frontend, Elastic Beanstalk backend, RDS MySQL) bills continuously just by being online.
Moving the demo to free tiers keeps it permanently live, stops the credit drain, and makes the MySQL 8.0 end-of-support deadline irrelevant.

## Target architecture

- Frontend (Angular static build): Cloudflare Pages.
- Backend (Spring Boot, Dockerized): Render.
- Database (MySQL): Railway managed MySQL.

## What is already prepared in the repo

- `backend/Dockerfile` builds and runs the Spring Boot jar with no local Maven needed.
- `backend/.dockerignore` keeps the build context small and excludes the real secrets file.
- `backend/scripts/backup-db.sh` dumps the database to a portable `.sql` file.
- `application.properties` now reads `server.port` from the `PORT` env var that Render injects.
- CORS origins already come from the `cors.allowed-origins` property, which Render can set via the `CORS_ALLOWED_ORIGINS` environment variable.
- `frontend/public/_redirects` gives Cloudflare Pages the single-page-app fallback for deep links.
- `frontend/src/environments/environment.prod.ts` has a placeholder `apiUrl` to point at the Render backend.

## Order of operations

Do these in order, because later steps depend on URLs produced by earlier ones.

### Step 1 - Back up the data (do this first)

Install the MySQL client tools locally, then run the backup script against the live RDS endpoint.

```bash
cd backend/scripts
DB_HOST=<rds-endpoint> DB_USER=admin DB_NAME=homelink_db bash backup-db.sh
```

You will be prompted for the password.
This writes `homelink_db_backup_<timestamp>.sql`.
Store it somewhere that does not live inside the AWS account.

### Step 2 - Stand up the database on Railway

1. Create a Railway account and a new project, then add a MySQL database.
2. From the database's Connect tab, note the host, port, database name, username, and password.
3. Load your backup into it:

```bash
mysql --host=<railway-host> --port=<railway-port> \
  --user=<railway-user> --password <railway-db-name> < homelink_db_backup_<timestamp>.sql
```

### Step 3 - Deploy the backend to Render

1. Create a Render account and choose New > Web Service, connected to the GitHub repo.
2. Set the root directory to `backend` and the runtime to Docker (Render will use `backend/Dockerfile`).
3. Add these environment variables:
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `DB_URL` = `jdbc:mysql://<railway-host>:<railway-port>/<railway-db-name>?sslMode=REQUIRED`
   - `DB_USERNAME` = the Railway username
   - `DB_PASSWORD` = the Railway password
   - `JWT_SECRET` = a long random string
   - `CORS_ALLOWED_ORIGINS` = leave as a placeholder for now; you set it in Step 5
4. Deploy, then copy the resulting service URL, for example `https://homelink-backend.onrender.com`.

Note on the database schema:
The `prod` profile runs Hibernate with `ddl-auto=validate`, which expects the schema to already exist.
Loading the dump in Step 2 satisfies that.
If you ever start against an empty database, set `SPRING_JPA_HIBERNATE_DDL_AUTO=update` for the first boot so Hibernate creates the tables, then remove it.

Note on SSL:
If the backend cannot connect with `sslMode=REQUIRED`, try `sslMode=PREFERRED` in `DB_URL`, since some managed endpoints negotiate SSL differently.

### Step 4 - Deploy the frontend to Cloudflare Pages

1. Set `apiUrl` in `frontend/src/environments/environment.prod.ts` to the Render URL from Step 3, then commit and push.
2. Create a Cloudflare Pages project connected to the GitHub repo.
3. Configure the build:
   - Root directory: `frontend`
   - Build command: `npm ci && npm run build`
   - Build output directory: `dist/frontend/browser`
4. Deploy, then copy the resulting Pages URL, for example `https://homelink.pages.dev`.

### Step 5 - Connect CORS and verify

1. In Render, set `CORS_ALLOWED_ORIGINS` to the Cloudflare Pages URL from Step 4 (no trailing slash), then trigger a redeploy or restart so the backend picks it up.
2. Open the Pages URL and confirm login, service listing, and service requests all work against the Render backend.
3. Update the live demo link in `README.md` and on the portfolio site to the new Pages URL.

### Step 6 - Tear down AWS to stop the credit drain

Once the new demo is verified end to end, remove the AWS resources so they stop consuming credits.

1. Delete the Elastic Beanstalk environment (this also removes its EC2 instance and any load balancer).
2. Delete the RDS instance (you already have the backup from Step 1).
3. Delete the S3 bucket and CloudFront distribution that served the old frontend.
4. Confirm in Cost Explorer that the daily charges have dropped to zero.

Keep the `.sql` backup for a while as a safety net even after teardown.

## Rollback

Nothing here is destructive until Step 6.
If the new hosting does not work out, the original AWS stack keeps running until you tear it down, so you can debug the migration without losing the live demo.
