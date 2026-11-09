# B1 DevOps-Kultur und Umgang mit Störungen

**Autor:** Loris Imbrogno  
**Reviewer:** Cedi  
**Status:** Abgabebereit  

---

## [B1-K01] DevOps-Begriff, Zielkonflikt und Missverständnisse

- **Definition:** DevOps ist eine Kultur-, Methoden- und Werkzeugbewegung, die Softwareentwicklung (Dev) und IT-Betrieb (Ops) vereint, um Software schneller, zuverlässiger und in höherer Qualität bereitzustellen.
- **Klassischer Zielkonflikt («Wall of Confusion»):**
  - **Dev** will häufige *Veränderung* (neue Features schnell liefern).
  - **Ops** will maximale *Stabilität* (Uptime sichern, Risiken vermeiden).
  - *Lösung durch DevOps:* Geteilte Verantwortung («You build it, you run it»), gemeinsame Metriken und kleine, inkrementelle Releases statt riskanter Gross-Deployments.
- **Häufige Missverständnisse:**
  - *«DevOps ist ein Tool»:* Werkzeuge (Docker, Git) nützen nichts ohne Kulturwandel und Kommunikation.
  - *«DevOps ist ein separates Team»:* Ein isoliertes «DevOps-Team» erzeugt nur ein weiteres Silo.
  - *«DevOps bedeutet NoOps»:* Entwickler machen nicht alles allein; Ops wird zur Plattform, die Automatisierung und Betriebsinfrastruktur bereitstellt.

---

## [B1-K02] CALMS

Das CALMS-Framework beschreibt die fünf Kernbereiche von DevOps:

- **C – Culture:** Vertrauenskultur, psychologische Sicherheit, geteilte Verantwortung und Fehlerakzeptanz (Blameless).
- **A – Automation:** Beseitigung manueller Schritte durch CI/CD-Pipelines, automatische Tests und Infrastructure as Code (IaC).
- **L – Lean:** Vermeidung von Verschwendung (Waste), Begrenzung von paralleler Arbeit (WIP-Limits) und kleine Batch-Grössen.
- **M – Measurement:** Kontinuierliche Messung technischer Daten (Latenz, Fehlerquoten) und Prozessmetriken (Deployment-Häufigkeit).
- **S – Sharing:** Transparente Dokumentation, Runbooks und organisationsweiter Wissensaustausch.

> **Warum steht Culture an erster Stelle?**  
> Die besten Tools und Automatisierungen scheitern, wenn Mitarbeiter sich gegenseitig misstrauen, Wissen horten oder Angst vor Fehlern haben. Kultur ist das Fundament.

---

## [B1-K03] The Three Ways

Die «Drei Wege» (nach Gene Kim) beschreiben die Handlungsprinzipien für den Wertstrom:

1. **The First Way: Flow (Fluss beschleunigen)**
   - Schneller Fluss der Arbeit von links (Dev) nach rechts (Ops/Kunde).
   - Massnahmen: Kleine Arbeitspakete, Kanban-Boards zur Visualisierung, WIP-Limits, keine unfertigen/fehlerhaften Änderungen stromabwärts weitergeben.
2. **The Second Way: Feedback (Rückkopplungsschlaufen verkürzen)**
   - Schnelle Rückmeldung von rechts nach links.
   - Massnahmen: Sofortige Test-Ergebnisse aus der CI-Pipeline, Produktions-Monitoring, «Andon Cord» (Stop der Pipeline bei Fehlern zur sofortigen Ursachenbehebung).
3. **The Third Way: Continuous Learning and Experimentation (Lernen & Experimentieren)**
   - Kultur des täglichen Lernens und des Eingehens kalkulierter Risiken.
   - Massnahmen: Blameless Postmortems, regelmässige Notfallübungen (Fire Drills, Chaos Engineering) und Zeit für technische Verbesserungen.

---

## [B1-K04] Vergleich CALMS und Three Ways

| Merkmal | CALMS | The Three Ways |
|---|---|---|
| **Ansatz** | **Kriterienkatalog / Dimensionen** (Was muss betrachtet werden?) | **Dynamisches Handlungsmodell** (In welcher Reihenfolge handeln wir?) |
| **Aufbau** | 5 gleichwertige Säulen (Culture, Automation, Lean, Measurement, Sharing) | 3 aufeinander aufbauende Phasen (Flow → Feedback → Lernen) |
| **Zweck** | Status- und Reifegradanalyse einer Organisation | Leitfaden für die praktische Transformation der Arbeitsweise |

