# Bibliotech — Run & Debug Guide

This project requires Java 17 to build and run. To avoid cryptic compiler/runtime errors (e.g. `UnsupportedClassVersionError`, `TypeTag :: UNKNOWN`), make sure Maven and the JVM that executes plugins are also Java 17.

Quick options to run the backend:

1) Local JDK 17 (recommended for development)

PowerShell (temporary for session):

```powershell
$env:JAVA_HOME='C:\Path\To\jdk-17'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
cd D:\projetocc\projetofinal4
# build
.\mvnw.cmd -DskipTests clean package
# run
.\mvnw.cmd spring-boot:run
# or run the packaged jar
java -jar target\api-0.0.1-SNAPSHOT.jar
```

2) Docker (best for reproducible environments)

From repository root:

```bash
# build and run DB + API
docker compose up --build
# stop
docker compose down
```

The `docker-compose.yml` provides a MySQL service (database `bibliotechapi`) and the `api` service.

Why this was necessary

- The codebase uses Java 17 features (records, newer annotation processors). If Maven or the JVM running Maven is older, plugin classes or the compiler will fail. The project now includes a `maven-enforcer-plugin` rule and `maven-compiler-plugin` configured for `release 17` so builds fail with clear messages instead of cryptic errors.

Troubleshooting

- If `.
mvnw.cmd spring-boot:run` fails with `UnsupportedClassVersionError`:
  - Check `.
mvnw.cmd -v` to see which Java the Maven wrapper is using.
  - Ensure your `JAVA_HOME` points to a JDK 17 and restart your shell.

- If the frontend shows `ECONNREFUSED` when proxying to the backend:
  - Ensure the backend is listening on `http://localhost:8080` (or run with Docker which maps port 8080).

Next improvements you can enable

- Add a `docker-compose` service for the frontend dev server to test the whole system with `npm start` inside a container.
- Add Maven Toolchains if your team needs to manage multiple JDKs centrally.

If you'd like, I can:
- Add a small PowerShell wrapper script to set `JAVA_HOME` automatically (requires you to choose JDK install path), or
- Add a `Dockerfile` + `docker-compose` entry for the frontend and provide a one-command dev environment.

Which would you like next?