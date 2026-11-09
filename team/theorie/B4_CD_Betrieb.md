# B4 Continuous Delivery, Umgebungen und Deployment

**Autor:** Karol  
**Reviewer:** Marvin Kropf  
**Status:** In Review  

---

## [B4-K01] Continuous Delivery und Continuous Deployment

**Was ist der Unterschied zwischen Continuous Delivery und Continuous Deployment?**

Beide bauen auf Continuous Integration auf. Jede Änderung, die die Pipeline besteht, wird automatisch gebaut, getestet und bis auf Staging gebracht. Der Unterschied liegt im **letzten Schritt nach Produktion**:

| | Continuous Delivery | Continuous Deployment |
|---|---|---|
| Ziel | Jede Änderung ist **jederzeit auslieferbar** | Jede Änderung wird **automatisch ausgeliefert** |
| Schritt nach Produktion | **manuelle Entscheidung** (ein Klick, ein Mensch gibt frei) | **vollautomatisch**, ohne menschliche Freigabe |
| Wann geht es live? | wenn das Team oder das Business es will | sobald alle automatischen Prüfungen grün sind |

```
CI:                    Commit → Build → Test
Continuous Delivery:   Commit → Build → Test → Staging → [Mensch gibt frei] → Produktion
Continuous Deployment: Commit → Build → Test → Staging → Produktion (automatisch)
```

Merksatz: Bei Continuous Delivery **könnte** man jederzeit ausliefern, bei Continuous Deployment **wird** jede grüne Änderung ausgeliefert.

**Was muss ein Team beherrschen, bevor es Continuous Deployment einführen kann, und warum?**

Bei Continuous Deployment fehlt die letzte menschliche Kontrolle vor Produktion. Was diese Kontrolle vorher geleistet hat, müssen andere Mechanismen übernehmen:

- **Zuverlässige, umfassende automatische Tests:** Die Tests sind die einzige Kontrolle vor Produktion. Lücken oder «flaky» Tests führen direkt zu Fehlern bei den Benutzern.
- **Gelebte CI mit kleinen, häufigen Änderungen:** Kleine Änderungen sind leichter zu prüfen, und bei einem Fehler ist sofort klar, welche Änderung schuld ist.
- **Vollständig automatisiertes, reproduzierbares Deployment:** Keine Handarbeit, sonst ist es nicht kontinuierlich und nicht verlässlich.
- **Monitoring und Alarme:** Fehler in Produktion müssen in Minuten erkannt werden, weil niemand vorher hingeschaut hat.
- **Schneller Rollback bzw. Roll-forward:** Wenn trotzdem etwas schiefgeht, muss die Störung schnell behoben sein.
- **Feature Toggles und risikoarme Deployment-Strategien (z.B. Canary):** Damit unfertige Funktionen versteckt bleiben und ein Fehler nur wenige Benutzer trifft.

---

## [B4-K02] Umgebungen und «Build once, deploy many»

**Wozu dienen die Umgebungen Dev, Test, Staging und Produktion?**

| Umgebung | Wozu | Wer |
|---|---|---|
| **Dev** (Entwicklung) | Entwickeln und schnell ausprobieren, meist lokal auf dem eigenen Rechner (z.B. mit Docker Compose) | Entwickelnde |
| **Test** | Automatische und manuelle Tests in einer gemeinsamen Umgebung, z.B. Integrationstests mit anderen Services | Pipeline, Testende |
| **Staging** | **Generalprobe:** möglichst identisch mit Produktion. Letzte Prüfung (Smoke Tests, Abnahme) mit genau dem Artefakt, das danach live geht | Team, Abnahme |
| **Produktion** | Hier arbeiten die **echten Benutzer mit echten Daten**. Fehler haben hier echte Folgen | Benutzer, Betrieb |

Je weiter rechts, desto näher an der Realität und desto vorsichtiger wird geändert.

**Was ist Umgebungs-Parität, und warum ist sie wichtig?**

Umgebungs-Parität heisst: Die Umgebungen sind sich **so ähnlich wie möglich**, gleiche Betriebssystem- und Laufzeitversionen, gleiche Datenbank (Typ und Version), gleicher Aufbau der Konfiguration, gleicher Deployment-Ablauf. Unterschiede gibt es nur bei Grösse, Daten und den Konfigurationswerten.

Wichtig, weil:

