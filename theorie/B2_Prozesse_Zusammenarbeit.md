[TOC]

# B2: Prozesse und Zusammenarbeit

Dieses Dokument beantwortet die Leitfragen B2-K01 bis B2-K07. Beim Fall Pixelwerk verwende ich nur die Angaben aus dem Auftrag. Wo der Fall eine Geschäftsregel offenlässt, ist sie als Klärungspunkt markiert.

## [B2-K01] Vom SDLC zum DevOps Lifecycle

### 1. Phasen und Kreislauf

Ein gebräuchliches DevOps-Modell besteht aus **Plan → Develop → Deliver → Operate**. In *Plan* werden Ziele und Anforderungen festgelegt. In *Develop* wird die Änderung umgesetzt und getestet. *Deliver* umfasst das Bereitstellen und Ausliefern. In *Operate* wird die Anwendung betrieben und überwacht. Rückmeldungen aus Betrieb, Monitoring und von Nutzenden fliessen wieder in die Planung ein. Manche Modelle teilen diese Phasen weiter auf, zum Beispiel in Code, Build, Test, Release und Deployment. [1]

Der Lifecycle ist ein Kreislauf, weil Software nach dem ersten Release weiter betrieben und verbessert wird. Monitoring zeigt, ob eine Änderung funktioniert. Störungen und neue Wünsche führen zu weiteren Tickets und Änderungen.

### 2. Drei Unterschiede zum klassischen Vorgehen

| Aspekt | Klassisches, sequenzielles Vorgehen (z. B. Wasserfall) | DevOps Lifecycle |
|---|---|---|
| Ablauf | Anforderungen, Entwurf, Umsetzung und Test folgen überwiegend nacheinander. | Planung, Umsetzung, Auslieferung und Betrieb wiederholen sich in kurzen Zyklen. |
| Zusammenarbeit | Arbeit wird häufiger zwischen getrennten Rollen oder Abteilungen übergeben. | Entwicklung und Betrieb tragen gemeinsam Verantwortung für den Weg bis zum laufenden Produkt. |
| Auslieferung und Feedback | Grosse Releases und spätes Nutzerfeedback können Änderungen verzögern. | Kleine Änderungen, automatisierte Prüfungen und Monitoring liefern früheres Feedback. |

Im Wasserfall ist es meist aufwendig, nach Abschluss einer Phase zu früheren Entscheidungen zurückzukehren. Ein DevOps-Team kann Anforderungen anhand von Tests, Betriebserfahrungen und Nutzerfeedback laufend anpassen. [1][2]

### 3. Warum sind kleine, häufige Änderungen weniger riskant?

Kleine Änderungen sind leichter zu verstehen, zu prüfen und zu testen. Wenn etwas fehlschlägt, gibt es weniger mögliche Ursachen und der Umfang der betroffenen Änderung ist kleiner. Das Team erhält früher Feedback und kann ein Problem schneller eingrenzen oder die Änderung zurücknehmen. Kleine Arbeitspakete senken das Risiko, dass viele Monate Arbeit gleichzeitig von einem Release abhängen. Sie garantieren keine Fehlerfreiheit, machen Fehler aber meist leichter erkennbar und behebbar. [3]

## [B2-K02] MVP und Walking Skeleton

### 1. MVP

Ein **Minimum Viable Product (MVP)** ist die kleinste nutzbare Produktversion, die ein Kernproblem löst und sich mit echten Nutzenden prüfen lässt. Das Ziel ist, eine wichtige Annahme früh zu testen und aus Rückmeldungen zu lernen, bevor viel Aufwand in weitere Funktionen fliesst. Ein MVP ist daher nicht einfach eine unfertige Version: Es muss für den vorgesehenen Test genügend Nutzen bieten. [4]

### 2. Walking Skeleton

Ein **Walking Skeleton** ist eine sehr kleine, ausführbare Funktion, die bereits Ende zu Ende durch die wichtigsten Teile eines Systems läuft. Sie verbindet zum Beispiel Benutzeroberfläche, API, Datenbank und Auslieferungsweg, auch wenn die Funktionalität noch minimal ist. Man baut es früh, damit Integrations- und Betriebsrisiken sichtbar werden, bevor viele Funktionen darauf aufbauen. Danach wird das System schrittweise erweitert. [5]

