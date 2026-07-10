#!/usr/bin/env bash
#
# Dumps the HomeLink MySQL database to a portable .sql file.
# Use this to get your data off AWS RDS before the account's credits or free
# plan lapse, and to load it into the new managed database after migrating.
#
# Usage:
#   DB_HOST=<rds-endpoint> DB_USER=admin DB_NAME=homelink_db ./backup-db.sh
#
# You will be prompted for the password (it is never echoed or stored).
# Requires the mysql client tools (mysqldump) to be installed locally.

set -euo pipefail

DB_HOST="${DB_HOST:?Set DB_HOST to the database endpoint}"
DB_USER="${DB_USER:-admin}"
DB_NAME="${DB_NAME:-homelink_db}"
DB_PORT="${DB_PORT:-3306}"

OUT_DIR="${OUT_DIR:-.}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUT_FILE="${OUT_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql"

echo "Dumping ${DB_NAME} from ${DB_HOST}:${DB_PORT} as ${DB_USER}..."

# --single-transaction gives a consistent snapshot without locking the tables.
# --routines and --triggers preserve stored programs and triggers.
mysqldump \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --user="${DB_USER}" \
  --password \
  --single-transaction \
  --routines \
  --triggers \
  --databases "${DB_NAME}" \
  > "${OUT_FILE}"

echo "Backup written to ${OUT_FILE}"
echo "Store this file somewhere durable that does not live inside the AWS account."