**Zusammenspiel:** CALMS liefert die Bausteine (z.B. Automation & Lean für den *First Way*, Measurement für den *Second Way*, Culture & Sharing für den *Third Way*).

---

## [B1-K05] Monitoring und Alarme

- **Observability-Säulen:**
  - **Metriken:** Zahlenreihen über Zeit (CPU %, RAM, Request-Rate). Ideal für Trends und Schwellenwert-Alarme.
  - **Logs:** Diskrete Text-Events mit Kontext (z.B. Error-Stacktrace mit Timestamp und User-ID) fürs Detail-Debugging.
  - **Traces:** Verfolgung eines Requests über mehrere Microservices hinweg zur Latenzanalyse.
- **Was macht einen guten Alarm aus?**
  - **Actionable:** Löst nur aus, wenn ein Mensch sofort eingreifen muss.
  - **Symptombasiert:** Misst Kundenauswirkungen (z.B. HTTP 500 Fehlerrate > 2%) statt flüchtiger Ursachen (kurzzeitig hohe CPU).
  - **Dokumentiert:** Enthält direkten Link zu Dashboard und Runbook.
- **Alert Fatigue (Alarmmüdigkeit):** Zu viele Fehlalarme führen dazu, dass echte Notfälle übersehen werden. Gegenmassnahmen: Nur kritische Alarme auf den Pager, Schwellenwerte feintunen, unkritische Meldungen als Tickets ablegen.

---

## [B1-K06] Incidents, Blameless-Kultur und Postmortem

- **Incident-Phasen:** 1. Erkennung (Detection) → 2. Eindämmung & Behebung (Mitigation/Resolution) → 3. Nachbereitung (Postmortem).
- **Blameless-Kultur:**
  - Menschliches Versagen ist das Symptom, nicht die Ursache von Ausfällen.
  - Werden Mitarbeiter bestraft, vertuschen sie Fehler.
  - Ziel ist es, das System und die Prozesse so widerstandsfähig zu bauen, dass ein Fehlklick nicht das gesamte System zerstört.
- **Bestandteile eines guten Postmortems:**
  1. *Zusammenfassung & Auswirkung:* Was fiel wie lange aus?
  2. *Timeline:* Chronologischer Ablauf minutengenau (UTC).
  3. *Ursachenanalyse:* 5-Whys (Warum versagten die Schutzmechanismen?).
  4. *Action Items:* Konkrete Verbesserungsaufgaben mit klarer Zuständigkeit und Termin.

---

## [B1-K07] Fall GitLab 2017

- **Der Vorfall:** Am 31. Januar 2017 löschte ein übermüdeter Sysadmin bei einer manuellen Replikationsbehebung versehentlich per `rm -rf` das Verzeichnis der Produktions-Hauptdatenbank (`db1`). Rund 300 GB Live-Daten waren weg, GitLab.com war 18 Stunden offline.
- **Das Versagen der Backups:** Keiner der 5 Backup-Mechanismen funktionierte:
  1. Backup-Skripte brachen wegen Versionskonflikten von `pg_dump` stumm ab.
  2. S3-Backups schlugen unbemerkt fehl (keine Alarme eingerichtet).
  3. Azure-Snapshots waren für die Datenbank-Disks nicht aktiv.
  4. Staging-Replikation war Stunden zuvor gelöscht worden.
  5. *Zentrales Problem:* **Der Restore-Prozess war nie automatisiert getestet worden.** Ein ungetestetes Backup existiert nicht.
  *(Rettung gelang über einen zufällig 6 Stunden alten manuellen Snapshot).*
- **Vorbildlicher Umgang:**
  - **Radikale Transparenz:** Live-Stream der Wiederherstellung auf YouTube und öffentliches Google Doc für die Community.
  - **Absolute Blamelessness:** Der Administrator wurde geschützt und nicht entlassen; GitLab sah das Versäumnis bei den Prozessen und fehlenden Sicherheitsnetzen.

---

## Quellen
- Humble, J., & Farley, D. (2010): *Continuous Delivery*.
- Kim, G. et al. (2016): *The DevOps Handbook*.
- GitLab Inc. (2017): *Postmortem of database outage of January 31*.
- TBZ Modul M324: *DevOps Kriterienkatalog*.
- **KI-Deklaration:** Zur Strukturierung und Formulierung wurden KI-Tools gemäss Vorgaben verwendet. Inhalte wurden fachlich geprüft.
