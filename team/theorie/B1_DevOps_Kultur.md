# B1 DevOps-Kultur und Umgang mit Störungen

**Autor:** Loris Imbrogno  
**Reviewer:** Cedi  
**Status:** Abgabebereit  

---

## [B1-K01] DevOps-Begriff, Zielkonflikt und Missverständnisse

### Was ist DevOps?
DevOps ist kein Produkt, kein einzelnes Werkzeug und kein isolierter Berufstitel. Es bezeichnet eine Philosophie, eine kulturelle Bewegung sowie eine Sammlung von Praktiken, die darauf abzielen, die traditionell getrennten Bereiche der **Softwareentwicklung (Dev)** und des **IT-Betriebs (Ops)** zusammenzuführen. Das übergeordnete Ziel besteht darin, den Software-Lieferzyklus (Delivery Lifecycle) drastisch zu verkürzen, die Release-Frequenz zu erhöhen und gleichzeitig eine hohe Softwarequalität, Stabilität und Zuverlässigkeit in der Produktionsumgebung sicherzustellen.

### Der klassische Zielkonflikt («Wall of Confusion»)
In traditionellen IT-Organisationen arbeiten Entwicklung und Betrieb in getrennten Silos mit diametral entgegengesetzten Anreizsystemen:
- **Entwicklung (Dev):** Wird daran gemessen, wie schnell und wie viele neue Funktionen (Features) geliefert werden. Dev strebt nach **Veränderung** und Agilität.
- **Betrieb (Ops):** Wird daran gemessen, wie stabil, verfügbar und fehlerfrei die Systeme laufen (Uptime, SLAs). Da statistisch die meisten Systemausfälle durch Änderungen (Deployments, Konfigurationsänderungen) ausgelöst werden, strebt Ops instinktiv nach **Stabilität und minimaler Veränderung**.

Dazwischen entsteht die sprichwörtliche «Wall of Confusion»: Entwickler werfen fertigen Code über die Mauer («Throw it over the wall»), und Ops muss mit den Fehlern, fehlenden Abhängigkeiten und unzureichenden Betriebsdokumentationen in der Produktion kämpfen. Treten Fehler auf, folgt gegenseitiges Fingerpointing.

DevOps überwindet diesen Konflikt durch:
1. **Gemeinsame Verantwortung («You build it, you run it»):** Entwickler sind auch für den Betrieb und die Fehlerbehebung ihres Codes verantwortlich; Betriebsexperten bringen Nicht-Funktionale Anforderungen (Sicherheit, Skalierbarkeit, Logging) frühzeitig in den Entwicklungsprozess ein.
2. **Gemeinsame Metriken:** Beide Seiten werden an der gemeinsamen Wertschöpfung gemessen (z.B. Durchlaufzeit und Produktionsverfügbarkeit).
3. **Kleine, inkrementelle Releases:** Statt monatlicher «Big-Bang»-Releases werden mehrmals täglich oder wöchentlich kleine Pakete ausgerollt. Kleinere Änderungen bergen deutlich weniger Risiko und lassen sich im Fehlerfall blitzschnell isolieren oder zurückrollen.

### Häufige Missverständnisse
- **«DevOps ist ein Tool / Toolchain»:** Die Einführung von Git, Docker oder Kubernetes allein erzeugt noch kein DevOps. Wenn die Silo-Mentalität und mangelnde Kommunikation bestehen bleiben, automatisiert man lediglich schlechte Prozesse.
- **«Ein DevOps-Team lösen alle Probleme»:** Die Gründung eines separaten «DevOps-Teams» schafft häufig nur ein drittes Silo zwischen Dev und Ops. DevOps muss eine Organisationskultur sein, die alle Teams durchdringt.
- **«DevOps bedeutet NoOps (Entwickler machen alles allein)»:** Betriebs-Know-how (Netzwerk, Storage, Kernel-Tuning, Incident Management, Compliance) ist komplexer denn je. Ops verschwindet nicht, sondern wandelt sich von manueller Ticket-Abarbeitung hin zur Bereitstellung automatisierter Self-Service-Plattformen für Entwickler.

---

## [B1-K02] CALMS

Das CALMS-Framework (entwickelt von Jez Humble, Damon Edwards und John Willis) definiert die fünf Grundpfeiler einer erfolgreichen DevOps-Adaption:

| Säule | Bedeutung | Praktische Umsetzung |
|---|---|---|
| **C – Culture (Kultur)** | Geteilte Verantwortung, Vertrauen und offene Zusammenarbeit. | Abbau von Silos, gemeinsame Teamziele, psychologische Sicherheit und Fehlerakzeptanz (Blameless Culture). |
| **A – Automation (Automatisierung)** | Beseitigung manueller, fehleranfälliger Wiederholungsaufgaben. | CI/CD-Pipelines, automatisierte Testsuiten, Infrastructure as Code (IaC) und automatische Konfigurationsverwaltung. |
| **L – Lean (Schlanke Prozesse)** | Vermeidung von Verschwendung (Waste) und kontinuierlicher Fluss. | Kleine Batch-Grössen bei Änderungen, Begrenzung von parallelen Aufgaben (WIP-Limits), schnelle Feedbackzyklen. |
| **M – Measurement (Messung)** | Datenbasierte Entscheidungen statt Bauchgefühl. | Erfassung technischer Metriken (Latenz, Fehlerquoten, CPU/RAM) sowie Prozessmetriken (DORA-Metriken: Deployment Frequency, Lead Time). |
| **S – Sharing (Teilen)** | Wissenstransfer und institutionsübergreifendes Lernen. | Transparente Dokumentation, Runbooks, gemeinsame Postmortems, Pair Programming und offene Kommunikationskanäle. |

### Warum steht Kultur (Culture) an erster Stelle?
Kultur ist das Fundament, auf dem alle anderen Säulen aufbauen:
- Die beste **Automatisierung** scheitert, wenn Mitarbeiter aus Misstrauen weiterhin manuelle Genehmigungsschritte (CABs – Change Advisory Boards) erzwingen.
- **Messung** führt zu Verstecken von Problemen oder Gaming von Kennzahlen, wenn eine toxische Bestrafungskultur herrscht.
- **Sharing** existiert nicht, wenn Wissen als Machtmittel gehortet wird.
Erst wenn Menschen sich sicher fühlen, Fehler offen anzusprechen und zusammenzuarbeiten, können Automatisierung und Lean-Prinzipien ihre volle Wirkung entfalten.

---

## [B1-K03] The Three Ways

Die «Drei Wege» (formuliert von Gene Kim in *The Phoenix Project* und *The DevOps Handbook*) beschreiben die grundlegenden Verhaltens- und Prozessprinzipien:

### 1. The First Way: Flow (Systemdenken & Beschleunigung des Flusses)
Der Erste Weg befasst sich mit dem schnellen und reibungslosen Fluss der Arbeit von links nach rechts – von der Geschäftsanforderung und Entwicklung über das Testing bis hin zum produktiven Betrieb beim Kunden.
- **Schlüsselmassnahmen:**
  - Arbeit sichtbar machen (Kanban-Boards).
  - Batch-Grössen drastisch reduzieren (häufige kleine Commits statt riesiger Releases).
  - Begrenzung der gleichzeitig begonnenen Arbeit (Work in Progress / WIP-Limits).
  - Qualität an der Quelle sichern: Keine bekannten Fehler oder ungetesteten Änderungen stromabwärts weiterreichen.

### 2. The Second Way: Feedback (Verstärkung von Feedbackschlaufen)
Der Zweite Weg sorgt dafür, dass Rückmeldungen vom rechten Ende (Betrieb und Benutzer) schnell, präzise und stetig nach links (Entwicklung) zurückfliessen.
- **Schlüsselmassnahmen:**
  - Umfassende Telemetrie und Monitoring in der Produktion.
  - Automatisierte CI-Pipelines, die Entwicklern innerhalb von Minuten Feedback über gebrochene Tests oder Build-Fehler geben.
  - Das «Andon-Cord»-Prinzip (aus dem Toyota-Produktionssystem): Wenn in der Pipeline ein Problem auftritt, wird der Prozess angehalten, bis die Ursache verstanden und nachhaltig behoben ist, statt fehlerhaften Code weiterzuschleusen.

### 3. The Third Way: Continuous Learning and Experimentation (Lernen und Experimentieren)
Der Dritte Weg etabliert eine Kultur, die zwei Dinge kontinuierlich fördert: das Eingehen kalkulierter Risiken und das Lernen aus täglichen Erfolgen und Fehlern.
- **Schlüsselmassnahmen:**
  - Schaffen von Experimentierfreude und psychologischer Sicherheit.
  - Regelmässiges Üben von Ernstfällen (Game Days, Fire Drills, Chaos Engineering à la Netflix Chaos Monkey).
  - Feste Zeitbudgets für Refactoring, technische Schulden und Innovation (z.B. 20%-Zeit oder Hackathons).
  - Wissen aus Vorfällen organisationsweit teilen (Postmortems).