Der Schwerpunkt ist verschieden: Ein MVP prüft vor allem, ob ein Produkt für Nutzende einen Kernnutzen hat. Ein Walking Skeleton prüft zuerst, ob die technischen Hauptteile zusammenarbeiten und ausführbar sind.

## [B2-K03] Anforderungen und Tickets

### 1. User Story mit zwei testbaren Akzeptanzkriterien

Ein gängiges Format lautet: **Als [Rolle] möchte ich [Ziel], damit [Nutzen].** Die Akzeptanzkriterien beschreiben beobachtbares Verhalten, an dem das Team prüfen kann, ob die Story erfüllt ist. [6]

**User Story:** Als Kundin möchte ich eine zulässige bevorstehende Buchung stornieren können, damit ich einen Termin, den ich nicht wahrnehmen kann, freigeben kann.

- **Akzeptanzkriterium 1:** Wenn eine angemeldete Kundin eine eigene Buchung innerhalb der erlaubten Stornierungsfrist bestätigt, wird die Buchung als storniert gespeichert und nicht mehr als aktive Buchung angezeigt.
- **Akzeptanzkriterium 2:** Wenn eine stornierte Buchung bezahlt wurde, wird gemäss der festgelegten Rückerstattungsregel eine Rückerstattung ausgelöst und eine Bestätigungsmail mit dem Stornierungs- und Rückerstattungsstatus versendet.

Der Auftrag nennt keine Stornierungsfrist und keine Berechnungsregel für den Rückerstattungsbetrag. Diese Regeln müssen vor der Umsetzung mit der Auftraggeberin geklärt werden.

### 2. Vertikaler und horizontaler Schnitt

Ein **horizontaler Schnitt** teilt Arbeit nach technischen Schichten auf, zum Beispiel Datenbank, Backend und Mailversand. Das sind die drei geplanten Tickets im Fall Pixelwerk. Für sich allein ermöglichen sie Kundinnen noch keine durchgängige Stornierung.

Ein **vertikaler Schnitt** liefert eine kleine, benutzbare Funktion durch alle dafür nötigen Schichten, etwa Benutzeroberfläche, Backend und Datenspeicherung. So entsteht früher ein prüfbarer Nutzwert; das Team kann die Funktion Ende zu Ende testen und früher Rückmeldung erhalten. [7]

### 3. Ticketarten und Vorlagen

| Ticketart | Zweck |
|---|---|
| **Feature** | Neue oder erweiterte Funktion für Nutzende. |
| **Bug** | Bestehendes Verhalten funktioniert nicht wie vorgesehen. |
| **Incident** | Ungeplante Störung oder Beeinträchtigung eines laufenden Dienstes; zuerst soll der Dienst wieder funktionieren. |
| **Change** | Geplante Änderung an einem Dienst, einer Infrastruktur oder einer Konfiguration, deren Auswirkungen und Risiken beurteilt werden. |

Ticketarten können je nach Teamwerkzeug unterschiedlich benannt sein. Vorlagen geben dem Team einheitliche Felder vor, zum Beispiel Problem oder Nutzen, betroffene Nutzende, Schritte zur Reproduktion, Auswirkung, Akzeptanzkriterien und nötige Betriebsinformationen. So fehlen bei Triage und Umsetzung seltener wichtige Angaben. [10][14]

## [B2-K04] Kanban und Definition of Done

### 1. Grundprinzipien von Kanban

Kanban beginnt mit dem bestehenden Prozess, strebt schrittweise Veränderungen an, respektiert zunächst bestehende Rollen und Verantwortlichkeiten und fördert Führung auf allen Ebenen. Die Kernpraktiken sind, die Arbeit sichtbar zu machen, WIP zu begrenzen, den Arbeitsfluss zu steuern, Prozessregeln klar zu vereinbaren, Feedback einzuholen und den Ablauf gemeinsam weiterzuentwickeln. [8]

