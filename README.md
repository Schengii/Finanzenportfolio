# 📈 FinanzPortfolio CoPilot

> **Professioneller, datenschutzfreundlicher & hochleistungsfähiger Portfolio-Tracker & Finanzanalyst** auf Basis von React 19, TypeScript, Vite, Web Crypto API, PWA und Vitest.

---

## 📚 Inhaltsverzeichnis
1. [Über das Projekt](#-über-das-projekt)
2. [✨ Feature-Highlights & Hauptfunktionen](#-feature-highlights--hauptfunktionen)
3. [⚖️ Steuer- & Finanzlogik (DACH-Region: DE, AT, CH)](#️-steuer--und-finanzlogik-dach-region-de-at-ch)
4. [⌨️ Shortcuts & Command Palette](#️-shortcuts--command-palette)
5. [🛠️ Technologie-Stack & Architektur](#️-technologie-stack--architektur)
6. [🔒 Sicherheit, Auto-Lock & Daten-Tresor (AES-GCM 256)](#-sicherheit-auto-lock--daten-tresor-aes-gcm-256)
7. [🚦 Entwicklungs- & Testbefehle](#-entwicklungs--und-testbefehle)

---

## 💡 Über das Projekt

Der **FinanzPortfolio CoPilot** ist eine moderne, datenschutzorientierte Client-Side Webapplikation (PWA) zur vollumfänglichen Analyse, Verfolgung und Optimierung von Wertpapier-, Immobilien-, Zins-, Krypto- und Derivate-Portfolios. 

### Warum FinanzPortfolio CoPilot?
- 🔒 **100% Datenschutz**: Keine Speicherung deiner Finanzdaten auf fremden Servern. Alle Transaktionen bleiben ausschließlich lokal in deinem Browser.
- ⚡ **Web Crypto Tresor & Auto-Lock**: AES-GCM 256-Bit Verschlüsselung aller Depotdaten via Master-PIN inklusive Inaktivitäts-Auto-Lock, PIN-Änderung und Entschlüsselungsfunktion.
- 🔄 **Versionierte Snapshots**: Bis zu 5 automatische Wiederherstellungspunkte vor Massenimporten mit 1-Klick Rollback.
- 🌐 **Automatisierter Webhook Push**: Verschlüsselte Tresor-Sicherungen per 1-Klick oder automatisch an private Automation-Server (n8n, Home Assistant).
- ⌨️ **Spotlight Command Palette**: Schnelle Suche und Tastaturnavigation via `Strg + K`.
- 📱 **Mobile First PWA**: 1-Klick-Installation auf iOS und Android mit resilientem Stale-While-Revalidate Offline-Cache.
- 📈 **Profianalysen**: TTWRR, IRR, dynamische Sharpe Ratio, echter Max Drawdown aus Transaktionshistorie, Fama-French 5-Faktor Zerlegung, Monte-Carlo FIRE-Simulation, Quellensteuer-Rückerstattung und Options-Prämienrenditen.

---

## ✨ Feature-Highlights & Hauptfunktionen

### 1. ⚖️ DACH-Steueroptimierung (`TaxReportModal.tsx` & `SettingsModal.tsx`)
- **🇩🇪 Deutschland**: Abgeltungsteuer (26,375% inkl. Soli), Kirchensteuer, Sparer-Pauschbetrag (1.000 € / 2.000 € konfigurierbar), Vorabpauschale (§ 18 InvStG) basierend auf echten Beständen, Aktien- vs. Sonstiger Verlusttopf sowie Günstigerprüfung.
- **🇦🇹 Österreich**: Automatische Berechnung der Kapitalertragsteuer (**27,5% KESt flat**) auf Realisationsgewinne und Dividenden, OeKB-Meldefonds-Hinweise und Regelbesteuerungsoption (E1kv).
- **🇨🇭 Schweiz**: Private Kapitalgewinne auf Wertschriften sind **100% steuerfrei**! Getrennte Ausweisung der ordentlich steuerbaren Dividenden- & Zinserträge sowie Verrechnungssteuer-Anrechnung (35% VSt) im Wertschriftenverzeichnis.

### 2. ⚡ Werkzeuge & Assistenten Hub (`App.tsx`)
- **Aufgeräumte Navbar**: Statt überladener Einzelsymbole bündelt das neue "⚡ Werkzeuge"-Dropdown alle Spezialfunktionen strukturiert in drei Kategorien:
  - *📊 Analyse & Berichte:* Dual Portfolio-Vergleich, Institutionelles Factsheet (PDF), Monte Carlo Stresstests, PDF-Monatsbericht.
  - *📑 Steuern & DACH:* Steuer- & Verlusttöpfe Report, Tax Loss Harvesting & Freibetrag, Ausländische Quellensteuer-Rückerstattung, Krypto FiFo Radar.
  - *📥 Daten & Cloud:* Universal CSV Importer, Stapel PDF Upload, Neobroker Order-Assistent, Nextcloud / WebDAV Sync, Offline QR-Code Transfer.

### 3. 🛡️ Gesetzliche Einlagensicherung in der Zinstreppe (`DepositLadderWidget.tsx`)
- **Klumpenrisiko-Frühwarnung**: Warnt sofort auffällig, sobald das aggregierte Anlagevolumen bei einem einzelnen Bankinstitut die gesetzliche Einlagensicherung von **100.000 €** übersteigt.
- **Vollständige Bearbeitbarkeit**: In-Place Bearbeitung von Festgeldern, Tagesgeldern und Sparbriefen inklusive Fälligkeitskalender.

### 4. 🏢 Immobilien & Cashflow-Tracker (`RealEstateTracker.tsx`)
- **Vollständige Objektdaten**: Verwaltung von Kaufpreis, aktuellem Marktwert, Darlehensrestschuld, Sollzins, Kaltmiete, monatlicher Bankrate und Bewirtschaftungskosten/Hausgeld.
- **KPIs & Renditen**: Brutto- und Netto-Mietrendite, Beleihungsquote (LTV), Netto-Eigenkapital (Equity) und monatlicher Netto-Cashflow nach Kosten.
- **In-Place Bearbeitung**: Editier-Modal zur direkten Anpassung existierender Immobilien.

### 5. ⚡ Sparplan-Sofortausführung (`SavingsSimulator.tsx`)
- **1-Klick Ausführung**: Mit dem Button "⚡ Jetzt ausführen" werden alle aktiven Sparpläne sofort als reale Kaufbuchungen zum aktuellen Datum und Kurs in die Transaktionshistorie eingebucht.

### 6. 📊 Interaktive Tabellen-Sortierung & CSV-Export (`Holdings.tsx` & `Transactions.tsx`)
- **Flexible Sortierung**: 1-Klick Sortierung auf allen Spalten (Asset, Kategorie, Anteile, Kaufkurs, aktueller Kurs, Depotwert, Gewinn/Verlust, Portfoliogewichtung) auf- und absteigend.
- **1-Klick CSV Export**: Direkter Export der aktuellen Depotbestände und gefilterten Aktivitäten als formatierte CSV-Datei für Excel oder Steuersoftware.
- **Transaktionen bearbeiten**: Transaktionen können direkt in der Tabelle über das Bearbeiten-Symbol editiert werden.

### 7. 🎯 Echte Options-Prämienrendite & Greeks (`OptionIncomeTracker.tsx`)
- **Annualisierte Rendite**: Dynamische Berechnung der tatsächlichen annualisierten Rendite p.a. bezogen auf das gebundene Cash-Kollateral statt statischer Schätzwerte.
- **Delta-Hedging**: Portfolio-Delta-Aggregation und Absicherungsempfehlungen für Tail-Risk (Protective Puts).

### 8. 🏛️ Ausländische Quellensteuer-Rückerstattung (`WithholdingTaxRefundModal.tsx`)
- **Schweiz, Frankreich, Österreich & USA:** Automatische Berechnung rückforderbarer Quellensteuern (z. B. Schweiz 20% via ESTV Form 82 I / Tax Voucher, Frankreich 10% via Form 5000/5001, Österreich 12,5% via ZS-RD1).
- **Vollständig integriert:** Auch direkt über die Command Palette (`Strg + K` -> "Quellensteuer") erreichbar.

### 9. 🧬 Fama-French 5-Faktoren Risiko-Zerlegung (`FactorExposureWidget.tsx`)
- **Multi-Faktor Screening:** Quantifizierung von Marktrisiko (Beta $\beta$), Size-Prämie ($\text{SMB}$), Value/Growth-Tilt ($\text{HML}$), Profitabilitäts-Güte ($\text{RMW}$) und Investitions-Verhalten ($\text{CMA}$).

### 10. 🔒 Master-PIN Management & Web Crypto Tresor (`SettingsModal.tsx`)
- **PIN ändern & Tresor deaktivieren**: Sichere Änderung der Master-PIN unter Verifikation der alten PIN und Option zur dauerhaften Deaktivierung der Verschlüsselung.
- **Automatischer Inaktivitäts-Timer**: Automatisches Sperren nach 5, 15, 30 oder 60 Minuten.

---

## ⚖️ Steuer- und Finanzlogik (DACH-Region: DE, AT, CH)

| Land | Steuersatz auf Kursgewinne | Dividenden / Zinsen | Freibetrag | Besonderheiten |
|---|---|---|---|---|
| **🇩🇪 Deutschland** | 26,375% (inkl. Soli) | 26,375% (inkl. Soli) | 1.000 € (Single) / 2.000 € (Verheiratet) | Getrennte Verlusttöpfe (Aktien vs. Sonstige), Günstigerprüfung, Vorabpauschale (§ 18 InvStG), Krypto nach 1 Jahr steuerfrei (§ 23 EStG) |
| **🇦🇹 Österreich** | 27,5% (KESt flat) | 27,5% (KESt flat) | Keiner | Endbesteuerungswirkung, OeKB-Meldefonds für ausschüttungsgleiche Erträge (AgE), Regelbesteuerungsoption via E1kv |
| **🇨🇭 Schweiz** | **0% (Steuerfrei)** | Ordentlicher Einkommensteuersatz (~20% Ø) | Keiner | Private Kapitalgewinne steuerfrei, 35% Eidg. Verrechnungssteuer (VSt) wird bei Deklaration im Wertschriftenverzeichnis voll rückerstattet, kantonale Vermögenssteuer auf Gesamtvermögen |

---

## ⌨️ Shortcuts & Command Palette

| Tastenkombination | Aktion |
|---|---|
| <kbd>Strg</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | Spotlight Command Palette öffnen |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Befehl / Asset auswählen |
| <kbd>Enter</kbd> | Ausgewählte Aktion ausführen |
| <kbd>Esc</kbd> | Modal oder Suchfenster schließen |

---

## 🛠️ Technologie-Stack & Architektur

| Schicht | Technologie |
|---|---|
| **Frontend Framework** | React 19, TypeScript 6.0 |
| **Build Tool & Bundler** | Vite 8.1 (mit Rollup Manual Chunk-Splitting) |
| **Mobile & PWA** | Web App Manifest, Service Worker Caching (`sw.js`) mit Stale-While-Revalidate |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Line) |
| **Testing** | Vitest, Testing Library React, JSDOM |
| **Code Quality & Linting** | TypeScript `tsc --noEmit` |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM 256-Bit) |
| **Deployment** | Vercel, Netlify, GitHub Pages, Cloudflare Pages |

---

## 🚦 Entwicklungs- & Testbefehle

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungs-Server starten
npm run dev

# 3. Automatisierte Vitest Unit-Tests ausführen
npm run test

# 4. Code-Qualitätsprüfung ausführen
npm run lint

# 5. Produktions-Build erstellen
npm run build
```

---

*Erstellt mit ❤️ für maximale finanzielle Unabhängigkeit, Transparenz und kompromisslosen Datenschutz.*
