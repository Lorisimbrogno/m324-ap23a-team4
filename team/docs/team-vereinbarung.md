# Team-Vereinbarung & Vertrag (Dev ↔ Ops)

Diese Vereinbarung legt die Arbeitsweise, Qualitätskriterien und Schnittstellen zwischen Entwicklung (Dev) und Betrieb (Ops) fest.

## 1. Rollenverteilung
- **Phase A:**
  - **Dev (Teilgruppe A):** Hauptverantwortung für `ms1` und `ms2` (Code, Unit Tests, Dockerfile, App-Logik).
  - **Ops (Teilgruppe B):** Hauptverantwortung für `infra` (Docker Compose, CI/CD-Deployment, Monitoring, Runbook).
- **Phase B:**
  - Rollentausch gemäss Modulvorgabe.

## 2. Git Workflow & Branching
1. **Kein direkter Push auf `main`:** Alle Änderungen erfolgen über Feature-Branches (z.B. `feat/user-story-1`, `fix/db-connection`).
2. **Pull Requests (PR):**
   - Jeder PR benötigt mindestens **ein Approval** eines anderen Teammitglieds.
   - Alle CI-Checks (Tests, Linting, Docker-Build) müssen **grün** sein.
3. **Commit Messages:** Nach Conventional Commits (`feat: ...`, `fix: ...`, `docs: ...`, `ci: ...`).

## 3. Schnittstelle Dev ↔ Ops
- Dev liefert ein funktionierendes, getestetes **Dockerfile** für jeden Microservice.
- Dev stellt sicher, dass Services über Umgebungsvariablen (`PORT`, `DATABASE_URL`, etc.) konfigurierbar sind.
- Dev implementiert einen standardisierten Healthcheck-Endpunkt: `GET /health`.
- Ops stellt sicher, dass `docker-compose.yml` und die Deployment-Pipeline die Container sauber orchestrieren und deployen können.
- Ops dokumentiert alle Betriebsabläufe und Störungsbehebungen im Runbook.

## 4. Kommunikation & Zeitlogging
- Zeitlogging wird täglich bzw. nach jeder Arbeitseinheit aktuell gehalten.
- Blocker werden sofort im Gruppenchat angesprochen.
