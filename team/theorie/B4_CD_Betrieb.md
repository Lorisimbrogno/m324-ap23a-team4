# B4 Continuous Delivery, Umgebungen und Deployment

**Autor:** Karol  
**Reviewer:** Marvin Kropf  
**Status:** In Review  

---

## [B4-K01] Continuous Delivery und Continuous Deployment

- **Unterschied:** Bei beiden wird jede Änderung, die die Pipeline besteht, automatisch gebaut, getestet und bis auf Staging gebracht. Bei **Continuous Delivery** ist jede Änderung jederzeit auslieferbar, der Schritt nach Produktion ist aber eine **manuelle Freigabe** (ein Klick). Bei **Continuous Deployment** geht jede grüne Änderung **automatisch, ohne menschliche Freigabe** in Produktion.

```
Continuous Delivery:   Build → Test → Staging → [Mensch gibt frei] → Produktion
Continuous Deployment: Build → Test → Staging → Produktion (automatisch)
```

- **Voraussetzungen für Continuous Deployment:** Weil die letzte menschliche Kontrolle wegfällt, müssen andere Mechanismen sie ersetzen:
  - **zuverlässige, umfassende automatische Tests**, denn sie sind die einzige Kontrolle vor Produktion
  - **gelebte CI** mit kleinen, häufigen Änderungen, damit Fehler klein und schnell zuzuordnen sind
  - **vollautomatisches Deployment** ohne Handarbeit
  - **Monitoring und Alarme**, damit Fehler in Produktion in Minuten erkannt werden
  - **schneller Rollback** sowie Feature Toggles und Canary, damit ein Fehler wenig Schaden anrichtet

---

## [B4-K02] Umgebungen und «Build once, deploy many»

| Umgebung | Wozu |
|---|---|
| **Dev** | entwickeln und schnell ausprobieren, meist lokal |
| **Test** | automatische und manuelle Tests, Integration mit anderen Services |
| **Staging** | Generalprobe: möglichst identisch mit Produktion, letzte Prüfung (Smoke Test, Abnahme) |
| **Produktion** | echte Benutzer mit echten Daten |

- **Umgebungs-Parität:** Die Umgebungen sind sich so ähnlich wie möglich: gleiche Laufzeit- und Datenbankversionen, gleicher Konfigurationsaufbau, gleicher Deployment-Ablauf. Nur dann sagt ein Test auf Staging etwas über Produktion aus. Sonst zeigen sich Fehler erst in Produktion («auf Staging lief es doch»).
- **Build once, deploy many:** Das Artefakt (z.B. `ms1:1.4.0`) wird **einmal** gebaut und dann **unverändert** auf Test, Staging und Produktion ausgeliefert. Nur die Konfiguration unterscheidet sich. Wichtig, weil so genau das in Produktion läuft, was getestet wurde. Ein neuer Build pro Umgebung könnte ein anderes Ergebnis liefern (andere Abhängigkeitsversionen).

---

## [B4-K03] Infrastructure as Code und Konfiguration

- **Infrastructure as Code (IaC):** Die Infrastruktur (Server, Container, Netzwerke, Datenbanken) ist in **Dateien im Repository beschrieben** und wird von einem Werkzeug automatisch eingerichtet. Beispiele: Docker Compose, Terraform, Ansible.
  **Vorteile gegenüber Handarbeit:** reproduzierbar (jedes Mal dieselbe Umgebung), versioniert und reviewbar (Commits, Merge Requests, Rückgängigmachen), selbstdokumentierend, und es entstehen keine «Snowflake»-Server, die mit der Zeit alle ein bisschen anders sind.
- **Konfiguration von aussen:** Werte, die sich pro Umgebung unterscheiden (z.B. `DB_URL`, `MS1_URL`), werden beim Start übergeben, typischerweise als **Umgebungsvariablen**. Nur so läuft dasselbe Artefakt überall (build once, deploy many). Eine Änderung braucht keinen neuen Build, und Secrets bleiben aus dem Code (Twelve-Factor-Prinzip).

---

## [B4-K04] Secrets

- **Secrets** sind vertrauliche Daten, die Zugriff gewähren: Passwörter, API-Keys, Tokens, private Schlüssel.
  - **Nicht ins Repository** (auch keine committete `.env`), weil alle mit Lesezugriff sie sehen und sie für immer in der Git-History bleiben.
  - **Nicht ins Container-Image**, weil jede Person, die das Image holt, die Schichten und Variablen auslesen kann.
  - **Gehören in** CI/CD-Variablen (z.B. GitHub Actions Secrets) oder einen Secret Manager (z.B. Vault) und werden erst zur Laufzeit übergeben.
- **Löschen reicht nicht:** Git bewahrt die ganze History auf, im alten Commit ist das Passwort weiter lesbar. Dazu gibt es Kopien in Klonen, Forks und CI-Logs. Das Secret gilt als kompromittiert und muss **sofort ungültig gemacht und ersetzt** werden.
- **Rotation:** Secrets regelmässig und nach jedem Verdacht durch neue ersetzen, damit ein gestohlenes Secret nur kurz nutzbar ist.
- **Least Privilege:** Jede Person, jeder Service und jeder Token bekommt nur die minimal nötigen Rechte. Beispiel: Der DB-Benutzer von MS1 darf nur auf die Datenbank von MS1 zugreifen. Ein gestohlenes Secret richtet so weniger Schaden an.