- Ein Test auf Staging nur dann **etwas über Produktion aussagt**, wenn Staging gleich aufgebaut ist.
- Sonst treten Fehler **erst in Produktion** auf («auf Staging lief es doch»), z.B. weil lokal eine andere Datenbank verwendet wurde als in Produktion.
- Mit Containern und Infrastructure as Code lässt sich Parität gut erreichen, weil überall dasselbe Image und dieselbe Beschreibung verwendet werden.

**Was bedeutet «Build once, deploy many», und warum ist das wichtig?**

Das Artefakt (z.B. das Container-Image `ms1:1.4.0`) wird **genau einmal** in der Pipeline gebaut. Danach wird **dasselbe, unveränderte Artefakt** nacheinander auf Test, Staging und Produktion ausgeliefert. Zwischen den Umgebungen ändert sich **nur die Konfiguration** (z.B. die Datenbankadresse über Umgebungsvariablen), nie das Artefakt.

Wichtig, weil:

- **Getestet = ausgeliefert:** Was auf Staging geprüft wurde, ist Bit für Bit das, was in Produktion läuft. Ein neuer Build pro Umgebung könnte ein anderes Ergebnis liefern (andere Abhängigkeitsversionen, anderes Basis-Image), und die Tests wären wertlos.
- **Nachvollziehbarkeit:** Eine Version, ein Artefakt, ein Commit, in allen Umgebungen.
- **Schneller und günstiger:** Nicht mehrmals bauen. Rollback = vorheriges Artefakt erneut ausliefern.

---

## [B4-K03] Infrastructure as Code und Konfiguration

**Was ist Infrastructure as Code, und welchen Vorteil hat es gegenüber von Hand eingerichteten Servern?**

Bei **Infrastructure as Code (IaC)** wird die Infrastruktur (Server, Container, Netzwerke, Datenbanken, Konfiguration) in **Dateien beschrieben**, die im Repository liegen. Ein Werkzeug richtet die Infrastruktur automatisch nach dieser Beschreibung ein.
Beispiele: Docker Compose (`docker-compose.yml`), Terraform, Ansible, Kubernetes-Manifeste.

Vorteile gegenüber Servern, die von Hand eingerichtet werden:

- **Reproduzierbar:** Jedes Mal entsteht exakt dieselbe Umgebung. Eine neue Umgebung (oder ein Ersatz nach einem Ausfall) steht in Minuten.
- **Versioniert und nachvollziehbar:** Jede Änderung hat einen Commit, kann per Merge Request **reviewt** und bei Bedarf **rückgängig** gemacht werden.
- **Dokumentiert:** Die Datei *ist* die Dokumentation. Kein Wissen nur im Kopf einer Person.
- **Keine «Snowflake»-Server:** Von Hand gepflegte Server werden mit der Zeit alle ein bisschen verschieden (Configuration Drift), und niemand weiss genau, wie sie eingerichtet sind. IaC verhindert das und hilft bei der Umgebungs-Parität.

**Warum wird Konfiguration (z.B. Datenbankadresse) von aussen übergeben statt im Code festgelegt?**

- **Build once, deploy many:** Dasselbe Artefakt läuft in allen Umgebungen. Das geht nur, wenn die Werte, die sich pro Umgebung unterscheiden (Datenbankadresse, URL von MS1, Log-Level), **nicht im Artefakt** stecken, sondern beim Start übergeben werden, typischerweise als **Umgebungsvariablen** (z.B. `DB_URL`, `MS1_URL`).
- **Kein neuer Build für eine Konfigurationsänderung:** Eine andere Adresse heisst nur: Variable ändern und neu starten.
- **Sicherheit:** Passwörter und andere Secrets gehören nicht in den Code und nicht ins Repository.
- Das entspricht dem Prinzip der Twelve-Factor App: strikte Trennung von Konfiguration und Code.

---

## [B4-K04] Secrets

**Was sind Secrets, und wo gehören sie hin bzw. nicht hin (Repository, Container-Image)?**

**Secrets** sind vertrauliche Daten, die **Zugriff gewähren**: Passwörter, Datenbank-Zugangsdaten, API-Keys, Tokens, private Schlüssel und Zertifikate.