---

## [B1-K04] Vergleich CALMS und Three Ways

Obwohl beide Modelle aus der DevOps-Bewegung stammen und sich gegenseitig stützen, unterscheiden sie sich in ihrer Struktur und Ausrichtung:

```text
CALMS (Kriterien / Dimensionen)           The Three Ways (Dynamik / Prinzipien)
┌──────────────────────────────┐          ┌───────────────────────────────────┐
│ C - Culture                  │ ◄──────► │ 3rd Way: Learning & Experimenting │
│ A - Automation               │ ───────► │ 1st Way: Flow                     │
│ L - Lean                     │ ───────► │ 1st Way: Flow                     │
│ M - Measurement              │ ───────► │ 2nd Way: Feedback                 │
│ S - Sharing                  │ ◄──────► │ 3rd Way: Learning & Experimenting │
└──────────────────────────────┘          └───────────────────────────────────┘
```

### Gemeinsamkeiten
- Beide Modelle stellen den Menschen, Vertrauen und kontinuierliches Lernen in den Mittelpunkt.
- Beide betonen, dass Technologie allein ohne Feedback und Messung wertlos ist.
- Beide zielen auf die Überwindung des Silodenkens zwischen Dev und Ops ab.

### Unterschiede
- **CALMS ist ein multidimensionaler Kriterienkatalog:** Es liefert fünf gleichberechtigte Beobachtungsbereiche («Was müssen wir in unserer Organisation analysieren und verändern?»). Es eignet sich hervorragend als Assessment-Tool, um den Reifegrad einer Organisation zu bewerten.
- **The Three Ways ist ein prozedurales Handlungsmodell:** Es beschreibt eine klare Dynamik und Kausalität («Wie transformieren wir den Wertstrom?»). Es gibt eine Schrittfolge vor: Zuerst den Fluss beschleunigen (1st Way), dann Feedbackschleifen verkürzen (2nd Way), um schliesslich auf dieser stabilen Basis eine lernende Organisation aufzubauen (3rd Way).

---

## [B1-K05] Monitoring und Alarme

### Die Säulen der Observability: Metriken, Logs und Traces
1. **Metriken:**
   - Numerische Messwerte, die in festen Zeitintervallen aggregiert erfasst werden (z.B. CPU-Auslastung in %, freier Arbeitsspeicher in MB, Anzahl HTTP-Requests pro Sekunde).
   - *Vorteil:* Sehr speichereffizient, ideal für Trends, Dashboards und Schwellenwert-Alarme.
2. **Logs:**
   - Zeitgestempelte, diskrete Text- oder JSON-Ereignisprotokolle, die beschreiben, was genau zu einem bestimmten Zeitpunkt im Code passiert ist (z.B. Stacktrace bei einer Exception, fehlerhafter Login-Versuch mit User-ID).
   - *Vorteil:* Hohe Detailtiefe für das nachträgliche Debugging konkreter Fehler.
3. **Traces (Distributed Tracing):**
   - Verfolgung eines einzelnen Benutzer-Requests über mehrere verteilte Microservices hinweg mittels einer eindeutigen Korrelations-ID (`Trace-ID`).
   - *Vorteil:* Zeigt Latenzen und Engpässe zwischen verschiedenen Services auf.

### Was macht einen guten Alarm aus?
Ein guter Alarm zeichnet sich durch folgende Kriterien aus:
- **Actionable (Handlungsorientiert):** Jeder Alarm, der ein Teammitglied weckt oder benachrichtigt, muss eine sofortige menschliche Handlung erfordern. Kann der Fehler bis zum nächsten Werktag warten oder löst sich von selbst, ist es kein Alarm, sondern eine Dashboard-Notiz oder ein Ticket.
- **Symptombasiert statt ursachenbasiert:** Alarme sollten die Auswirkung auf den Endkunden überwachen (z.B. «5xx-Fehlerrate liegt über 2%» oder «Checkout-Latenz > 2s»), anstatt abstrakte Systemzustände isoliert abzufeiern (z.B. «CPU kurzzeitig bei 95%»).
- **Mit Kontext & Runbook verknüpft:** Die Benachrichtigung muss direkt einen Link zum relevanten Dashboard und zum passenden Eintrag im Runbook enthalten, damit die diensthabende Person ohne Verzögerung Gegenmassnahmen einleiten kann.

