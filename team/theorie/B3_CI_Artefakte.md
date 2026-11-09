# B3 Continuous Integration und Artefakte

**Autor:** Andrin  
**Reviewer:** Karol Jakub  
**Status:** In Review  

---

## [B3-K01] Continuous Integration

- **Was ist CI?** Eine **Arbeitsweise**: Alle führen ihre Änderungen **häufig, mindestens täglich**, in den gemeinsamen `main` zusammen. Jede Integration wird **automatisch gebaut und getestet**. Ist `main` kaputt, wird das sofort repariert. Ziel: `main` funktioniert jederzeit.
- **Problem ohne CI:** Die Stände driften auseinander. Beim späten Zusammenführen gibt es grosse Merge-Konflikte («Integration Hell»), Fehler fallen erst kurz vor dem Release auf, und es ist unklar, welche Änderung sie verursacht hat.
- **Pipeline, aber nur alle zwei Wochen zusammenführen = kein CI:** CI ist eine Arbeitsweise, kein Werkzeug. Die Pipeline prüft zwei Wochen lang nur den isolierten Branch, nicht das Zusammenspiel mit der Arbeit der anderen. Am Ende entstehen genau die Probleme, die CI verhindern soll: grosse Konflikte und späte Fehler.

---

## [B3-K02] Was eine Pipeline macht

- **Was und wann:** Ein **automatischer Ablauf aus festen Schritten**, der den Code baut, testet und verpackt. Er ist als Code im Repository definiert (z.B. `.github/workflows/*.yml`). **Auslöser:** Push, Pull/Merge Request, Merge nach `main`, Tag, zeitgesteuert oder manuell.
- **Typische Schritte:**

| Schritt | Wozu |
|---|---|
| Code auschecken, Abhängigkeiten installieren | genau diesen Stand mit festen Bibliotheksversionen bauen (reproduzierbar) |
| Linting | Stil- und typische Fehler finden, ohne den Code auszuführen |
| Build | prüfen, ob der Code überhaupt baut |
| Unit- und Integrationstests | prüfen, ob der Code tut, was er soll |
| Artefakt verpacken | auslieferbares Paket (z.B. Container-Image) mit eindeutiger Version erzeugen |
| In die Registry hochladen | Artefakt für das Deployment ablegen |

- **Wenn ein Schritt fehlschlägt:** Die Pipeline **bricht ab** («fail fast»). Es laufen keine weiteren Schritte, es entsteht kein Artefakt, der Merge wird blockiert, und das Team wird benachrichtigt. Ein roter `main` wird sofort repariert oder die Änderung zurückgenommen.
- **Eine gute Pipeline ist** schnell (Rückmeldung in unter ~10 Minuten), zuverlässig (keine zufällig fehlschlagenden Tests), als Code versioniert, führt schnelle Prüfungen zuerst aus und zeigt klar, was fehlgeschlagen ist.

---

## [B3-K03] Werkzeuge und Tests

| Werkzeug | Wozu | Beispiel |
|---|---|---|
| **Build-Tool** | automatisiert Kompilieren, Testen und Verpacken mit einem Befehl | Maven, Gradle, npm |
| **Abhängigkeitsverwaltung** | lädt Bibliotheken in festgelegten Versionen (Lock-Datei → reproduzierbar) | npm (`package-lock.json`), Maven (`pom.xml`), pip |
| **Linter** | prüft den Code statisch auf Stilregeln und typische Fehler | ESLint, Checkstyle |
| **Container** | verpackt die App mit Laufzeit und Abhängigkeiten, läuft überall gleich | Docker |

**Testpyramide** (nach Mike Cohn): unten **viele** schnelle, billige Unit-Tests, in der Mitte **einige** Integrationstests, oben **wenige** langsame, teure End-to-End-Tests. Je höher, desto langsamer und fragiler, aber desto mehr vom System wird geprüft.

| Test | Prüft | Beispiel |
|---|---|---|
| **Unit** | eine Funktion/Klasse isoliert, Abhängigkeiten gemockt | negative Einwohnerzahl wird abgelehnt |
| **Integration** | Zusammenspiel mehrerer Teile | MS1 speichert eine Ortschaft in der DB und liest sie wieder |
| **End-to-End** | das ganze System aus Benutzersicht | Ortschaft in MS1 erfassen, dann Immobilie in MS2 |

**Smoke Test:** ein kleiner, schneller Test direkt nach Build oder Deployment, der nur prüft, ob die **wichtigsten Grundfunktionen überhaupt laufen**. Beispiel: Health-Endpunkt antwortet mit `200 OK`. Schlägt er fehl, wird das Deployment gestoppt.

---

## [B3-K04] Branching-Strategien

| Strategie | Grundidee |
|---|---|
| **GitFlow** | langlebige Branches `main` (Releases) und `develop` (Integration), dazu `feature/*`, `release/*`, `hotfix/*`. Für geplante Releases, aber komplex. |
| **GitHub Flow** | nur `main`, immer auslieferbar. Pro Änderung ein kurzer Feature-Branch → Pull Request mit Review und Pipeline → Merge → Deployment. |
| **Trunk-based Development** | alle integrieren mehrmals täglich direkt in `main` oder über Branches, die höchstens ein bis zwei Tage leben. Unfertiges wird mit Feature Toggles versteckt. Entspricht CI am direktesten. |

**Warum langlebige Branches riskant sind:** Der Branch entfernt sich immer weiter von `main`, darum werden die Merge-Konflikte grösser. Fehler zeigen sich erst spät beim Zusammenführen, grosse Merges sind schwer zu reviewen, und fertige Arbeit bringt keinen Nutzen, solange sie nicht integriert ist.

