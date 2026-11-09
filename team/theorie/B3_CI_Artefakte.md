# B3 Continuous Integration und Artefakte

**Autor:** Andrin  
**Reviewer:** Karol Jakub  
**Status:** In Review  

---

## [B3-K01] Continuous Integration

**Was bedeutet Continuous Integration?**

Continuous Integration (CI) ist eine **Arbeitsweise**: Alle im Team führen ihre Änderungen **häufig, mindestens täglich**, in den gemeinsamen Hauptzweig (`main`) zusammen. Jede Integration wird **automatisch geprüft**: Der Code wird gebaut und die automatischen Tests laufen. Ist etwas kaputt, merkt das Team es innerhalb von Minuten und repariert es sofort. Ziel: `main` ist jederzeit in einem funktionierenden Zustand.

Kurz: **oft integrieren + automatisch prüfen + Fehler sofort beheben.**

**Welches Problem entsteht ohne CI?**

- Jede Person arbeitet lange getrennt auf ihrem eigenen Stand. Die Stände **driften auseinander**.
- Beim späten Zusammenführen gibt es viele und grosse **Merge-Konflikte** («Integration Hell»).
- Fehler fallen **erst spät** auf, oft erst kurz vor dem Release. Dann ist unklar, welche der vielen Änderungen den Fehler verursacht hat, und die Fehlersuche dauert lange.
- Die Integrationsphase ist **nicht planbar**: Niemand weiss, wie lange das Zusammenführen dauert.
- Es gibt keinen Stand, von dem man sicher weiss, dass er funktioniert.

**Warum hat ein Team mit Pipeline, das nur alle zwei Wochen zusammenführt, noch kein CI?**

Weil CI eine **Arbeitsweise** ist und kein Werkzeug. Die Pipeline ist nur das Hilfsmittel, das die Integration prüft. Das «Continuous» bedeutet: häufig, mindestens täglich zusammenführen. Wer zwei Wochen auf einem eigenen Branch arbeitet, hat danach genau die Probleme, die CI verhindern soll: grosse Konflikte, späte Rückmeldung, schwierige Fehlersuche. Die Pipeline prüft in dieser Zeit nur den isolierten Branch, aber **nicht das Zusammenspiel mit der Arbeit der anderen**. Das Team hat also eine automatisierte Prüfung, aber keine kontinuierliche Integration.

---

## [B3-K02] Was eine Pipeline macht

**Was ist eine Pipeline, und wodurch wird sie ausgelöst?**

Eine CI-Pipeline ist ein **automatischer Ablauf aus festgelegten Schritten** (Stages/Jobs), der bei Änderungen am Code startet und den Code baut, testet und verpackt. Sie ist selbst als Code im Repository beschrieben (z.B. `.gitlab-ci.yml` oder ein GitHub-Actions-Workflow unter `.github/workflows/`) und damit versioniert und nachvollziehbar.

Auslöser (Trigger):

- ein **Push / Commit** auf einen Branch
- ein **Merge Request / Pull Request** wird eröffnet oder aktualisiert
- ein **Merge nach `main`**
- ein **Tag** (z.B. `v1.4.0`, um ein Release zu bauen)
- **zeitgesteuert** (z.B. jede Nacht) oder **manuell**

**Welche Schritte führt eine typische CI-Pipeline aus, und wozu dient jeder Schritt?**

| Schritt | Wozu |
|---|---|
| 1. Code auschecken | Die Pipeline holt genau den Stand (Commit), der geprüft werden soll. |
| 2. Abhängigkeiten installieren | Benötigte Bibliotheken in den festgelegten Versionen laden, damit der Build reproduzierbar ist. |
| 3. Linting / statische Analyse | Stil- und typische Programmierfehler finden, ohne den Code auszuführen. Schnell, darum früh. |
| 4. Build / Kompilieren | Prüfen, ob der Code überhaupt baut, und ein lauffähiges Programm erzeugen. |
| 5. Unit-Tests | Einzelne Funktionen und Klassen schnell und isoliert prüfen. |
| 6. Integrationstests | Das Zusammenspiel mehrerer Teile prüfen (z.B. Service mit Datenbank). |
| 7. Artefakt verpacken | Das Ergebnis als auslieferbares Paket bauen, z.B. ein Container-Image, mit eindeutiger Version. |
| 8. In die Registry hochladen | Das Artefakt ablegen, damit es später unverändert ausgeliefert werden kann. |

Oft kommen noch Sicherheits-Scans (z.B. bekannte Schwachstellen in Abhängigkeiten) und das Veröffentlichen von Testberichten dazu.