### Alarmmüdigkeit (Alert Fatigue)
- **Problem:** Wenn Systeme hunderte Fehlalarme (False Positives), veraltete Warnungen oder rein informative Meldungen per E-Mail oder Pager versenden, tritt eine psychologische Abstumpfung ein. Alarme werden routinemässig ignoriert, weggeklickt oder stummgeschaltet. In der Folge wird ein echter, kritischer Ausfall zu spät erkannt.
- **Gegenmassnahmen:**
  - Konsequentes Ausmisten unkritischer Alarme.
  - Dynamische Schwellenwerte und Hysterese (Flapping-Schutz) einsetzen.
  - Trennung von Benachrichtigungskanälen: Pager/SMS nur für P1-Incidents; Warnungen als Issue/Ticket; Informationsmeldungen nur im Log.

---

## [B1-K06] Incidents, Blameless-Kultur und Postmortem

### Ablauf des Incident Managements
1. **Erkennung (Detection):** Automatische Erkennung via Monitoring-Alarm oder manuelles Melden durch Anwender.
2. **Triage & Rollenverteilung:** Einstufung des Schweregrads (z.B. P1 Critical vs. P3 Minor). Ernennung eines Incident Commanders (koordiniert die Massnahmen und schirmt die Ingenieure ab).
3. **Eindämmung & Behebung (Mitigation & Resolution):** Vorrangiges Ziel ist die schnellstmögliche Wiederherstellung des Betriebs für die Kunden (z.B. Rollback, Traffic-Umleitung, Neustart, Kapazitätserhöhung). Die tiefgehende Ursachenforschung erfolgt erst danach.
4. **Nachbereitung (Postmortem / Retrospektive):** Strukturierte Analyse des Vorfalls zur nachhaltigen Systemverbesserung.

### Warum ist eine «Blameless»-Kultur unverzichtbar?
In komplexen soziotechnischen Systemen ist «menschliches Versagen» (Human Error) fast nie die eigentliche Ursache, sondern lediglich das Symptom schlecht gestalteter Werkzeuge, fehlender Sicherheitsnetze oder unklarer Prozesse.
- **Wenn Schuldige bestraft werden:** Mitarbeiter entwickeln Angst. Fehler werden vertuscht, Probleme verschwiegen und riskante, aber notwendige Änderungen vermieden. Das System wird intransparent und fragil.
- **Wenn Schuldfragen tabu sind (Blameless):** Man geht von der Grundannahme aus, dass jede Person nach bestem Wissen und Gewissen gehandelt hat, basierend auf den Informationen, die ihr zu diesem Zeitpunkt vorlagen. Der Fokus verschiebt sich von der Frage *«Wer hat den Fehler gemacht?»* zur konstruktiven Systemfrage: *«Welche Rahmenbedingungen, fehlenden Warnungen oder unzureichenden Prozesse haben es der Person ermöglicht, diesen Fehler zu machen – und wie machen wir das System fehlertolerant?»*

### Aufbau eines professionellen Postmortems
Ein vollständiges Postmortem enthält:
1. **Metadaten:** Datum, Dauer, Incident Commander, Schweregrad, betroffene Services.
2. **Zusammenfassung (Summary):** Was ist passiert und was waren die Auswirkungen auf Kunden/Umsatz?
3. **Detaillierte Timeline:** Chronologische Abfolge der Ereignisse nach UTC (Wann trat der Fehler auf? Wann schlug der Alarm an? Wann wurde welche Massnahme getestet? Wann war der Service wieder stabil?).
4. **Ursachenanalyse (Root Cause / 5-Whys):** Tiefe Analyse der beitragenden Faktoren ohne Schuldzuweisung.
5. **Was lief gut / Was lief schlecht:** Reflexion über Monitoring, Kommunikation und Tooling.
6. **Action Items (Massnahmen):** Konkrete, priorisierte Aufgaben zur Beseitigung der Schwachstelle mit klar zugewiesener Person und Fälligkeitsdatum (z.B. «Automatische Validierung vor Schreibzugriff einbauen», «Alarm-Schwellenwert für Replikations-Lag anpassen»).

---

## [B1-K07] Fall GitLab 2017