---

## [B3-K05] Semantic Versioning

Format **`MAJOR.MINOR.PATCH`**:

| Erhöhen | Wenn | Beispiel |
|---|---|---|
| **MAJOR** | inkompatible API-Änderung (Breaking Change) | Feld umbenannt: `2.4.1` → `3.0.0` |
| **MINOR** | neue Funktion, rückwärtskompatibel | neuer Endpunkt: `2.4.1` → `2.5.0` |
| **PATCH** | rückwärtskompatible Fehlerbehebung | Rundungsfehler korrigiert: `2.4.1` → `2.4.2` |

Die Teile rechts vom erhöhten Teil werden auf 0 gesetzt. Eine veröffentlichte Version wird nie verändert.

**Warum wichtig bei Microservices:** Die Services werden unabhängig ausgeliefert, hängen aber über ihre APIs voneinander ab (bei uns ruft MS2 die API von MS1 auf). Die Versionsnummer zeigt sofort, ob ein Update kompatibel ist (MINOR/PATCH) oder die Aufrufer anpassen müssen (MAJOR). Ausserdem weiss man, welche Version wo läuft, und kann gezielt auf eine bekannte Version zurückgehen.

---

## [B3-K06] Artefakte und Registry

- **Artefakt:** das gebaute, auslieferbare Ergebnis der Pipeline. Beispiele: Container-Image (`ms1:1.4.0`), JAR-Datei, npm-Paket.
- **Registry:** die Ablage für Artefakte, von der aus deployt wird. Beispiele: GitHub Container Registry (`ghcr.io`), GitLab Container Registry, Docker Hub, Nexus.
- **Warum unveränderlich und eindeutig versioniert:** Genau das getestete Artefakt soll in Produktion laufen («build once, deploy many»). Man weiss, welcher Code wo läuft (Version → Commit → Ticket), und ein Rollback auf die vorherige Version ist jederzeit möglich.
- **Warum nicht `latest`:** `latest` ist ein beweglicher Zeiger auf das zuletzt hochgeladene Image, keine feste Version. Man weiss nicht, was wirklich läuft, verschiedene Server können verschiedene Stände haben, und ein sauberer Rollback ist nicht möglich. Darum immer eine feste Version deployen (z.B. `ms1:1.4.0`).

---

## [B3-K07] Fall Knight Capital und Versionierung

**Teil A: Knight Capital**

1. **Drei Ursachen:**
   - **Manuelles Deployment:** Ein Techniker verteilte die Software von Hand auf acht Server und vergass einen.
   - **Keine Kontrolle der laufenden Version:** Es gab kein eindeutig versioniertes Artefakt, keine Prüfung nach dem Deployment und keine zweite Person. Niemand bemerkte die alte Version auf Server 8.
   - **Toter Code und wiederverwendetes Flag:** Der alte «Power Peg»-Code war nie entfernt worden, und das Flag wurde mit neuer Bedeutung wiederverwendet.
2. **Mit versioniertem Artefakt und automatisiertem Deployment** wäre dasselbe Artefakt mit denselben Schritten auf alle acht Server gekommen, also wäre keiner vergessen worden. Eine automatische Versionsprüfung bzw. ein Smoke Test hätte eine Abweichung gemeldet, **bevor** das Flag eingeschaltet wurde.
3. **Lehre:** Nicht mehr benutzten Code löschen (Git bewahrt ihn trotzdem auf). Flags nie mit neuer Bedeutung wiederverwenden, sondern neue, eindeutige Namen verwenden und alte Flags nach Gebrauch entfernen.

**Teil B: Versionierung** (Start `1.3.2`, jeweils von der vorherigen Version aus)

| Nr | Änderung | Art | Version |
|---|---|---|---|
| 1 | Rundungsfehler korrigiert | Fehlerbehebung → PATCH | `1.3.3` |
| 2 | neuer Endpunkt `GET /api/airports/{id}` | neue Funktion, kompatibel → MINOR | `1.4.0` |
| 3 | `code` heisst neu `iataCode` | Breaking Change → MAJOR | `2.0.0` |
| 4 | Fehlermeldung verständlicher formuliert | API-Vertrag unverändert → PATCH | `2.0.1` |

---

## Quellen

- Martin Fowler: *Continuous Integration* (2024). https://martinfowler.com/articles/continuousIntegration.html
- Ham Vocke: *The Practical Test Pyramid* (2018). https://martinfowler.com/articles/practical-test-pyramid.html
- Martin Fowler: *Patterns for Managing Source Code Branches* (2020). https://martinfowler.com/articles/branching-patterns.html
- Vincent Driessen: *A successful Git branching model* (2010). https://nvie.com/posts/a-successful-git-branching-model/
- GitHub Docs: *GitHub flow*. https://docs.github.com/en/get-started/using-github/github-flow
- Trunk Based Development. https://trunkbaseddevelopment.com/
- *Semantic Versioning 2.0.0* (deutsch). https://semver.org/lang/de/
- TBZ M324: Auftrag B3 inkl. Falltext und Kriterienkatalog. https://gitlab.com/ch-tbz-it/Stud/m324/-/tree/nuy/Theorie
- **KI-Deklaration:** Entwurf mit Claude (Anthropic). Kernaussagen wurden mit den obigen Quellen abgeglichen. Der Fall stützt sich nur auf den Falltext des Auftrags.
