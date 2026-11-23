# API-Spezifikation & Test-Standard (M324 Projekt 5)

> **Team 4 – Immobilienplattform mit Microservices**  
> **Modul:** M324 DevOps & Cloud Computing  
> **Ablage:** `team/docs/api-spezifikation.md`  
> **Ticket:** [#11 – API-Doku & Test-Standard](https://github.com/m324-ap23a-team4/team/issues/11)

---

## 1. System- & Service-Architektur

Die Plattform besteht aus zwei eigenständigen Microservices nach dem **Database-per-Service Pattern**:

```text
+-----------------------+                    +-----------------------+
|          ms1          |                    |          ms2          |
|  (Ortschaften-Dienst) | <--- HTTP Call --- |  (Immobilien-Dienst)  |
|      Port: 3001       |   GET /ortschaften |      Port: 3002       |
+-----------+-----------+        /:id        +-----------+-----------+
            |                                            |
            v                                            v
     [ db-ms1 (5433) ]                            [ db-ms2 (5434) ]
     PostgreSQL 16                                PostgreSQL 16
```

### Verbindliche Architektur-Regeln:
1. **Kein geteilter Datenbankzugriff:** `ms2` darf **niemals direkt** auf die Datenbank von `ms1` zugreifen.
2. **Schnittstellen-Validierung:** Bei der Erstellung einer Immobilie ruft `ms2` intern `GET /ortschaften/:id` von `ms1` auf. Antwortet `ms1` mit `404 Not Found`, weist `ms2` den Request mit `400 Bad Request` zurück.
3. **12-Factor-Konfiguration:** Alle Endpunkte, Ports und Verbindungs-URLs werden über Environment-Variablen (`PORT`, `DATABASE_URL`, `MS1_URL`) gesteuert.

---

## 2. API-Endpunkte Microservice 1: `ms1` (Ortschaften)

Basis-URL lokal: `http://localhost:3001` (Container-intern: `http://ms1:3000`)

### 2.1 `GET /health` (Healthcheck)
Liefert den aktuellen Betriebsstatus des Dienstes.

* **HTTP-Methode:** `GET`
* **Pfad:** `/health`
* **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "service": "ms1"
  }
  ```

---

### 2.2 `POST /ortschaften` (US1: Ortschaft erfassen)
Erfasst eine neue Ortschaft im System.

* **HTTP-Methode:** `POST`
* **Pfad:** `/ortschaften`
* **Content-Type:** `application/json`
* **Request Body (JSON):**
  ```json
  {
    "name": "Niederhasli",
    "plz": "8155",
    "gruendungsdatum": "1899-05-15",
    "einwohner": 5543
  }
  ```
* **Validierungsregeln:**
  * `name`: Pflichtfeld, String, mind. 2 Zeichen.
  * `plz`: Pflichtfeld, gültiger String, keine Duplikate.
  * `gruendungsdatum`: Pflichtfeld, Format `YYYY-MM-DD`.
  * `einwohner`: Pflichtfeld, Ganzzahl `>= 0`.

* **Response `201 Created`:**
  ```json
  {
    "id": "c3f8a4b2-9d1e-4f7a-8b2c-1e4d5a6b7c8d",
    "name": "Niederhasli",
    "plz": "8155",
    "gruendungsdatum": "1899-05-15",
    "einwohner": 5543
  }
  ```

* **Response `400 Bad Request` (Validierungsfehler):**
  ```json
  {
    "error": "Validierungsfehler: Einwohnerzahl muss positiv sein.",
    "field": "einwohner"
  }
  ```

---

### 2.3 `GET /ortschaften` (US2: Alle Ortschaften auslesen)
Gibt eine Liste aller erfassten Ortschaften zurück.

* **HTTP-Methode:** `GET`
* **Pfad:** `/ortschaften`
* **Response `200 OK` (Daten vorhanden):**
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
* **Response `200 OK` (Keine Daten):**
  ```json
  []
  ```

---

### 2.4 `GET /ortschaften/:id` (Einzelabruf & Validierung für MS2)
Gibt eine einzelne Ortschaft anhand ihrer UUID zurück.

* **HTTP-Methode:** `GET`
* **Pfad:** `/ortschaften/:id`
* **Response `200 OK`:**
  ```json
  {
    "id": "c3f8a4b2-9d1e-4f7a-8b2c-1e4d5a6b7c8d",
    "name": "Niederhasli",
    "plz": "8155",
    "gruendungsdatum": "1899-05-15",
    "einwohner": 5543
  }
  ```
* **Response `404 Not Found`:**
  ```json
  {
    "error": "Ortschaft mit ID c3f8a4b2... nicht gefunden."
  }
  ```

---

## 3. API-Endpunkte Microservice 2: `ms2` (Immobilien)

Basis-URL lokal: `http://localhost:3002` (Container-intern: `http://ms2:3000`)