| Gehören **nicht** hin | Warum |
|---|---|
| ins **Repository** (Code, Konfigurationsdateien, eine committete `.env`-Datei) | Alle mit Lesezugriff sehen sie, und sie bleiben für immer in der Git-History |
| ins **Container-Image** (z.B. `ENV` oder kopierte Dateien im `Dockerfile`) | Jede Person, die das Image aus der Registry holt, kann die Schichten und Umgebungsvariablen auslesen |
| in Logs, Tickets, Chats, Screenshots oder KI-Tools | unkontrollierte Weitergabe |

**Gehören hin:** in einen dafür vorgesehenen, geschützten Speicher, z.B. die **CI/CD-Variablen** der Plattform (GitHub Actions Secrets, GitLab CI/CD Variables, maskiert und geschützt) oder einen Secret Manager (z.B. HashiCorp Vault, Azure Key Vault). Von dort werden sie erst **zur Laufzeit** in die Anwendung gegeben, als Umgebungsvariable oder eingebundene Datei.

**Warum reicht es nicht, ein versehentlich committetes Passwort wieder aus dem Repository zu löschen?**

- Git speichert die **ganze Geschichte**. Ein neuer Commit, der das Passwort löscht, ändert nichts daran: Im alten Commit ist es weiterhin lesbar.
- Es existieren bereits **Kopien**: in den Klonen der Teammitglieder, in Forks, in CI-Logs und Caches. Öffentliche Repositories werden zudem von Bots innert Minuten nach Secrets durchsucht.
- Das Passwort muss darum als **kompromittiert** gelten. Die einzig wirksame Massnahme: das Secret **sofort ungültig machen und ersetzen** (Rotation). Die History zu bereinigen (z.B. mit `git filter-repo`) ist höchstens eine Ergänzung.

**Was bedeuten Rotation und Least Privilege?**

- **Rotation:** Secrets werden **regelmässig und sofort nach einem Verdacht** durch neue ersetzt, und die alten werden ungültig gemacht. Ein gestohlenes Secret ist dann nur kurze Zeit nutzbar. Rotation sollte automatisiert oder zumindest einfach sein, damit sie im Notfall schnell geht.
- **Least Privilege (Prinzip der minimalen Rechte):** Jede Person, jeder Service und jeder Token erhält **nur die Rechte, die er wirklich braucht**, und nur so lange wie nötig. Beispiel: Der Datenbankbenutzer von MS1 hat nur Zugriff auf die Datenbank von MS1, ein Deploy-Token darf Images nur lesen. Wird ein Secret gestohlen, bleibt der Schaden begrenzt.

---

## [B4-K05] Deployment-Strategien und Feature Toggles

**Wie funktionieren Recreate, Rolling, Blue/Green und Canary? Nennen Sie je einen Vor- und Nachteil.**

| Strategie | Funktionsweise | Vorteil | Nachteil |
|---|---|---|---|
| **Recreate** | Alle Instanzen der alten Version werden **gestoppt**, danach wird die neue Version gestartet. | sehr einfach, nie zwei Versionen gleichzeitig | **Ausfallzeit (Downtime)**, und ein Fehler trifft sofort alle |
| **Rolling** | Die Instanzen werden **nacheinander** ersetzt, z.B. von vier Instanzen immer eine nach der anderen. | **keine Downtime** und keine zusätzliche Infrastruktur nötig | während des Rollouts laufen **beide Versionen parallel** (müssen kompatibel sein), Rollback dauert ebenso lang |
| **Blue/Green** | Es gibt **zwei identische Produktionsumgebungen**. «Blue» ist live, auf «Green» wird die neue Version installiert und geprüft. Dann schaltet der Router den **gesamten Verkehr auf einmal** auf Green um. Blue bleibt als Reserve stehen. | keine Downtime und **sehr schneller Rollback** (zurückschalten) | **doppelte Ressourcen**, und alle Benutzer wechseln gleichzeitig. Eine gemeinsame Datenbank muss mit beiden Versionen funktionieren |
| **Canary** | Die neue Version erhält zuerst nur einen **kleinen Teil des Verkehrs** (z.B. 5 % der Benutzer). Das Team beobachtet das Monitoring. Ist alles gut, wird der Anteil **schrittweise** auf 100 % erhöht, sonst zurückgenommen. | ein Fehler trifft **nur wenige Benutzer**, Prüfung mit echtem Verkehr | **aufwendig:** braucht Verkehrssteuerung und gutes Monitoring, zwei Versionen laufen parallel |