### Der Vorfall (31. Januar 2017)
GitLab erlebte einen der bekanntesten Datenbank-Ausfälle der modernen IT-Geschichte:
- **Ausgangslage:** Die primäre PostgreSQL-Datenbank geriet durch starkes Wachstum und einen Denial-of-Service-Angriff unter extreme Last. Die sekundäre Datenbank (Replikation) fiel massiv hinterher und konnte nicht synchronisiert werden.
- **Die fatale Fehlhandlung:** Ein Systemadministrator arbeitete spät abends unter enormem Schlafmangel und Stress daran, die Replikation manuell wiederherzustellen. Um einen sauberen Synchronisationslauf zu erzwingen, wollte er das unvollständige Datenverzeichnis auf dem Sekundärserver löschen. Versehentlich war er jedoch per SSH auf dem **Produktions-Primärserver (`db1.cluster.gitlab.com`)** eingeloggt und führte dort den Befehl `rm -rf` aus.
- **Auswirkung:** Rund 300 GB Live-Produktionsdaten wurden innerhalb von Sekunden gelöscht. Der gesamte Dienst GitLab.com war für rund 18 Stunden offline.

### Das Totalversagen der Backups
Beim Versuch der Datenwiederherstellung stellte GitLab fest, dass **keiner der fünf eingerichteten Backup-Mechanismen** funktionierte:
1. **Reguläre Backup-Skripte:** Schlugen stumm fehl, da die installierte Version von `pg_dump` veraltet war und nicht mit der neuen PostgreSQL-Version harmonierte.
2. **S3-Backups:** Fehlten komplett, da die Skripte stillschweigend abgebrochen waren und niemand Benachrichtigungen über fehlgeschlagene Uploads konfiguriert hatte.
3. **Disksnapshots in Azure:** Waren für die Datenfestplatten der Primärdatenbank schlichtweg nie aktiviert worden.
4. **Replikation / Staging:** Die Staging-Umgebung spiegelte die Produktionsdaten nicht mehr, weil dortige Kopierprozesse Stunden zuvor gelöscht worden waren.
5. **Mangelnde Wiederherstellungstests:** Das grundlegende Versäumnis war: GitLab hatte Backups zwar konfiguriert, aber **die Wiederherstellung (Restore) niemals automatisiert und regelmässig getestet**. Ein ungetestetes Backup existiert in der Praxis nicht.

*Lösung:* Die Rettung gelang erst nach stundenlanger Suche über einen zufällig existierenden, 6 Stunden alten manuellen Snapshot, den ein anderer Mitarbeiter kurz vor der Krise für Testzwecke erstellt hatte. Etwa sechs Stunden an Kundendaten gingen unwiderruflich verloren.

### Der vorbildliche Umgang: Transparenz und Blameless Culture
Obwohl der Vorfall technisch ein Desaster war, wurde GitLabs Reaktion weltweit als Musterbeispiel für gelebte DevOps-Kultur gefeiert:
- **Radikale Transparenz:** Statt den Vorfall herunterzuspielen oder abzuwiegeln, öffnete GitLab ein öffentliches Google-Doc, in dem jeder live mitlesen konnte, woran die Ingenieure gerade arbeiteten. Sie streamten ihre Fehlersuche und den Restore-Prozess live auf YouTube.
- **Schutz des Mitarbeiters (Absolute Blamelessness):** Der betroffene Administrator wurde zu keinem Zeitpunkt namentlich an den Pranger gestellt oder entlassen. Im Gegenteil: Die Unternehmensleitung stellte klar, dass der Fehler im System lag (mangelnde Sicherheitsmechanismen für gefährliche Befehle, ungetestete Backups, Übermüdung) und nicht beim einzelnen Menschen.
- **Konsequenzen und Learnings:**
  - Backups werden seither täglich vollautomatisiert in einer Testumgebung wiederhergestellt und verifiziert.
  - Einführung strenger Zugriffskontrollen und visueller Terminal-Kennzeichnungen (z.B. farbige Prompts für Produktionsumgebungen).
  - Alarme bei ausbleibenden Backups wurden implementiert.

---

## Quellen
- Humble, J., & Farley, D. (2010). *Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation*. Addison-Wesley.
- Kim, G., Behr, K., & Spafford, G. (2013). *The Phoenix Project: A Novel about IT, DevOps, and Helping Your Business Win*. IT Revolution Press.
- Kim, G., Humble, J., Debois, P., & Willis, J. (2016). *The DevOps Handbook*. IT Revolution Press.
- GitLab Inc. (2017). *Postmortem of database outage of January 31*. GitLab Blog / Outage Documentation.
- TBZ Modul M324: *DevOps Kriterienkatalog und Unterrichtsmaterialien*.
- **KI-Deklaration:** Zur Recherche und redaktionellen Strukturierung dieser Ausarbeitung wurden KI-Werkzeuge gemäss Modulrichtlinien verwendet. Sämtliche Inhalte wurden fachlich geprüft und verifiziert.
