# RDS for MySQL 8.0 -> 8.4 LTS Upgrade Runbook

## Why this exists

AWS RDS for MySQL 8.0 reaches end of standard support on July 31, 2026.
Starting August 1, 2026, instances still on 8.0 are either billed for Amazon RDS Extended Support (higher per-vCPU monthly cost, available for up to three years) or force-upgraded by AWS during a scheduled maintenance window.
The recommended path is to upgrade to MySQL 8.4 LTS before the deadline so we avoid Extended Support charges and stay on a supported major version.

## Affected resource

- AWS account: 024863982102
- Region: us-east-2
- Service: RDS for MySQL 8.0 (HomeLink shared team database, schema `homelink_db`)
- AWS Health event: `AWS_RDS_PLANNED_LIFECYCLE_EVENT`, start time Fri, 31 Jul 2026 07:00:00 GMT

## Codebase compatibility assessment

The application is already compatible with MySQL 8.4 LTS, so this is an infrastructure task rather than a code change.
The findings below were verified against the `backend` module.

- Driver: `com.mysql:mysql-connector-j` is pinned to `9.2.0` in `backend/pom.xml`, which supports MySQL 8.0, 8.4 LTS, and 9.x servers.
- Hibernate dialect: `org.hibernate.dialect.MySQLDialect` is generic and not pinned to a server version.
- Schema management: `spring.jpa.hibernate.ddl-auto` is `update` in the default profile and `validate` in the `prod` profile, so the prod profile will fail fast if the post-upgrade schema drifts.
- SQL surface: only JPQL queries are used (`ServiceRepository`), with no native queries and no version-specific SQL.
- Column types: only `TEXT` columns are declared, with no JSON columns, fulltext indexes, or deprecated `utf8mb3` charsets that commonly break across major versions.
- Connection string: the JDBC URL now uses `sslMode=REQUIRED` instead of the deprecated `useSSL`/`requireSSL` params.

## Pre-upgrade checklist

- Confirm the resolved driver version with `./mvnw dependency:tree -Dincludes=com.mysql:mysql-connector-j` and verify it reports `9.2.0`.
- Confirm whether the account is enrolled in or opted out of Extended Support, because that determines what AWS does automatically after July 31, 2026.
- Identify a maintenance window with the team and notify any active users of expected downtime.
- Verify a current automated backup or snapshot exists before making any changes.

## Upgrade procedure

The order below keeps all risk off the production critical path until the final cutover.

1. Take a manual snapshot of the production instance.
   This is the rollback point and the source for the test instance.
2. Restore the snapshot to a temporary test instance.
   Do not run the upgrade against production yet.
3. Run the major-version upgrade to MySQL 8.4 on the test instance.
   Record how long it takes, since duration scales with the number of objects in the database and informs the real maintenance window.
4. Point a staging or local backend at the upgraded test instance and start it with the `prod` profile so `ddl-auto=validate` runs.
   A clean startup means Hibernate's entity mappings still match the upgraded schema.
5. Run the backend test suite against the upgraded test instance and exercise the main API flows.
6. Perform the production cutover using an RDS Blue/Green deployment to minimize downtime.
   Blue/Green builds the upgraded green environment in parallel and switches over with minimal interruption.
7. Tear down the temporary test instance and the green environment leftovers once the cutover is verified.

## Rollback

- Before cutover: simply discard the test instance, because production was never touched.
- After cutover: restore from the manual snapshot taken in step 1 to a new instance and repoint the application, since a MySQL major version upgrade is not reversible in place.

## Post-upgrade verification

- Confirm the RDS console reports engine version 8.4.x.
- Confirm the backend starts cleanly on the `prod` profile with `ddl-auto=validate`.
- Confirm core flows work end to end: authentication, service listing, and service requests.
- Confirm Extended Support charges are not accruing on the account billing dashboard.

## References

- RDS Extended Support: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/extended-support.html
- Upgrading database versions: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.MySQL.html
- Blue/Green deployments: https://aws.amazon.com/blogs/aws/new-fully-managed-blue-green-deployments-in-amazon-aurora-and-amazon-rds/
- Creating a snapshot: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html