Wichtiger Unterschied: Bei **Blue/Green** wird **alles auf einmal** zwischen zwei Umgebungen umgeschaltet. Bei **Canary** wird **schrittweise nach Anteil der Benutzer** ausgerollt.

**Was ist ein Feature Toggle, und was ist mit «Deployment und Release trennen» gemeint?**

Ein **Feature Toggle** (Feature Flag) ist ein **Schalter im Code**, mit dem eine Funktion zur Laufzeit ein- oder ausgeschaltet wird, **ohne neues Deployment**, z.B. über eine Konfiguration. Damit kann unfertiger Code schon in Produktion liegen, bleibt aber verborgen. Man kann eine Funktion auch zuerst nur für einzelne Benutzer einschalten oder sie im Notfall sofort ausschalten («Kill Switch»).

**Deployment und Release trennen:**

- **Deployment** ist ein **technischer** Vorgang: Eine neue Version wird auf Produktion installiert und gestartet.
- **Release** ist ein **fachlicher** Entscheid: Eine Funktion wird für die Benutzer freigeschaltet.

Ohne Toggle passiert beides gleichzeitig. Mit Toggle kann das Team jederzeit deployen (die neue Funktion ist ausgeschaltet) und die Funktion **später, gezielt und umkehrbar** freischalten, z.B. wenn der Kunde bereit ist. Das senkt das Risiko jedes Deployments.

Toggles werden nach der Einführung **wieder entfernt**, sonst sammeln sich alte Schalter und toter Code an (technische Schuld).

---

## [B4-K06] Rollback und Datenbankänderungen

**Was ist der Unterschied zwischen Rollback und Roll-forward?**

- **Rollback:** Man liefert die **vorherige, funktionierende Version** wieder aus (z.B. von `1.4.0` zurück auf `1.3.2`). Geht schnell, wenn das alte Artefakt unverändert in der Registry liegt.
- **Roll-forward:** Man behebt den Fehler und liefert eine **neue, korrigierte Version** aus (z.B. `1.4.1`). Sinnvoll, wenn der Fehler klein und schnell behebbar ist oder ein Rollback nicht möglich ist (z.B. wegen Datenbankänderungen). Setzt eine schnelle Pipeline voraus.

**Warum ist ein Rollback schwierig, wenn eine neue Version das Datenbankschema verändert hat?**

- Den **Code** kann man einfach austauschen, die **Datenbank** hat aber einen Zustand: Sie bleibt nach dem Rollback im neuen Schema.
- Die alte Version erwartet das **alte Schema**. Hat die neue Version z.B. die Spalte `plz` in `postleitzahl` umbenannt oder eine Spalte gelöscht, findet die alte Version ihre Daten nicht mehr und stürzt ab.
- Daten, die die neue Version bereits im neuen Format geschrieben hat, kann die alte Version nicht lesen. Wurde eine Spalte gelöscht, sind die **Daten weg**. Eine Rückwärts-Migration kann Daten verlieren.
- Code und Datenbank müssen darum so geändert werden, dass **alte und neue Version mit demselben Schema funktionieren**.

**Wie funktioniert das Prinzip «Expand and Contract»?**

«Expand and Contract» (auch «Parallel Change») teilt eine inkompatible Schemaänderung in **mehrere kompatible Schritte** auf. Beispiel: Die Spalte `plz` soll `postleitzahl` heissen.

1. **Expand (erweitern):** Die neue Spalte `postleitzahl` wird **zusätzlich** angelegt, die alte bleibt. Die neue Code-Version schreibt in beide Spalten und liest die neue. Alte und neue Version funktionieren beide, ein Rollback ist jederzeit möglich.
2. **Migrate (umstellen):** Die bestehenden Daten werden in die neue Spalte übertragen. Danach verwenden alle Teile nur noch die neue Spalte.
3. **Contract (zusammenziehen):** Erst wenn **keine** laufende Version die alte Spalte mehr braucht und kein Rollback dorthin mehr nötig ist, wird die alte Spalte `plz` entfernt.

Jeder Schritt ist ein eigenes, kleines Deployment, das man einzeln zurücknehmen kann.

---

## [B4-K07] Fall CrowdStrike

**1. Welche Deployment-Strategie hätte die Auswirkung am stärksten begrenzt?**

