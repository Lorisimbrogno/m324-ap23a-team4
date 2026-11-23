# GitHub Projects Board – Aufgaben & Tickets (P2 & Praxisstart)

Dieses Dokument enthält alle vorbereiteten Tickets und Aufgabenkarten für das [GitHub Project Board (M324 Team 4 Board)](https://github.com/orgs/m324-ap23a-team4/projects/1) zur Umsetzung von **P2: Applikation v1.0** und **P3: Continuous Integration**.

---

## Übersicht der Spalten auf dem Kanban-Board

```text
[ 1. Backlog ] ──► [ 2. Ready ] ──► [ 3. In Progress ] ──► [ 4. In Review ] ──► [ 5. Done ]
```
- **WIP-Limit für `In Progress`:** Maximal 1–2 Tasks pro Person.
- **Review:** Jeder Pull Request benötigt mindestens 1 Review/Approval gemäss `CODEOWNERS` und grüne CI.

---

## 📌 Tickets für das Project Board

### Ticket #2: Walking Skeleton MS1 (Ortschaften-Service)
- **Repository:** `m324-ap23a-team4/ms1`
- **Zuständig (Assignee):** Karol Jakub (@KarolJakubGroups) / Andrin Ruegg (@AriesDevlo)
- **Spalte Start:** `In Progress`
- **Labels:** `architecture`, `dev`, `p2`, `walking-skeleton`
- **Priorität:** Hoch (Blocker für weitere Entwicklung)
- **Beschreibung:**  
  Aufsetzen des Basis-Projekts für Microservice 1 (Ortschaften) mit Node.js 20 LTS, Express und TypeScript.
- **Akzeptanzkriterien:**
  1. `package.json` mit Scripts (`dev`, `build`, `test`, `lint`) ist initialisiert.
  2. Endpunkt `GET /health` liefert Status `200 OK` mit JSON `{ "status": "ok", "service": "ms1" }`.
  3. Konfiguration über Umgebungsvariable `PORT` (Default: `3000`).
  4. Schlankes, lauffähiges `Dockerfile` (Multi-stage Build empfohlen).
  5. Testrunner (`node:test` oder `vitest`) eingerichtet und führt einen einfachen Test erfolgreich aus.
- **Definition of Done:** Lokal via `npm run dev` und `docker build` lauffähig, PR geöffnet und von Ops gereviewt.

---

### Ticket #3: Walking Skeleton MS2 (Immobilien-Service)
- **Repository:** `m324-ap23a-team4/ms2`
- **Zuständig (Assignee):** Karol Jakub (@KarolJakubGroups) / Marvin Kropf (@MarvinKropf2)
- **Spalte Start:** `In Progress`
- **Labels:** `architecture`, `dev`, `p2`, `walking-skeleton`
- **Priorität:** Hoch (Blocker für weitere Entwicklung)
- **Beschreibung:**  
  Aufsetzen des Basis-Projekts für Microservice 2 (Immobilien) mit Node.js 20 LTS, Express und TypeScript.
- **Akzeptanzkriterien:**
  1. `package.json` mit Scripts (`dev`, `build`, `test`, `lint`) ist initialisiert.
  2. Endpunkt `GET /health` liefert Status `200 OK` mit JSON `{ "status": "ok", "service": "ms2" }`.
  3. Konfiguration über Umgebungsvariable `PORT` (Default: `3000`) und `MS1_URL` (URL zu Microservice 1).
  4. Lauffähiges `Dockerfile`.
  5. Testrunner eingerichtet.
- **Definition of Done:** Lokal lauffähig, PR geöffnet und gereviewt.

---

### Ticket #4: Docker Compose Setup für lokale Multi-Container-Umgebung
- **Repository:** `m324-ap23a-team4/infra`
- **Zuständig (Assignee):** Loris Imbrogno (@Lorisimbrogno) & Cedric Fischer (@cedi254)
- **Spalte Start:** `In Progress`
- **Labels:** `ops`, `infrastructure`, `docker`, `p2`
- **Priorität:** Hoch
- **Beschreibung:**  
  Erstellen der `docker-compose.yml` zur Orchestrierung aller Container für Entwicklung und Testen (*Database-per-Service Pattern*).
- **Akzeptanzkriterien:**
  1. `docker-compose.yml` definiert folgende Services:
     - `ms1` (Ortschaften-API, Port `3001:3000`)
     - `db-ms1` (PostgreSQL 16-alpine, Port `5433:5432` für lokale DB-Tools, Volume persistent)
     - `ms2` (Immobilien-API, Port `3002:3000`, env `MS1_URL=http://ms1:3000`)
     - `db-ms2` (PostgreSQL 16-alpine, Port `5434:5432`, Volume persistent)
  2. Services sind über ein gemeinsames Docker-Netzwerk verbunden.
  3. `depends_on` mit Healthcheck für Datenbanken, damit Services erst starten, wenn die DB bereit ist.
  4. `.env.example` mit Dokumentation der Standard-Passwörter und Ports.
- **Definition of Done:** `docker compose up --build` startet alle Container fehlerfrei hoch, Healthchecks von MS1 und MS2 antworten via `curl`.

---

### Ticket #5: User Story 1 – Ortschaften erfassen (`POST /ortschaften`)
- **Repository:** `m324-ap23a-team4/ms1`
- **Zuständig (Assignee):** Marvin Kropf (@MarvinKropf2)
- **Spalte Start:** `Ready`
- **Labels:** `feature`, `user-story`, `p2`
- **Priorität:** Hoch
- **User Story:**  
  *Als Administrator des Systems möchte ich neue Ortschaften mit den relevanten Eigenschaften erfassen können, damit die Ortschaftsdaten zentral verwaltet und für weitere Prozesse genutzt werden können.*
- **Akzeptanzkriterien:**
  1. Input-Felder: `name` (String), `plz` (String/Nummer), `gruendungsdatum` (Datum/String), `einwohner` (Ganze positive Zahl).
  2. Während der Erfassung wird automatisch eine eindeutige ID (UUID oder fortlaufend) generiert.
  3. Validierung:
     - Pflichtfelder müssen vorhanden sein.
     - Keine doppelten Postleitzahlen.
     - Einwohnerzahl muss eine positive Ganzzahl sein (`>= 0`).
  4. Bei erfolgreicher Erfassung: HTTP Status `201 Created` mit der neu erfassten Ortschaft (inkl. generierter ID) als JSON.
  5. Fehlerhafte Eingaben führen zu HTTP `400 Bad Request` mit klarer Fehlermeldung (`{ "error": "...", "field": "..." }`).
  6. **Unit Tests (mind. 2–3 Tests, isoliert & gemockt):**
     - *Happy Path:* Gültige Daten erfassen -> Status 201 und korrekte Response.
     - *Sad Path 1:* Negative oder ungültige Einwohnerzahl -> Status 400.
     - *Sad Path 2:* Doppelte PLZ / fehlende Pflichtfelder -> Status 400.
  7. Tests sind vollständig mit TSDoc/JavaDoc dokumentiert.
- **Definition of Done:** Code & Tests implementiert, CI grün, PR von Karol oder Andrin gereviewt und gemergt.

---

### Ticket #6: User Story 2 – Alle Ortschaften auslesen (`GET /ortschaften`)
- **Repository:** `m324-ap23a-team4/ms1`
- **Zuständig (Assignee):** Andrin Ruegg (@AriesDevlo)
- **Spalte Start:** `Ready`
- **Labels:** `feature`, `user-story`, `p2`
- **Priorität:** Hoch
- **User Story:**  
  *Als Administrator des Systems möchte ich alle erfassten Ortschaften auslesen können, damit ich eine Übersicht der bereits erfassten Orte erhalte.*
- **Akzeptanzkriterien:**
  1. `GET /ortschaften` liefert eine geordnete Liste aller erfassten Orte zurück.
  2. Alle Felder (`id`, `name`, `plz`, `gruendungsdatum`, `einwohner`) werden vollständig im JSON zurückgegeben.
  3. Falls noch keine Orte vorhanden sind: Rückgabe einer leeren Liste `[]` mit HTTP Status `200 OK`.
  4. Performance: Abruf erfolgt ohne unnötige Verzögerungen.
  5. Fehlerbehandlung: Bei internen Fehlern saubere Rückgabe von HTTP `500 Internal Server Error`.
  6. **Unit Tests (mind. 2–3 Tests, isoliert):**
     - *Happy Path:* Liste mit mehreren Ortschaften wird korrekt serialisiert und zurückgegeben.
     - *Happy Path (Empty):* Leere Datenbank liefert `[]` mit Status 200.
     - *Sad Path:* Fehler in der Datenschicht wirft kontrollierte Fehlermeldung.
  7. Vollständige JavaDoc/TSDoc Dokumentation der Tests.
- **Definition of Done:** Unit Tests grün, Branch gemergt über Pull Request mit Approval.

---

### Ticket #7: User Story 3 – Immobilie erfassen (`POST /immobilien`) mit MS1-Validierung
- **Repository:** `m324-ap23a-team4/ms2`
- **Zuständig (Assignee):** Karol Jakub (@KarolJakubGroups)
- **Spalte Start:** `Ready`
- **Labels:** `feature`, `user-story`, `p2`, `microservice-comm`
- **Priorität:** Hoch
- **User Story:**  
  *Als Administrator des Systems möchte ich neue Immobilien erfassen können, wobei die Ortschaft gegen den ersten Microservice validiert wird.*
- **Akzeptanzkriterien:**
  1. Input-Felder: `typ` ("Haus", "Apartment"), `zimmer` (z.B. 4.5, positive Zahl), `flaeche` (Quadratmeter > 0), `ortschaftId` (ID der Ortschaft), `preis` (Verkaufspreis > 0), `verkaufsdatum` (optional / `null`).
  2. **Microservice-Schnittstelle:**
     - MS2 ruft den Endpunkt von MS1 (`GET /ortschaften` oder `GET /ortschaften/:id`) über HTTP auf, um zu prüfen, ob die `ortschaftId` existiert.
     - **Kein direkter Zugriff auf die MS1-Datenbank!**
     - Existiert die Ortschaft nicht in MS1: HTTP `400 Bad Request` mit Meldung `"Ortschaft existiert nicht"`.
  3. Validierung aller Pflichtfelder (positive Zahlen für Zimmer, Fläche und Preis).
  4. Nach erfolgreicher Erfassung: HTTP Status `201 Created` mit vollständiger Immobilie und generierter ID.
  5. **Unit Tests (mind. 2–3 Tests mit Mocking des HTTP-Aufrufs an MS1):**
     - *Happy Path:* Valide Immobilie, MS1-Mock liefert Ortschaft gefunden -> Status 201.
     - *Sad Path 1:* MS1-Mock meldet "Ortschaft nicht gefunden" -> Status 400.
     - *Sad Path 2:* Ungültige Zimmerzahl (z.B. -1) oder negativer Preis -> Status 400.
  6. Vollständige JavaDoc/TSDoc Dokumentation der Testfälle.
- **Definition of Done:** Isolierte Unit Tests laufen lokal und in der CI ohne laufenden MS1 (da MS1-Call gemockt ist). PR approved und gemergt.

---

### Ticket #8: GitHub Actions CI-Pipelines für MS1 und MS2
- **Repository:** `m324-ap23a-team4/ms1` und `m324-ap23a-team4/ms2`
- **Zuständig (Assignee):** Loris Imbrogno (@Lorisimbrogno) & Cedric Fischer (@cedi254)
- **Spalte Start:** `In Progress`
- **Labels:** `ci`, `ops`, `automation`, `p3`
- **Priorität:** Mittel / Kontinuierlich
- **Beschreibung:**  
  Ablösen des Dummy-Workflows (`echo`) durch eine echte CI-Pipeline in `.github/workflows/ci.yml`.
- **Akzeptanzkriterien:**
  1. Trigger: Push auf `main` und alle Pull Requests.
  2. Schritte:
     - Checkout Code
     - Setup Node.js (Version 20 LTS mit Cache)
     - `npm ci` (reproduzierbare Installation mit `package-lock.json`)
     - `npm run lint` (statisches Linting)
     - `npm run build` (TypeScript-Kompilierung)
     - `npm test` (Unit Tests)
  3. *Fail Fast:* Bricht sofort ab, wenn Linting, Build oder Tests rot sind.
  4. Ausführungszeit unter 2 Minuten.
- **Definition of Done:** Echte Tests laufen in der GitHub Actions Pipeline und blockieren fehlerhafte PRs.

---

### Ticket #9: API-Dokumentation & Test-Standard festhalten
- **Repository:** `m324-ap23a-team4/team`
- **Zuständig (Assignee):** Marvin Kropf (@MarvinKropf2) & Cedric Fischer (@cedi254)
- **Spalte Start:** `Ready`
- **Labels:** `documentation`, `p2`
- **Priorität:** Normal
- **Beschreibung:**  
  Festhalten der API-Spezifikation (Payloads, Statuscodes, Fehlerschema) und Dokumentation der Unit Tests gemäss Modulvorgaben.
- **Akzeptanzkriterien:**
  1. Dokumentiert alle Endpunkte von `ms1` und `ms2` mit Request/Response-Beispielen in `team/docs/api-spezifikation.md`.
  2. Erklärt den Testaufbau und die Testpyramiden-Umsetzung für die Lehrperson.
- **Definition of Done:** Datei im Repo `team` abgelegt und im `README.md` verlinkt.
