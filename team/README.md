# Team 4: Immobilienplattform (M324 DevOps)

Willkommen im zentralen Übersichts-Repository von **Team 4** für das Modul **M324**.  
Dieses Dokument dient der Lehrperson und dem Team als zentraler Einstiegspunkt mit Schnellzugriff auf alle Repositories, Dokumente und Theorieabgaben.

---

## ⚡ Schnellzugriff / Quick Links

| Bereich | Dokument / Ressource | Beschreibung / Zweck |
|---|---|---|
| **Kanban-Board** | 📌 [M324 Team 4 Board](https://github.com/orgs/m324-ap23a-team4/projects/1) | Live-Aufgabenverwaltung, Backlog & Sprints |
| **Board-Tickets (P2)** | 🎯 [Aufgaben & Tickets](./docs/board-tickets-p2.md) | Vordefinierte Karten für P2 (US1–US3, Walking Skeleton, CI) |
| **Meetings & Prozesse** | 📋 [D3: Meetings und Arbeitsprozesse](./docs/D3_Meetings_Prozesse.md) | Verbindliche Meeting-Struktur, Timeboxes & Rollen |
| **Meeting-Protokolle** | 📅 [Protokoll 23.11.2026](./docs/meetings/2026-11-23.md) | Aktuelles Protokoll (Sprint 1 Check-In & Tagesplanung) |
| **Meeting-Vorlage** | ✍️ [Meeting-Protokoll Vorlage](./docs/meeting-vorlage.md) | Standard-Template zum Kopieren für Check-Ins & Retros |
| **Entscheidungen** | 🎫 [Ticket #1: Kickoff-Entscheidungen](https://github.com/m324-ap23a-team4/team/issues/1) | Begründete Architekturentscheidungen (closed) |
| **Vereinbarung** | 🤝 [Vertrag Dev ↔ Ops](./docs/team-vereinbarung.md) | Schnittstellen, DoD, DoR & Arbeitsregeln |
| **Retrospektiven** | ⚠️ [Retrospektiven (Deprecated)](./docs/retrospektiven.md) | Veraltet – Retros finden neu direkt im Meeting-Protokoll statt |

---

## 👥 Mitglieder & feste Rollen (Gesamtes Modul)

| Name | GitHub Account | Team | Feste Rolle (Gesamtes Modul) |
|---|---|---|---|
| **Loris Imbrogno** | [@Lorisimbrogno](https://github.com/Lorisimbrogno) | **Ops** | **Ops Lead & Moderation** |
| **Cedric Fischer** | [@cedi254](https://github.com/cedi254) | **Ops** | **Ops / Protokoll & Timekeeper** |
| **Karol Jakub** | [@KarolJakubGroups](https://github.com/KarolJakubGroups) | **Dev** | **Dev Lead** |
| **Andrin Ruegg** | [@AriesDevlo](https://github.com/AriesDevlo) | **Dev** | **Dev / Quality & Review Lead** |
| **Marvin Kropf** | [@MarvinKropf2](https://github.com/MarvinKropf2) | **Dev** | **Dev / Docs & Release Manager** |

> **Hinweis zur Organisation:** Die Zuweisung zu Dev und Ops bleibt über das gesamte Modul fest bestehen (kein Phasenwechsel / Rollentausch). Retrospektiven werden kontinuierlich wöchentlich im Meeting-Protokoll geführt.

---

## 📚 Theorie-Abgaben ([theorie/](./theorie/))

Alle Theoriearbeiten der vier Blöcke B1 bis B4 sind vollständig ausgearbeitet und abgelegt:

| Block | Thema | Datei | Zuständig | Reviewer |
|---|---|---|---|---|
| **B1** | DevOps-Kultur und Umgang mit Störungen | 📄 [B1_DevOps_Kultur.md](./theorie/B1_DevOps_Kultur.md) | Loris Imbrogno | Cedric Fischer |
| **B2** | Prozesse und Zusammenarbeit | 📄 [B2_Prozesse_Zusammenarbeit.md](./theorie/B2_Prozesse_Zusammenarbeit.md) | Cedric Fischer | Andrin Ruegg |
| **B3** | Continuous Integration und Artefakte | 📄 [B3_CI_Artefakte.md](./theorie/B3_CI_Artefakte.md) | Andrin Ruegg | Karol Jakub |
| **B4** | Continuous Delivery, Umgebungen und Deployment | 📄 [B4_CD_Betrieb.md](./theorie/B4_CD_Betrieb.md) | Karol / Marvin | Marvin Kropf |
| **Übersicht** | Kriterien & Review-Tabelle | 📄 [theorie/README.md](./theorie/README.md) | Team 4 | Alle |

---

## 🛠️ Repositories & System-Übersicht

Unsere Microservices-Architektur ist in 4 Repositories innerhalb der Organisation [**`m324-ap23a-team4`**](https://github.com/m324-ap23a-team4) aufgeteilt:

| Repository | Zweck | Status / Pipeline | Hauptverantwortung |
|---|---|---|---|
| [**`team`**](https://github.com/m324-ap23a-team4/team) | Team-Organisation, Theorie, Docs & Retros | Aktiv | Alle Mitglieder (Write) |
| [**`ms1`**](https://github.com/m324-ap23a-team4/ms1) | Microservice 1: Ortschaften (Web-API) | [CI Actions](https://github.com/m324-ap23a-team4/ms1/actions) (✓ Grün) | Teilgruppe A (Dev) |
| [**`ms2`**](https://github.com/m324-ap23a-team4/ms2) | Microservice 2: Immobilien (Web-API) | [CI Actions](https://github.com/m324-ap23a-team4/ms2/actions) | Teilgruppe A (Dev) |
| [**`infra`**](https://github.com/m324-ap23a-team4/infra) | Docker Orchestrierung & Runbook | Bereit für Phase A | Teilgruppe B (Ops) |

---

## 📌 System & Live-Links
| Komponente | Link |
|---|---|
| **Kanban Board** | [M324 Team 4 Board (GitHub Projects)](https://github.com/orgs/m324-ap23a-team4/projects/1) |
| **GitHub Organisation** | [github.com/m324-ap23a-team4](https://github.com/m324-ap23a-team4) |
| **Zeitlogging** | Tymeprint (individuell) |
| **Produktionsumgebung** | (wird in Phase A bereitgestellt) |
| **Runbook** | [infra/README.md](https://github.com/m324-ap23a-team4/infra) (ab Phase A) |
