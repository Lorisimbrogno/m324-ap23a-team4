# Kickoff-Entscheidungen (Ticket #1)

> **Hinweis:** Diesen Inhalt als erstes Ticket / Issue (#1) auf GitHub erstellen und anschliessend schliessen (closed).

## 1. Entscheidungen & Begründungen

| Entscheidung | Gewählte Option | Begründung für das Fachgespräch |
|---|---|---|
| **Plattform** | GitHub | Repositories, Issue-Board / Projects, GitHub Actions Pipelines und Container Registry (GHCR) befinden sich in einem einzigen Werkzeug. Alle Teammitglieder haben einen GitHub-Account mit 2FA. |
| **Teilgruppen (Phase A)** | **Teilgruppe A (Dev):** Aries (@AriesDevlo), Karol Jakub (@KarolJakubGroups), Marvin Kropf (@MarvinKropf2)<br>**Teilgruppe B (Ops):** Loris Imbrogno (@Lorisimbrogno), Cedi (@cedi254) | Klare Aufteilung der Verantwortlichkeiten für Phase A gemäss Modulvorgaben. In Phase B wird die Rolle getauscht. |
| **Applikation** | Projekt 5: Immobilienplattform | Zwei Microservices (MS1: Ortschaften, MS2: Immobilien) ausschliesslich als Web-API / Backend ohne Frontend. |
| **Sprache & Framework (ms1)** | Node.js 20 LTS mit TypeScript & Express | Schnelle API-Entwicklung, integrierter Test-Runner (`node:test`), typensicher und leichtgewichtig als Container baubar. |
| **Sprache & Framework (ms2)** | Node.js 20 LTS mit TypeScript & Express | Einheitlicher Stack für beide Services verringert Reibungsverluste und vereinfacht den Wissenstransfer beim Rollentausch in Phase B. |
| **Datenbanken** | PostgreSQL (16-alpine) getrennt pro Service | *Database-per-Service Pattern*: Jeder Microservice hat seine eigene relationale Datenbank. Einfacher lokaler Betrieb als Docker-Container. |
| **Zielumgebung / Hosting** | Vorgabe durch Lehrperson | Docker-basiertes Deployment. |