### 2. WIP-Limits und Engpässe

**WIP** bedeutet *Work in Progress*, also begonnene, aber noch nicht abgeschlossene Arbeit. Ein WIP-Limit begrenzt, wie viele Karten gleichzeitig in einer aktiven Spalte liegen dürfen. Dadurch sinkt Multitasking, und das Team konzentriert sich darauf, angefangene Arbeit abzuschliessen, bevor es mehr beginnt.

Ein Engpass zeigt sich, wenn sich Karten wiederholt in einer Spalte ansammeln, dort lange liegen bleiben oder die Warte- und Durchlaufzeit steigen. Das Board zeigt damit, an welcher Stelle der Arbeitsfluss stockt; die Ursache muss das Team anschliessend gemeinsam untersuchen. [8]

### 3. DevOps-taugliche Definition of Done

Die **Definition of Done (DoD)** ist ein gemeinsamer Qualitätsstandard für alle Arbeit. Akzeptanzkriterien gelten dagegen für eine bestimmte Story. Neben „Code fertig, Tests grün“ kann eine DevOps-DoD zum Beispiel verlangen:

- Akzeptanzkriterien erfüllt und Änderung durch eine andere Person geprüft.
- Build und passende automatisierte Tests erfolgreich; vereinbarte Sicherheits- und Qualitätsprüfungen bestanden.
- Dokumentation und nötige Betriebsinformationen aktualisiert.
- Versioniertes Ergebnis ist reproduzierbar und auslieferbar; Monitoring und ein sinnvoller Rückweg bei einem Fehler sind geklärt.
- Nach dem Deployment in die vereinbarte Umgebung ist die Funktion geprüft und der Dienst läuft erwartungsgemäss.

Welche Umgebungen und Prüfungen dazugehören, legt das Team gemeinsam fest. Eine DoD sorgt für eine einheitliche Mindestqualität und macht den Übergang in den Betrieb sichtbar. [9]

## [B2-K05] Nachvollziehbare Entwicklung im Team

### 1. Zusammenhang der Schritte

Der typische Weg einer Änderung ist:

**Ticket → Branch → Commits → Merge Request → Review → Pipeline → Merge → Artefakt → Deployment → Monitoring → neue Tickets**

Das Ticket hält fest, welches Problem oder welcher Nutzen bearbeitet wird. Für die Umsetzung entsteht ein Branch. Commits speichern die einzelnen Änderungsschritte und sollten auf das Ticket verweisen. Im Merge Request (MR) schlägt das Team vor, die Änderung in den Hauptzweig zu übernehmen; der MR verlinkt idealerweise auch das Ticket.

Eine andere Person prüft die Änderung im Review. Eine Pipeline baut und prüft den Stand automatisch, zum Beispiel mit Tests und Qualitätsprüfungen. Nach erfolgreichem Review und erfolgreicher Pipeline wird der MR gemergt. Das versionierte Artefakt wird in die vereinbarten Umgebungen ausgeliefert. Monitoring prüft den Betrieb; Erkenntnisse und Störungen fliessen als neue Tickets zurück. [11]

### 2. Zweck eines Peer Reviews

Ein Peer Review hilft neben der Fehlersuche auch, Code verständlicher und wartbarer zu machen, Sicherheits- und Qualitätsrisiken zu erkennen und Wissen im Team zu teilen. Dadurch hängt die Wartung nicht nur von der Person ab, die eine Änderung geschrieben hat. Reviews fördern gemeinsame Standards und Verantwortung für das Produkt. [11]

## [B2-K06] DORA-Kennzahlen

### 1. Die vier Kennzahlen

| Kennzahl | Was sie misst |
|---|---|
| **Deployment Frequency** (Deployment-Häufigkeit) | Wie oft Änderungen in die Produktion ausgeliefert werden. |
| **Lead Time for Changes** | Zeit vom Commit einer Änderung bis zu ihrer erfolgreichen Auslieferung in die Produktion. |
| **Change Failure Rate** | Anteil der Produktions-Deployments, nach denen eine Störung oder ein Fehler eine Korrektur, einen Hotfix oder Rollback nötig macht. |
| **Time to Restore Service** | Zeit, bis ein durch eine Änderung beeinträchtigter Dienst wiederhergestellt ist. |