**Was passiert, wenn ein Schritt fehlschlägt, und was zeichnet eine gute Pipeline aus?**

Wenn ein Schritt fehlschlägt:

- Die Pipeline **bricht ab** («fail fast»). Die folgenden Schritte laufen nicht, es entsteht **kein Artefakt**, und es wird nichts ausgeliefert.
- Die Pipeline wird **rot**, das Team wird benachrichtigt. Ein Merge Request mit roter Pipeline kann (bei entsprechender Einstellung) nicht gemerged werden.
- Ist `main` rot, hat die Reparatur **Vorrang vor neuer Arbeit**: Die verantwortliche Person behebt den Fehler sofort oder macht die Änderung rückgängig (Revert). Niemand baut auf einem kaputten Stand weiter.

Eine gute Pipeline ist:

- **schnell:** Rückmeldung nach wenigen Minuten (Richtwert: unter 10 Minuten), damit man noch im Thema ist.
- **zuverlässig:** gleicher Code ergibt immer dasselbe Ergebnis, keine zufällig fehlschlagenden («flaky») Tests. Sonst ignoriert das Team rote Pipelines.
- **reproduzierbar und als Code versioniert:** Jeder kann nachvollziehen, was sie tut.
- **richtig geordnet:** schnelle, billige Prüfungen zuerst, langsame später.
- **aussagekräftig:** Bei einem Fehler sieht man sofort, welcher Schritt und welcher Test fehlgeschlagen ist.
- **läuft bei jeder Änderung** und baut das Artefakt **nur einmal**.

---

## [B3-K03] Werkzeuge und Tests

**Wozu dienen Build-Tool, Abhängigkeitsverwaltung, Linter und Container? Nennen Sie je ein Beispiel.**

| Werkzeug | Wozu | Beispiel |
|---|---|---|
| **Build-Tool** | Automatisiert das Bauen: kompilieren, Tests starten, verpacken. Ein einziger Befehl statt vieler Handgriffe, lokal und in der Pipeline gleich. | Maven, Gradle, `npm run build`, `dotnet build` |
| **Abhängigkeitsverwaltung** | Legt fest, welche Bibliotheken in welcher Version gebraucht werden, und lädt sie automatisch. Mit einer Lock-Datei wird der Build reproduzierbar. | npm (`package.json` + `package-lock.json`), Maven (`pom.xml`), pip (`requirements.txt`), NuGet |
| **Linter** | Prüft den Code statisch, also ohne ihn auszuführen, auf Stilregeln und typische Fehler (z.B. unbenutzte Variablen). Einheitlicher Code, Fehler früh gefunden. | ESLint, Checkstyle, Pylint |
| **Container** | Verpackt die Anwendung mit Laufzeitumgebung und allen Abhängigkeiten in ein Image. Läuft überall gleich («works on my machine» entfällt). Das Image ist das typische Artefakt. | Docker (`Dockerfile`), Podman |

**Was zeigt die Testpyramide, und wozu dienen Unit-, Integrations- und End-to-End-Tests?**

Die Testpyramide (nach Mike Cohn) zeigt, **wie viele Tests welcher Art** ein Projekt haben sollte:

```
        /\         End-to-End-Tests:  wenige   (langsam, teuer, fragil)
       /  \
      /----\       Integrationstests: einige
     /      \
    /--------\     Unit-Tests:        sehr viele (schnell, billig, stabil)
```

Je weiter oben, desto **langsamer, teurer und fehleranfälliger** sind die Tests, und desto mehr vom System prüfen sie. Darum: viele Unit-Tests als Basis, wenige End-to-End-Tests oben. Das Gegenteil (viele manuelle oder E2E-Tests, kaum Unit-Tests) nennt man «Ice-Cream Cone» und gilt als Anti-Pattern, weil die Pipeline langsam und unzuverlässig wird.

| Teststufe | Prüft | Beispiel aus unserem Projekt |
|---|---|---|
| **Unit-Test** | eine einzelne Einheit (Funktion, Klasse) isoliert, Abhängigkeiten werden durch Mocks ersetzt. Läuft in Millisekunden. | Validierung: negative Einwohnerzahl wird abgelehnt. |
| **Integrationstest** | das Zusammenspiel mehrerer Komponenten, z.B. Service mit echter Datenbank oder Aufruf eines anderen Services. | MS1 speichert eine Ortschaft in der Datenbank und liest sie wieder. |
| **End-to-End-Test** | das ganze System aus Sicht der Benutzerin, über alle Schichten. Langsam, darum nur für die wichtigsten Abläufe. | Ortschaft in MS1 erfassen, danach in MS2 eine Immobilie in dieser Ortschaft erfassen. |