### 3.1 `GET /health` (Healthcheck)
Liefert den aktuellen Betriebsstatus des Dienstes.

* **HTTP-Methode:** `GET`
* **Pfad:** `/health`
* **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "service": "ms2"
  }
  ```

---

### 3.2 `POST /immobilien` (US3: Immobilie erfassen)
Erfasst eine neue Immobilie und prüft die zugehörige Ortschaft via HTTP-Call an `ms1`.

* **HTTP-Methode:** `POST`
* **Pfad:** `/immobilien`
* **Content-Type:** `application/json`
* **Request Body (JSON):**
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

* **Validierungsregeln:**
  * `typ`: Pflichtfeld (z.B. "Haus", "Wohnung", "Gewerbe").
  * `zimmer`: Pflichtfeld, Zahl `> 0`.
  * `flaeche`: Pflichtfeld, Zahl in m² `> 0`.
  * `ortschaftId`: Pflichtfeld, muss als valide Ortschaft in `ms1` existieren (`GET /ortschaften/:id`).
  * `preis`: Pflichtfeld, Zahl `> 0`.

* **Response `201 Created`:**
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

* **Response `400 Bad Request` (Ortschaft existiert nicht):**
  ```json
  {
    "error": "Validierungsfehler: Angegebene Ortschaft existiert nicht in MS1.",
    "field": "ortschaftId"
  }
  ```

---

## 4. Test-Standard & Testpyramide

Gemäss den Bewertungskriterien von M324 setzen wir auf eine fundierte **Testpyramide**:

```text
         / \
        / E2E \       <-- Minimal (spätere Phasen)
       /-------\
      / Integr. \     <-- Docker Compose Test / API Tests
     /-----------\
    /  Unit-Tests \   <-- Fundament: Schnell, isoliert, gemockt (Jetzt P2)
   +---------------+
```

### 4.1 Unit-Testing Best Practices:
1. **Isolierte Ausführung:** Alle Unit-Tests laufen mit `npm test` blitzschnell und unabhängig von laufenden Datenbanken oder anderen Microservices.
2. **Mocking von externen Abhängigkeiten:**
   * In `ms1`: Datenbankaufrufe werden gemockt oder über In-Memory-Repository getestet.
   * In `ms2`: Der HTTP-Aufruf an `ms1` (`GET /ortschaften/:id`) wird im Unit-Test gemockt (Happy Path simuliert 200 OK, Sad Path simuliert 404).
3. **Happy Path & Sad Path:** Für jeden Endpunkt sind mindestens 2–3 Testfälle vorhanden:
   * **Happy Path:** Valide Eingaben -> Korrekter Status-Code (200 / 201), Datenstruktur vollständig.
   * **Sad Path:** Ungültige Eingaben, negative Zahlen, fehlende Pflichtfelder, nicht existierende IDs -> Status 400 bzw. 404 mit erklärender Fehlermeldung.
4. **TSDoc / JavaDoc Dokumentation:** Jeder Testfall ist strukturiert kommentiert (Ziel, Vorbedingung, erwartetes Ergebnis).