Diese vier Kennzahlen zeigen zusammen sowohl den Durchsatz als auch die Stabilität der Auslieferung. [12]

### 2. Warum gehören Tempo und Stabilität zusammen?

Deployment-Häufigkeit und Lead Time zeigen, wie schnell Änderungen durch das System kommen. Change Failure Rate und Time to Restore zeigen, wie häufig dabei Probleme entstehen und wie schnell das Team sie behebt. Nur die Geschwindigkeit zu steigern kann zu mehr Störungen führen; nur Stabilität zu betrachten kann langsame, seltene Releases verbergen. Kleine, sichere Änderungen und schnelle Wiederherstellung unterstützen beides. [3][12]

### 3. Warum nicht einzelne Personen beurteilen?

DORA-Kennzahlen beschreiben den Auslieferungsprozess eines Dienstes oder Teams, nicht die Leistung einer einzelnen Person. Ein langer Review oder eine langsame Deployment-Freigabe kann zum Beispiel die Lead Time beeinflussen, obwohl eine einzelne Entwicklerin ihre Arbeit rechtzeitig abgeschlossen hat. Einzelvergleiche schaffen falsche Anreize und blenden Abhängigkeiten im System aus. Sinnvoll ist, den Verlauf des Teams zu beobachten und die Kennzahlen zur gemeinsamen Verbesserung zu nutzen. [13]

## [B2-K07] Fall Pixelwerk

### 1. Berechnung der vier DORA-Kennzahlen

Für die Rechnung zählen wir die Releases R1 und R2 als Produktions-Deployments. Die Daten umfassen nur zwei Releases; die Werte sind deshalb eine Momentaufnahme und keine verlässliche Langzeitbewertung.

| Kennzahl | Berechnung anhand des Falls | Ergebnis |
|---|---|---|
| **Deployment Frequency** | Laut Fall wird einmal pro Monat ausgeliefert. R1 und R2 liegen 35 Tage auseinander. | Ungefähr **1 Deployment pro Monat**. |
| **Lead Time for Changes** | Ticket #311: Commit am 3. März, Produktion mit R2 am 5. April. | **33 Kalendertage**. |
| **Change Failure Rate** | Beide Releases brauchten danach einen Hotfix: 2 fehlerhafte Releases ÷ 2 Releases × 100. | **100 %** in dieser kleinen Stichprobe. |
| **Time to Restore Service** | Durchschnitt der zwei Wiederherstellungszeiten: (6 h + 14 h) ÷ 2. | **10 Stunden** im Durchschnitt. |

Auffällig sind die monatliche Auslieferung und die Hotfixes nach beiden betrachteten Releases. Das spricht dafür, kleinere Änderungen häufiger auszuliefern und den Weg vom Commit bis zur Produktion zu verbessern. Die mittlere Wiederherstellung dauert zehn Stunden. Aus zwei Releases allein lässt sich noch kein stabiler langfristiger Trend ableiten. [3][12]

### 2. Engpass auf dem Board

Der stärkste Hinweis ist die Spalte **Bereit für Deploy** mit 11 Karten. Dort liegen mehr Karten als in *In Arbeit* (9) und *Review* (1). Zusammen mit der monatlichen Auslieferung und der getrennten Betriebskapazität von einer Person deutet das auf einen Engpass im Deployment- oder Release-Prozess hin. Es ist eher kein Review-Engpass, denn dort liegt nur eine Karte.

Das Board ist eine Momentaufnahme. Um die Ursache zu bestätigen, sollte das Team zusätzlich messen, wie lange die 11 Karten warten und wie viele Deployments pro Zeitraum tatsächlich durchgeführt werden.

### 3. Vorschlag für ein WIP-Limit in «In Arbeit»

