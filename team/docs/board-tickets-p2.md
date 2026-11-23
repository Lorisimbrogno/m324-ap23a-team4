# GitHub Projects Board – Aufgaben & Tickets (P2 & Praxisstart)

Dieses Dokument enthält alle vorbereiteten Tickets und Aufgabenkarten für das [GitHub Project Board (M324 Team 4 Board)](https://github.com/orgs/m324-ap23a-team4/projects/1) zur Umsetzung von **P2: Applikation v1.0** und **P3: Continuous Integration**.

Jedes Teammitglied kann sein Ticket direkt hier entnehmen. Alle Akzeptanzkriterien, Endpunkt-Spezifikationen, Testfälle und Verlinkungen sind vollständig definiert.

---

## Übersicht der Spalten auf dem Kanban-Board

```text
[ 1. Backlog ] ──► [ 2. Ready ] ──► [ 3. In Progress ] ──► [ 4. In Review ] ──► [ 5. Done ]
```
- **WIP-Limit für `In Progress`:** Maximal 1–2 Tasks pro Person.
- **Review:** Jeder Pull Request benötigt mindestens 1 Review/Approval gemäss `CODEOWNERS` und grüne CI.

---

## 📌 Tickets für das Project Board

### Ticket #5: Walking Skeleton MS1 (GET /health)
- **Repository:** [`m324-ap23a-team4/ms1`](https://github.com/m324-ap23a-team4/ms1)
- **Zuständig (Assignee):** Karol Jakub (@KarolJakubGroups) & Loris Imbrogno (@Lorisimbrogno)
- **Status im Board:** `In Progress`
- **Labels:** `architecture`, `dev`, `p2`, `walking-skeleton`
- **Priorität:** Hoch (Blocker für weitere Entwicklung)
- **Ziel / Kontext (B2-K03):**  
  Einrichten des minimalen, lauffähigen Microservices `ms1` (Ortschaften-Verwaltung) mit Node.js 20 LTS, Express und TypeScript, inkl. Healthcheck-Endpunkt `GET /health` und Dockerfile. Das Walking Skeleton dient als lauffähiger Durchstich durch alle Schichten, um Integrationsrisiken früh aufzudecken.

#### Technische Umsetzung:
1. Im Verzeichnis `ms1/`:
   ```bash
   npm init -y
   npm install express dotenv pg
   npm install -D typescript @types/node @types/express ts-node tsx @types/pg
   ```
2. `tsconfig.json` anlegen mit `"target": "ES2022"`, `"module": "commonjs"`, `"outDir": "./dist"`.
3. `src/server.ts` erstellen:
   - Liest `PORT` aus `process.env.PORT || 3000`.
   - Endpunkt `GET /health` implementieren:
     ```json
     {
       "status": "ok",
       "service": "ms1",
       "uptime": 12.34,
       "timestamp": "2026-11-23T10:00:00.000Z"
     }
     ```
     Liefert HTTP Status `200 OK`.
4. `package.json` Scripts definieren:
   - `"dev": "tsx watch src/server.ts"`
   - `"build": "tsc"`
   - `"start": "node dist/server.js"`
   - `"test": "node --test"`
5. `Dockerfile` erstellen (Multi-Stage Build auf `node:20-alpine`).

#### Akzeptanzkriterien:
- [ ] `npm run dev` startet den Server lokal auf Port 3000 (oder `PORT`).
- [ ] `curl http://localhost:3000/health` antwortet mit `200 OK` und Status JSON.
- [ ] `docker build -t ms1:test .` baut fehlerfrei.
- [ ] Git-Branch: `feat/ms1-walking-skeleton` -> Pull Request nach `main` mit mindestens 1 Approval von Ops.

#### Verlinkungen:
- [Projekt 5 Auftrag](https://gitlab.com/ch-tbz-it/Stud/m324/-/blob/nuy/Projekt/Applikationen/Projekt5_Immobilien.md)
- [Team-Vereinbarung Dev ↔ Ops](https://github.com/m324-ap23a-team4/team/blob/main/docs/team-vereinbarung.md)

---

### Ticket #6: Walking Skeleton MS2 (GET /health)
- **Repository:** [`m324-ap23a-team4/ms2`](https://github.com/m324-ap23a-team4/ms2)
- **Zuständig (Assignee):** Karol Jakub (@KarolJakubGroups) & Marvin Kropf (@MarvinKropf2)
- **Status im Board:** `In Progress`
- **Labels:** `architecture`, `dev`, `p2`, `walking-skeleton`
- **Priorität:** Hoch (Blocker für weitere Entwicklung)
- **Ziel / Kontext:**  
  Minimaler lauffähiger Service für Microservice 2 (Immobilien-Verwaltung) mit Node.js 20, TypeScript, Express, `GET /health` und Dockerfile.

#### Technische Umsetzung:
1. Im Verzeichnis `ms2/`: `npm init -y`
2. Gleicher Tech-Stack wie MS1 (Express, TypeScript, Dockerfile).
3. `src/server.ts`:
   - Liest `PORT` (Default: 3000)
   - Liest `MS1_URL` (Default: `http://localhost:3001` bzw. `http://ms1:3000`).
   - Endpunkt `GET /health` liefert `200 OK` mit `{ "status": "ok", "service": "ms2" }`.
4. `Dockerfile` identisch zu MS1 erstellen.

#### Akzeptanzkriterien:
- [ ] `npm run dev` startet lokal.
- [ ] `GET /health` liefert `200 OK`.
- [ ] `docker build -t ms2:test .` baut fehlerfrei.
- [ ] Git-Branch: `feat/ms2-walking-skeleton` -> Pull Request mit mindestens 1 Approval.

#### Verlinkungen:
- [Team-Vereinbarung](https://github.com/m324-ap23a-team4/team/blob/main/docs/team-vereinbarung.md)

---

### Ticket #7: Docker Compose Setup (infra)
- **Repository:** [`m324-ap23a-team4/infra`](https://github.com/m324-ap23a-team4/infra)
- **Zuständig (Assignee):** Loris Imbrogno (@Lorisimbrogno) & Cedric Fischer (@cedi254)
- **Status im Board:** `In Progress`
- **Labels:** `ops`, `infrastructure`, `docker`, `p2`
- **Priorität:** Hoch
- **Ziel / Kontext (B4-K02 & B4-K03):**  
  Erstellen der `docker-compose.yml` zur Orchestrierung aller Container für Entwicklung und Testen (*Database-per-Service Pattern* & *12-Factor App*).

#### Architektur & Port-Mapping:
- `ms1`: Container Port 3000 -> Host Port `3001`
- `db-ms1`: PostgreSQL 16-alpine, Container Port 5432 -> Host Port `5433`, Volume `db_ms1_data`
- `ms2`: Container Port 3000 -> Host Port `3002`, Environment `MS1_URL=http://ms1:3000`
- `db-ms2`: PostgreSQL 16-alpine, Container Port 5432 -> Host Port `5434`, Volume `db_ms2_data`
- Gemeinsames Docker-Netzwerk `immo-net`.

#### Technische Umsetzung:
1. `infra/docker-compose.yml` erstellen mit Healthchecks für Postgres (`pg_isready -U postgres`).
2. `infra/.env.example` erstellen mit Standard-Zugangsdaten.
3. `infra/README.md` dokumentieren: Start-, Stopp- und Log-Befehle.

#### Akzeptanzkriterien:
- [ ] `docker compose up -d` startet alle 4 Container ohne Konflikte.
- [ ] `curl http://localhost:3001/health` antwortet (MS1).
- [ ] `curl http://localhost:3002/health` antwortet (MS2).
- [ ] Branch `feat/docker-compose-setup` -> PR gemergt.

#### Verlinkungen:
- [Runbook & Infra Doku](https://github.com/m324-ap23a-team4/infra)

---

### Ticket #8: US1: Ortschaften erfassen (POST /ortschaften)
- **Repository:** [`m324-ap23a-team4/ms1`](https://github.com/m324-ap23a-team4/ms1)
- **Zuständig (Assignee):** Marvin Kropf (@MarvinKropf2)
- **Status im Board:** `Ready`
- **Labels:** `feature`, `user-story`, `p2`
- **Priorität:** Hoch
- **User Story:**  
  *Als Administrator des Systems möchte ich neue Ortschaften mit den relevanten Eigenschaften erfassen können, damit die Ortschaftsdaten zentral verwaltet und für weitere Prozesse genutzt werden können.*

#### Endpunkt-Spezifikation:
- **Methode:** `POST /ortschaften`
- **Request Body (JSON):**
  ```json
  {
    "name": "Niederhasli",
    "plz": "8155",
    "gruendungsdatum": "1899-05-15",
    "einwohner": 5543
  }
  ```
- **Response Erfolg (`201 Created`):**
  ```json
  {
    "id": "c3f8a4b2-9d1e-4f7a-8b2c-1e4d5a6b7c8d",
    "name": "Niederhasli",
    "plz": "8155",
    "gruendungsdatum": "1899-05-15",
    "einwohner": 5543
  }
  ```
- **Response Validierungsfehler (`400 Bad Request`):**
  ```json
  {
    "error": "Validierungsfehler: Einwohnerzahl muss positiv sein.",
    "field": "einwohner"
  }
  ```

#### Validierungsregeln:
1. `name`: Pflichtfeld, String, mind. 2 Zeichen.
2. `plz`: Pflichtfeld, gültiges Postleitzahl-Format, **keine Duplikate** in der DB.
3. `gruendungsdatum`: Pflichtfeld, gültiges Datumsformat (`YYYY-MM-DD`).
4. `einwohner`: Pflichtfeld, Ganzzahl `>= 0`.

#### Unit Tests (mind. 2–3 Tests mit JavaDoc/TSDoc):
1. *Happy Path:* Gültige Ortschaft übergeben -> Status 201, ID generiert, Ortschaft gespeichert.
2. *Sad Path 1 (Negative Einwohner):* `einwohner: -50` -> Status 400 mit Fehlermeldung.
3. *Sad Path 2 (Doppelte PLZ):* Versuch, bereits existierende PLZ erneut anzulegen -> Status 400.
4. *Sad Path 3 (Fehlende Pflichtfelder):* Fehlender Name -> Status 400.

#### Akzeptanzkriterien:
- [ ] Endpunkt implementiert und validiert.
- [ ] Mindestens 3 Unit Tests laufen isoliert durch (`npm test`).
- [ ] TSDoc / JavaDoc Kommentare für alle Testfälle vorhanden.
- [ ] Branch `feat/us1-create-ortschaft` -> PR geöffnet und Review erhalten.

---

### Ticket #9: US2: Ortschaften auslesen (GET /ortschaften)
- **Repository:** [`m324-ap23a-team4/ms1`](https://github.com/m324-ap23a-team4/ms1)
- **Zuständig (Assignee):** Andrin Ruegg (@AriesDevlo)
- **Status im Board:** `Ready`
- **Labels:** `feature`, `user-story`, `p2`
- **Priorität:** Hoch
- **User Story:**  
  *Als Administrator des Systems möchte ich alle erfassten Ortschaften auslesen können, damit ich eine Übersicht der bereits erfassten Orte erhalte.*

#### Endpunkt-Spezifikation:
- **Methode:** `GET /ortschaften`
- **Zusätzlicher Detail-Endpunkt:** `GET /ortschaften/:id` (wichtig für die Validierung durch MS2!)
- **Response bei Daten (`200 OK`):**
  ```json
  [
    {
      "id": "c3f8a4b2-9d1e-4f7a-8b2c-1e4d5a6b7c8d",
      "name": "Niederhasli",
      "plz": "8155",
      "gruendungsdatum": "1899-05-15",
      "einwohner": 5543
    }
  ]
  ```
- **Response wenn leer (`200 OK`):**
  ```json
  []
  ```
- **Response bei ID nicht gefunden (`404 Not Found` bei `GET /ortschaften/:id`):**
  ```json
  { "error": "Ortschaft mit ID c3f8... nicht gefunden" }
  ```

#### Unit Tests (mind. 2–3 Tests mit JavaDoc/TSDoc):
1. *Happy Path:* Datenbank liefert 2 Datensätze -> Status 200, Array mit 2 Objekten und allen Feldern.
2. *Happy Path (Empty):* Keine Ortschaften in DB -> Status 200 mit `[]`.
3. *Happy Path Einzelabruf:* `GET /ortschaften/:id` existiert -> Status 200 mit Objekt.
4. *Sad Path Einzelabruf:* `GET /ortschaften/:id` existiert nicht -> Status 404.

#### Akzeptanzkriterien:
- [ ] Endpunkte implementiert.
- [ ] Mindestens 3 Unit Tests isoliert grün.
- [ ] Ausführliche TSDoc/JavaDoc Testdokumentation.
- [ ] Branch `feat/us2-get-ortschaften` -> PR gemergt.

---

### Ticket #10: US3: Immobilie erfassen (POST /immobilien)
- **Repository:** [`m324-ap23a-team4/ms2`](https://github.com/m324-ap23a-team4/ms2)
- **Zuständig (Assignee):** Karol Jakub (@KarolJakubGroups)
- **Status im Board:** `Ready`
- **Labels:** `feature`, `user-story`, `p2`, `microservice-comm`
- **Priorität:** Hoch
- **User Story:**  
  *Als Administrator des Systems möchte ich neue Immobilien erfassen können, wobei die Ortschaft gegen den ersten Microservice validiert wird.*

#### Endpunkt-Spezifikation:
- **Methode:** `POST /immobilien`
- **Request Body (JSON):**
  ```json
  {
    "typ": "Haus",
    "zimmer": 5.5,
    "flaeche": 145.0,
    "ortschaftId": "c3f8a4b2-9d1e-4f7a-8b2c-1e4d5a6b7c8d",
    "preis": 1250000,
    "verkaufsdatum": null
  }
  ```
- **Response Erfolg (`201 Created`):**
  ```json
  {
    "id": "e9b1c2d3-4a5f-6e7b-8c9d-0a1b2c3d4e5f",
    "typ": "Haus",
    "zimmer": 5.5,
    "flaeche": 145.0,
    "ortschaftId": "c3f8a4b2-9d1e-4f7a-8b2c-1e4d5a6b7c8d",
    "preis": 1250000,
    "verkaufsdatum": null,
    "createdAt": "2026-11-23T10:15:00.000Z"
  }
  ```
- **Response wenn Ortschaft ungültig (`400 Bad Request`):**
  ```json
  {
    "error": "Validierungsfehler: Angegebene Ortschaft existiert nicht in MS1.",
    "field": "ortschaftId"
  }
  ```

#### Kritische Architektur-Vorgabe (*Microservice-Kommunikation*):
- **WICHTIG:** MS2 darf **NICHT** in die Datenbank von MS1 schauen!
- MS2 sendet einen HTTP-Request an `${MS1_URL}/ortschaften/${ortschaftId}`.
- Antwortet MS1 mit 200 -> Ortschaft ist valide, Immobilie wird gespeichert.
- Antwortet MS1 mit 404 oder Fehler -> HTTP 400 an Client zurückgeben.

#### Unit Tests (mind. 2–3 Tests mit Mocking des HTTP-Aufrufs an MS1):
1. *Happy Path:* Valide Immobilie, MS1-HTTP-Aufruf wird gemockt (liefert 200 OK) -> Status 201 Created.
2. *Sad Path 1 (Ortschaft existiert nicht):* MS1-HTTP-Aufruf liefert 404 -> Status 400 mit Fehlermeldung.
3. *Sad Path 2 (Ungültige Werte):* `zimmer: -2` oder `preis: 0` -> Status 400.
4. Alle Tests laufen unabhängig und isoliert ohne laufenden MS1 Server.

#### Akzeptanzkriterien:
- [ ] Endpunkt implementiert.
- [ ] HTTP-Client für MS1-Call mit Timeout und Error-Handling.
- [ ] Unit Tests grün mit gemocktem MS1-Call.
- [ ] Branch `feat/us3-create-immobilie` -> PR gereviewt.

---

### Ticket #11: GitHub Actions CI-Pipelines (ms1 & ms2)
- **Repository:** [`m324-ap23a-team4/ms1`](https://github.com/m324-ap23a-team4/ms1) & [`m324-ap23a-team4/ms2`](https://github.com/m324-ap23a-team4/ms2)
- **Zuständig (Assignee):** Cedric Fischer (@cedi254) & Loris Imbrogno (@Lorisimbrogno)
- **Status im Board:** `In Progress`
- **Labels:** `ci`, `ops`, `automation`, `p3`
- **Priorität:** Mittel / Kontinuierlich
- **Ziel / Kontext (B3-K01 & B3-K02):**  
  Ablösen der Dummy-Echo-Pipelines durch vollständige, automatisierte CI-Pipelines in `.github/workflows/ci.yml`.

#### Pipeline-Schritte (Fail Fast):
1. `Checkout Code`: Repository auschecken (`actions/checkout@v4`).
2. `Setup Node.js`: Node.js 20 LTS mit Cache für `npm`.
3. `Install Dependencies`: `npm ci` (verbindlich für reproduzierbare Builds).
4. `Run Linter`: `npm run lint` (statischer Code-Check).
5. `Build Code`: `npm run build` (TypeScript Compiler).
6. `Run Unit Tests`: `npm test` (Unit Tests ausführen).

#### Akzeptanzkriterien:
- [ ] Pipeline triggert auf `push` und `pull_request` bei Änderungen im jeweiligen Ordner (`ms1/**` bzw. `ms2/**`).
- [ ] Pipeline bricht bei einem fehlerhaften Test sofort ab (Status rot, PR Merge blockiert).
- [ ] Ausführungszeit unter 2 Minuten.
- [ ] Branch `ci/setup-real-pipelines` -> PR gemergt.

---

### Ticket #12: API-Doku & Test-Standard (team)
- **Repository:** [`m324-ap23a-team4/team`](https://github.com/m324-ap23a-team4/team)
- **Zuständig (Assignee):** Marvin Kropf (@MarvinKropf2) & Cedric Fischer (@cedi254)
- **Status im Board:** `Ready`
- **Labels:** `documentation`, `p2`
- **Priorität:** Normal
- **Ziel / Kontext:**  
  Zentrale Dokumentation der API-Spezifikation in `team/docs/api-spezifikation.md` und Erklärung des Test-Standards (JavaDoc / TSDoc, Testpyramide) für die Leistungsbeurteilung durch die Lehrperson.

#### Akzeptanzkriterien:
- [ ] Datei `team/docs/api-spezifikation.md` erstellt.
- [ ] Alle Endpunkte (`GET /health`, `POST /ortschaften`, `GET /ortschaften`, `POST /immobilien`) mit Request/Response-JSON dokumentiert.
- [ ] Testpyramiden-Nachweis: Aufstellung aller Unit Tests mit Happy/Sad Path Dokumentation.
- [ ] Im `team/README.md` verlinkt.