**Was ist ein Smoke Test?**

Ein Smoke Test ist ein **kleiner, schneller Test, der prüft, ob die wichtigsten Grundfunktionen überhaupt laufen**, meist direkt nach einem Build oder Deployment. Der Name kommt aus der Elektronik: Gerät einschalten, raucht es? Er prüft nicht alles im Detail, sondern beantwortet nur: «Lebt das System, lohnt sich weiteres Testen bzw. kann es live bleiben?»

Beispiel: Nach dem Deployment antwortet der Health-Endpunkt mit `200 OK`, und `GET /api/ortschaften` liefert eine gültige Antwort. Schlägt der Smoke Test fehl, wird das Deployment gestoppt bzw. zurückgerollt.

---

## [B3-K04] Branching-Strategien

**Was ist die Grundidee von GitFlow, GitHub Flow und Trunk-based Development?**

| Strategie | Grundidee | Passt für | Nachteil |
|---|---|---|---|
| **GitFlow** | Zwei langlebige Branches: `main` (nur veröffentlichte Versionen) und `develop` (Integration). Dazu kurzlebigere `feature/*`-, `release/*`- und `hotfix/*`-Branches. Releases werden auf einem Release-Branch vorbereitet. | Software mit geplanten Releases und mehreren parallel gepflegten Versionen | komplex, viele und langlebige Branches, späte Integration, passt schlecht zu Continuous Delivery |
| **GitHub Flow** | Nur ein langlebiger Branch: `main`, der immer auslieferbar ist. Für jede Änderung ein kurzer Feature-Branch, dann Pull Request mit Review und Pipeline, Merge nach `main`, danach wird ausgeliefert. | Web-Anwendungen und Services, die laufend ausgeliefert werden | funktioniert nur, wenn die Feature-Branches wirklich kurz leben |
| **Trunk-based Development** | Alle integrieren direkt in den Hauptzweig (`main`/«Trunk») oder über sehr kurzlebige Branches (höchstens ein bis zwei Tage), mehrmals täglich. Unfertige Funktionen werden mit **Feature Toggles** versteckt. | Teams mit guter Testautomatisierung, die CI/CD konsequent leben | braucht viel Disziplin, gute automatische Tests und Feature Toggles |

Von oben nach unten werden die Branches **kürzer** und die Integration **häufiger**. Trunk-based Development entspricht am direktesten der Idee von Continuous Integration.

**Warum sind langlebige Branches riskant?**

- Der Branch **entfernt sich immer weiter von `main`**, weil dort die anderen weiterarbeiten. Je länger, desto grösser und schwieriger die Merge-Konflikte.
- Die Integration und damit das Finden von Fehlern passiert **spät**. Ob die eigene Änderung mit denen der anderen zusammenspielt, sieht man erst am Schluss.
- **Grosse Merges sind schwer zu reviewen** und schwer zu testen. Bei einem Fehler ist unklar, welche Änderung schuld ist.
- Fertige Arbeit **liegt herum** und bringt keinen Nutzen, bis sie gemerged und ausgeliefert ist.
- Es widerspricht direkt CI: Wer lange auf einem Branch arbeitet, integriert nicht kontinuierlich.

---

## [B3-K05] Semantic Versioning

**Wann erhöht man MAJOR, MINOR und PATCH? Geben Sie je ein Beispiel.**

Eine Version hat das Format **`MAJOR.MINOR.PATCH`**, z.B. `2.4.1`.

| Teil | Wird erhöht, wenn … | Beispiel | Version |
|---|---|---|---|
| **MAJOR** | eine **inkompatible** Änderung an der Schnittstelle (API) gemacht wird: Wer die alte Version nutzt, muss etwas anpassen («Breaking Change») | Ein Feld wird umbenannt oder ein Endpunkt entfernt | `2.4.1` → `3.0.0` |
| **MINOR** | **neue Funktionalität rückwärtskompatibel** dazukommt: Bestehende Nutzer funktionieren weiter | Neuer Endpunkt `GET /api/ortschaften/{id}` | `2.4.1` → `2.5.0` |
| **PATCH** | nur **rückwärtskompatible Fehler behoben** werden | Ein falscher Rundungswert wird korrigiert | `2.4.1` → `2.4.2` |

Regeln:

- Wird ein Teil erhöht, werden die **Teile rechts davon auf 0** gesetzt (`1.7.3` → `2.0.0`, `1.7.3` → `1.8.0`).
- Eine veröffentlichte Version wird **nie verändert**. Jede Änderung bekommt eine neue Nummer.
- `0.y.z` steht für die erste Entwicklungsphase, in der sich alles noch ändern kann. Ab `1.0.0` gilt die API als stabil.