Ein **Canary-Release bzw. gestaffelter Rollout**: zuerst intern auf eigenen Rechnern, dann an eine kleine Kundengruppe, dabei das Monitoring beobachten (z.B. «Stürzen Rechner ab? Melden sie sich nach dem Update wieder?») und erst danach schrittweise an alle. Das Update hätte schon die ersten Rechner zum Absturz gebracht, der Rollout wäre gestoppt worden, und statt 8,5 Millionen wären nur wenige Rechner betroffen gewesen. Genau diese Staffelung hat CrowdStrike nach dem Vorfall angekündigt.

**2. Warum war ein Rollback besonders schwierig?**

- Die betroffenen Rechner **stürzten ab und starteten nicht mehr**. Damit lief auch die Software nicht mehr, die ein korrigiertes Update hätte empfangen können. Ein **automatischer** Rollback über den normalen Update-Weg war unmöglich.
- Die Geräte mussten **einzeln von Hand** repariert werden. Bei Millionen von Geräten dauerte das Tage.
- Da das Update **gleichzeitig an alle** ging, gab es keine unbetroffene Mehrheit und keine Möglichkeit, früh zu stoppen.

**3. Was zeigt der Fall über das Verhältnis von automatischen Tests und gestaffeltem Rollout?**

- Automatische Tests sind notwendig, aber **nie vollständig**: Hier hatte sogar der Prüfschritt (Validator) selbst einen Fehler. Tests sind auch nur Software.
- Ein gestaffelter Rollout ist ein **zweites, unabhängiges Sicherheitsnetz**. Er fängt Fehler ab, die die Tests übersehen, weil er unter echten Bedingungen prüft, aber mit kleiner Auswirkung.
- Die beiden **ersetzen sich nicht, sie ergänzen sich** (mehrere Schutzschichten). Und: Auch Inhalts- und Konfigurationsupdates sind Änderungen, die denselben Schutz brauchen wie Code.

**4. Sicherheits-Updates sofort an alle? Nennen Sie je ein Pro und ein Kontra.**

- **Pro:** Neue Bedrohungen verbreiten sich schnell. Je früher alle Rechner die neuen Erkennungsregeln haben, desto kürzer sind sie ungeschützt. Jede Verzögerung kann einen erfolgreichen Angriff ermöglichen.
- **Kontra:** Ein Fehler im Update trifft ebenfalls **alle gleichzeitig**, wie hier mit 8,5 Millionen abgestürzten Rechnern. Es gibt keine Chance, den Fehler bei wenigen Rechnern zu bemerken und zu stoppen.
- **Abwägung:** Schnell, aber gestaffelt ausliefern (z.B. innert weniger Stunden in mehreren Wellen mit Überwachung) und den Kunden Kontrolle über den Zeitpunkt geben.

---

## Quellen

- Martin Fowler: *ContinuousDelivery* (2013). https://martinfowler.com/bliki/ContinuousDelivery.html (Abgrenzung Continuous Delivery und Continuous Deployment)
- Adam Wiggins: *The Twelve-Factor App – III. Konfiguration* (deutsch). https://12factor.net/de/config (Konfiguration in Umgebungsvariablen, Trennung von Code)
- Adam Wiggins: *The Twelve-Factor App – X. Dev-Prod-Vergleichbarkeit* (deutsch). https://12factor.net/de/dev-prod-parity (Umgebungs-Parität)
- Martin Fowler: *BlueGreenDeployment* (2010). https://martinfowler.com/bliki/BlueGreenDeployment.html
- Danilo Sato: *CanaryRelease* (2014). https://martinfowler.com/bliki/CanaryRelease.html
- Pete Hodgson: *Feature Toggles (aka Feature Flags)* (2017). https://martinfowler.com/articles/feature-toggles.html
- Danilo Sato: *ParallelChange* (2014). https://martinfowler.com/bliki/ParallelChange.html (Expand and Contract)
- TBZ M324: Auftrag B4 inkl. Falltext CrowdStrike und Kriterienkatalog. https://gitlab.com/ch-tbz-it/Stud/m324/-/tree/nuy/Theorie
- **KI-Deklaration:** Die Abschnitte wurden mit Claude (Anthropic) entworfen. Kernaussagen (Continuous Delivery vs. Deployment, Konfiguration, Deployment-Strategien, Feature Toggles, Expand and Contract) wurden mit den oben genannten Quellen abgeglichen. Die Antworten zum Fall stützen sich nur auf den Falltext des Auftrags.