Als Startwert schlage ich **maximal 4 Karten** in *In Arbeit* vor: eine gleichzeitig aktive Karte pro Person im vierköpfigen Entwicklungsteam. Ist das Limit erreicht, beginnt das Team keine weitere Arbeit, sondern hilft beim Abschliessen, Prüfen oder Entblocken bestehender Karten. Nach einigen Wochen wird anhand von Durchlaufzeit, blockierten Karten und Teamkapazität überprüft, ob das Limit passt.

Dieses Limit reduziert parallele Arbeit in der Entwicklung. Es leert die 11 Karten in *Bereit für Deploy* nicht automatisch; dafür müssen Entwicklung und Betrieb zusätzlich den Release- und Deployment-Ablauf verbessern.

### 4. Drei vertikale Stories für die Stornierung

Die Tickets *DB-Tabellen*, *Backend-Logik* und *Mail-Versand* schneiden nach technischen Schichten. Sie können jeweils fertig sein, ohne dass eine Kundin schon eine Stornierung durchführen kann. Die folgenden Stories liefern stattdessen schrittweise nutzbare Abläufe durch alle jeweils benötigten Schichten:

1. **Unbezahlte Buchung stornieren:** Als Kundin möchte ich eine eigene, bevorstehende und noch unbezahlte Buchung stornieren können, damit der Termin freigegeben wird. Die Änderung läuft von der Buchungsansicht über Berechtigungsprüfung und Backend bis zum gespeicherten Status.
2. **Bezahlte Buchung stornieren und Rückerstattung auslösen:** Als Kundin möchte ich eine zulässige bezahlte Buchung stornieren können, damit mir der nach der vereinbarten Regel zustehende Betrag zurückerstattet wird. Der Ablauf aktualisiert die Buchung, veranlasst die Rückerstattung und zeigt deren Status an.
3. **Bestätigung per Mail erhalten:** Als Kundin möchte ich nach der Stornierung eine Bestätigungsmail erhalten, damit ich weiss, dass die Buchung storniert wurde und wie der Rückerstattungsstatus lautet. Der Ablauf verbindet das Stornierungsereignis mit dem Mailversand und den passenden Buchungs- und Zahlungsinformationen.

Die Frist, der Rückerstattungsbetrag und der Umgang mit fehlgeschlagenen Zahlungen sind im Falltext nicht angegeben. Diese Regeln müssen mit der Auftraggeberin geklärt und in testbare Akzeptanzkriterien übersetzt werden.

## Quellen

1. [Microsoft Learn: Apply Software Engineering Systems](https://learn.microsoft.com/en-us/platform-engineering/engineering-systems)
2. [Atlassian: Waterfall Methodology](https://www.atlassian.com/agile/project-management/waterfall-methodology)
3. [DORA: Working in small batches](https://dora.dev/capabilities/working-in-small-batches/)
4. [Atlassian: Minimum Viable Product (MVP)](https://www.atlassian.com/agile/product-management/minimum-viable-product)
5. [Aalto OpenCS: Running the Walking Skeleton](https://csfoundations.cs.aalto.fi/en/courses/web-software-development/part-1/3-running-the-walking-skeleton)
6. [Atlassian: User Stories](https://www.atlassian.com/agile/project-management/user-stories)
7. [Agile Alliance: A Tale of Slicing and Imagination](https://agilealliance.org/resources/experience-reports/a-tale-of-slicing-and-imagination/)
8. [Atlassian: Kanban](https://www.atlassian.com/de/agile/kanban)
9. [Atlassian: Definition of Done](https://www.atlassian.com/agile/project-management/definition-of-done)
10. [Atlassian Support: What are work types?](https://support.atlassian.com/jira-cloud-administration/docs/what-are-issue-types)
11. [GitLab: Code Review Guidelines](https://docs.gitlab.com/development/code_review/)
12. [DORA: 2024 State of DevOps Report — The four keys](https://dora.dev/research/2024/dora-report/2024-dora-accelerate-state-of-devops-report.pdf)
13. [DORA: How to empower software delivery teams](https://dora.dev/guides/how-to-empower-software-delivery-teams/)
14. [Atlassian Support: Add content to describe a work item](https://support.atlassian.com/jira-software-cloud/docs/add-files-images-and-other-content-to-describe-an-issue/)