**Warum ist eine aussagekräftige Versionsnummer bei Microservices besonders wichtig?**

- Microservices werden **unabhängig voneinander** entwickelt, versioniert und ausgeliefert, sind aber über ihre APIs voneinander **abhängig**. In unserem Projekt ruft MS2 (Immobilien) die API von MS1 (Ortschaften) auf.
- Die Versionsnummer sagt den anderen Services und Teams sofort, **ob ein Update gefahrlos ist**: MINOR/PATCH heisst «kompatibel», MAJOR heisst «Achtung, die Aufrufer müssen angepasst werden». Ohne diese Information merkt man einen Breaking Change erst, wenn MS2 in Produktion Fehler wirft.
- Man weiss jederzeit, **welche Version wo läuft**, kann Fehler einer bestimmten Version zuordnen und gezielt auf eine **bekannte vorherige Version zurückgehen** (Rollback).

---

## [B3-K06] Artefakte und Registry

**Was ist ein Artefakt, was eine Registry? Nennen Sie Beispiele.**

- Ein **Artefakt** ist das **Ergebnis des Builds**, das ausgeliefert wird: ein fertiges, lauffähiges Paket mit eindeutiger Version.
  Beispiele: **Container-Image** (z.B. `ms1:1.4.0`), JAR-Datei (Java), npm-Paket, ZIP-Archiv, ausführbare Datei.
- Eine **Registry** (auch Artefakt-Repository) ist die **Ablage für Artefakte**. Die Pipeline lädt das Artefakt dort hoch, und das Deployment holt es von dort ab.
  Beispiele: **GitHub Container Registry** (`ghcr.io`), GitLab Container Registry, Docker Hub, npm Registry, Maven Central, Sonatype Nexus, JFrog Artifactory.

Wichtig: Das Git-Repository enthält den **Quellcode**, die Registry enthält die **gebauten Artefakte**.

**Warum werden Artefakte unveränderlich und eindeutig versioniert, und warum soll man für Deployments nicht den Tag «latest» verwenden?**

Unveränderlich und eindeutig versioniert, weil:

- **Gebaut wird einmal, ausgeliefert mehrmals:** Genau das Artefakt, das getestet wurde, kommt auf Staging und dann auf Produktion. Würde man `1.4.0` nachträglich überschreiben, wären alle Testergebnisse wertlos.
- **Nachvollziehbarkeit:** Version → Commit → Ticket. Man weiss genau, welcher Code in Produktion läuft.
- **Rollback:** Die vorherige Version liegt unverändert in der Registry und kann jederzeit wieder ausgeliefert werden.
- **Reproduzierbarkeit:** Dieselbe Version ergibt auf jedem Server exakt dasselbe Ergebnis.

Nicht `latest`, weil:

- `latest` ist **kein fester Stand**, sondern ein beweglicher Zeiger auf das zuletzt hochgeladene Image. Er zeigt morgen auf etwas anderes als heute.
- Man weiss **nicht, welche Version tatsächlich läuft**. Dieselbe Konfiguration kann zu verschiedenen Zeiten verschiedene Versionen starten.
- Verschiedene Server können **verschiedene Stände** haben, z.B. wenn einer noch ein altes `latest` im Cache hat.
- **Kein sauberer Rollback:** Das «alte latest» ist überschrieben und lässt sich nicht mehr eindeutig benennen.

Stattdessen deployt man immer eine **feste Version** (z.B. `ms1:1.4.0` oder den Commit-Hash als Tag).

---

## [B3-K07] Fall Knight Capital und Versionierung

**Teil A: Knight Capital (1. August 2012)**

**1. Drei Ursachen des Vorfalls, die mit diesem Block zu tun haben**

1. **Manuelles Deployment ohne Automatisierung:** Ein Techniker hat die neue Software von Hand auf acht Server verteilt. Ein manueller Ablauf ist fehleranfällig, und ein Server wurde vergessen. Es gab kein automatisiertes, wiederholbares Verfahren.
2. **Keine Kontrolle, welche Version wo läuft:** Es gab kein eindeutig versioniertes Artefakt, dessen Version auf jedem Server geprüft wurde, keine Prüfung nach dem Deployment (z.B. Smoke Test oder Versionsabfrage) und keine zweite Person. Dass Server 8 die alte Version hatte, bemerkte niemand.
3. **Toter Code und ein wiederverwendetes Flag:** Der alte «Power Peg»-Code war nie aus der Codebasis entfernt worden, und das neue Programm verwendete dasselbe Konfigurations-Flag mit neuer Bedeutung. Dadurch konnte das Flag auf dem alten Server den alten Code wieder aktivieren.