---

## [B4-K05] Deployment-Strategien und Feature Toggles

| Strategie | Funktionsweise | Vorteil | Nachteil |
|---|---|---|---|
| **Recreate** | alte Version stoppen, dann neue starten | einfach | Ausfallzeit (Downtime) |
| **Rolling** | Instanzen nacheinander ersetzen | keine Downtime, keine Zusatz-Infrastruktur | beide Versionen laufen parallel, Rollback langsam |
| **Blue/Green** | zwei identische Umgebungen, neue Version auf «Green» prüfen, dann den gesamten Verkehr **auf einmal** umschalten | sehr schneller Rollback (zurückschalten) | doppelte Ressourcen |
| **Canary** | neue Version zuerst für einen **kleinen Teil** der Benutzer (z.B. 5 %), bei gutem Monitoring **schrittweise** auf 100 % | ein Fehler trifft nur wenige Benutzer | aufwendig (Verkehrssteuerung, Monitoring nötig) |

- **Feature Toggle:** ein Schalter im Code, mit dem eine Funktion zur Laufzeit **ohne neues Deployment** ein- oder ausgeschaltet wird.
- **Deployment und Release trennen:** Deployment = neue Version technisch auf Produktion installieren. Release = Funktion für Benutzer freischalten. Mit Toggles kann jederzeit deployt werden (Funktion aus) und die Funktion später gezielt und umkehrbar freigeschaltet werden. Toggles werden danach wieder entfernt.

---

## [B4-K06] Rollback und Datenbankänderungen

- **Rollback:** die vorherige, funktionierende Version erneut ausliefern (`1.4.0` → `1.3.2`). **Roll-forward:** den Fehler beheben und eine neue Version ausliefern (`1.4.1`).
- **Rollback nach Schemaänderung ist schwierig:** Der Code lässt sich austauschen, die Datenbank bleibt aber im neuen Zustand. Hat die neue Version z.B. die Spalte `plz` in `postleitzahl` umbenannt oder eine Spalte gelöscht, findet die alte Version ihre Daten nicht mehr. Gelöschte Daten sind weg.
- **Expand and Contract:** eine inkompatible Änderung in kompatible Schritte aufteilen:
  1. **Expand:** neue Spalte `postleitzahl` **zusätzlich** anlegen, der Code schreibt in beide. Alte und neue Version funktionieren.
  2. **Migrate:** bestehende Daten übertragen, alles liest nur noch die neue Spalte.
  3. **Contract:** erst wenn keine Version die alte Spalte mehr braucht, wird `plz` entfernt.

  Jeder Schritt ist einzeln deploybar und einzeln zurücknehmbar.

---

## [B4-K07] Fall CrowdStrike

1. **Beste Strategie:** ein **Canary-Release bzw. gestaffelter Rollout**: zuerst intern, dann an eine kleine Kundengruppe, mit Monitoring. Die ersten Abstürze hätten den Rollout gestoppt, statt 8,5 Millionen wären nur wenige Rechner betroffen gewesen.
2. **Rollback schwierig:** Die Rechner starteten nicht mehr, darum konnte auch kein automatisches Update den Fehler beheben. Jedes Gerät musste **von Hand** repariert werden. Da das Update gleichzeitig an alle ging, gab es keine Chance, früh zu stoppen.
3. **Tests und gestaffelter Rollout:** Automatische Tests sind nötig, aber nie vollständig, hier hatte sogar der Validator selbst einen Fehler. Ein gestaffelter Rollout ist ein **zweites Sicherheitsnetz** unter echten Bedingungen. Beide ergänzen sich, keines ersetzt das andere.
4. **Sicherheits-Updates sofort an alle?**
   - **Pro:** Neue Bedrohungen verbreiten sich schnell. Je früher alle geschützt sind, desto besser.
   - **Kontra:** Ein Fehler im Update trifft ebenfalls alle gleichzeitig, wie hier.
   - **Kompromiss:** schnell, aber gestaffelt in kurzen Wellen mit Überwachung.

---

## Quellen

- Martin Fowler: *ContinuousDelivery* (2013). https://martinfowler.com/bliki/ContinuousDelivery.html
- Adam Wiggins: *The Twelve-Factor App – III. Konfiguration* (deutsch). https://12factor.net/de/config
- Adam Wiggins: *The Twelve-Factor App – X. Dev-Prod-Vergleichbarkeit* (deutsch). https://12factor.net/de/dev-prod-parity
- Martin Fowler: *BlueGreenDeployment* (2010). https://martinfowler.com/bliki/BlueGreenDeployment.html
- Danilo Sato: *CanaryRelease* (2014). https://martinfowler.com/bliki/CanaryRelease.html
- Pete Hodgson: *Feature Toggles (aka Feature Flags)* (2017). https://martinfowler.com/articles/feature-toggles.html
- Danilo Sato: *ParallelChange* (2014). https://martinfowler.com/bliki/ParallelChange.html
- TBZ M324: Auftrag B4 inkl. Falltext und Kriterienkatalog. https://gitlab.com/ch-tbz-it/Stud/m324/-/tree/nuy/Theorie
- **KI-Deklaration:** Entwurf mit Claude (Anthropic). Kernaussagen wurden mit den obigen Quellen abgeglichen. Der Fall stützt sich nur auf den Falltext des Auftrags.