**2. Was hätte ein versioniertes Artefakt mit automatisiertem Deployment verändert?**

- Die Pipeline hätte **ein** Artefakt mit eindeutiger Version gebaut, und das automatisierte Deployment hätte genau dieses Artefakt mit **denselben Schritten auf alle acht Server** verteilt. Einen Server zu «vergessen» ist so nicht möglich.
- Das Deployment hätte **geprüft, welche Version auf jedem Server läuft** (Versionsabfrage, Smoke Test). Ein Server mit der alten Version wäre sofort aufgefallen, und das Deployment wäre als fehlgeschlagen markiert worden, **bevor** das Flag eingeschaltet wurde.
- Alle Server hätten garantiert **denselben Stand** gehabt, und bei einem Problem wäre ein schneller Rollback auf die vorherige, bekannte Version möglich gewesen.

**3. Was lernen Sie aus dem Fall über alten Code und wiederverwendete Flags?**

- **Toter Code ist ein Risiko, kein harmloser Ballast.** Code, der nicht mehr gebraucht wird, soll gelöscht werden. Die Versionsverwaltung (Git) bewahrt ihn ohnehin auf, falls man ihn je wieder braucht.
- **Flags und Konfigurationsschalter nie mit neuer Bedeutung wiederverwenden.** Für eine neue Funktion gibt es einen neuen, eindeutigen Namen. Sonst hängt das Verhalten davon ab, welche Codeversion den Schalter liest.
- Flags und Feature Toggles haben ein Ablaufdatum: Nach der Einführung werden sie **wieder entfernt**, zusammen mit dem alten Codepfad.
- Bei alten Codepfaden helfen automatische Tests und Code Reviews, solche versteckten Abhängigkeiten zu entdecken.

**Teil B: Versionierung**

Ausgangsversion des Flughafen-Service: `1.3.2`. Jede Änderung baut auf der vorherigen auf.

| Nr | Änderung | Art | Neue Version |
|---|---|---|---|
| 1 | Rundungsfehler bei der Kapazität korrigiert | Fehlerbehebung, kompatibel → **PATCH** | `1.3.3` |
| 2 | Neuer Endpunkt `GET /api/airports/{id}` | neue Funktion, rückwärtskompatibel → **MINOR** (PATCH wird 0) | `1.4.0` |
| 3 | Feld `code` heisst neu `iataCode` | inkompatibel: bestehende Aufrufer, die `code` lesen, brechen → **MAJOR** (MINOR und PATCH werden 0) | `2.0.0` |
| 4 | Fehlermeldung bei doppeltem Kürzel verständlicher formuliert | keine Änderung am API-Vertrag (Statuscode und Felder gleich), nur der Text → **PATCH** | `2.0.1` |

---

## Quellen

- Martin Fowler: *Continuous Integration* (2024). https://martinfowler.com/articles/continuousIntegration.html (CI-Definition «mindestens täglich integrieren», Zehn-Minuten-Richtwert für den Build)
- Ham Vocke: *The Practical Test Pyramid*, auf martinfowler.com (2018). https://martinfowler.com/articles/practical-test-pyramid.html (Testpyramide nach Mike Cohn)
- Martin Fowler: *Patterns for Managing Source Code Branches* (2020). https://martinfowler.com/articles/branching-patterns.html (Branching-Strategien, Risiko langlebiger Branches)
- Vincent Driessen: *A successful Git branching model* (2010). https://nvie.com/posts/a-successful-git-branching-model/ (GitFlow)
- GitHub Docs: *GitHub flow*. https://docs.github.com/en/get-started/using-github/github-flow
- Trunk Based Development. https://trunkbaseddevelopment.com/
- Tom Preston-Werner: *Semantic Versioning 2.0.0* (deutsch). https://semver.org/lang/de/
- TBZ M324: Auftrag B3 inkl. Falltext Knight Capital und Kriterienkatalog. https://gitlab.com/ch-tbz-it/Stud/m324/-/tree/nuy/Theorie
- **KI-Deklaration:** Die Abschnitte wurden mit Claude (Anthropic) entworfen. Kernaussagen (CI-Definition, Testpyramide, SemVer-Regeln, Branching-Modelle) wurden mit den oben genannten Quellen abgeglichen. Die Antworten zum Fall stützen sich nur auf den Falltext des Auftrags.
