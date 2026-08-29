# 📈 FinanzPortfolio CoPilot

> **Professioneller, datenschutzfreundlicher & hochleistungsfähiger Portfolio-Tracker & Finanzanalyst** auf Basis von React 19, TypeScript, Vite, Web Crypto API, PWA und Vitest.

---

## 📚 Inhaltsverzeichnis
1. [Über das Projekt](#-über-das-projekt)
2. [✨ Feature-Highlights & Hauptfunktionen](#-feature-highlights--hauptfunktionen)
3. [🚀 Schnellanleitung (Anleitung zur Nutzung)](#-schnellanleitung-anleitung-zur-nutzung)
4. [⌨️ Shortcuts & Command Palette](#️-shortcuts--command-palette)
5. [🛠️ Technologie-Stack & Architektur](#️-technologie-stack--architektur)
6. [⚖️ Steuer- & Finanzlogik (DACH-Region)](#️-steuer--und-finanzlogik-dach-region)
7. [🔒 Sicherheit, Auto-Lock & Daten-Tresor (AES-GCM 256)](#-sicherheit-auto-lock--daten-tresor-aes-gcm-256)
8. [🚦 Entwicklungs- & Testbefehle](#-entwicklungs--und-testbefehle)

---

## 💡 Über das Projekt

Der **FinanzPortfolio CoPilot** ist eine moderne, reine Client-Side Webapplikation (PWA) zur vollumfänglichen Analyse, Verfolgung und Optimierung von Wertpapier-, Immobilien-, Zins-, Krypto- und Derivate-Portfolios. 

### Warum FinanzPortfolio CoPilot?
- 🔒 **100% Datenschutz**: Keine Speicherung deiner Finanzdaten auf externen Servern. Alle Transaktionen bleiben ausschließlich lokal in deinem Browser.
- ⚡ **Web Crypto Tresor & Auto-Lock**: AES-GCM 256-Bit Verschlüsselung aller Depotdaten via Master-PIN inklusive konfigurierbarem Inaktivitäts-Auto-Lock.
- 🔄 **Versionierte Snapshots**: Bis zu 5 automatische Wiederherstellungspunkte vor Massenimporten mit 1-Klick Rollback.
- ⌨️ **Spotlight Command Palette**: Schnelle Suche und Tastaturnavigation via `Strg + K`.
- 📱 **Mobile First PWA**: 1-Klick-Installation auf iOS und Android inklusive Offline-Verfügbarkeit.
- 📈 **Profianalysen**: TTWRR, IRR, Sharpe Ratio, Max Drawdown, Alpha/Beta Benchmark-Engine, Asynchrone 500-Pfade Monte-Carlo FIRE-Simulation, Dividenden-Wachstums-Radar und Drift-Toleranzband Rebalancing.

---

## ✨ Feature-Highlights & Hauptfunktionen

### 1. ⌨️ Globale Command Palette (`CommandPaletteModal.tsx` / `Strg + K`)
- **Spotlight-Schnellsuche**: Mit `Strg + K` (oder `Cmd + K` auf Mac) öffnet sich blitzschnell das Suchfenster.
- **Tastaturnavigation**: Schneller Wechsel zu jedem Modul (Dashboard, Aktivitäten, Zahltage, Immobilien, Optionen) und direktes Ausführen von Aktionen (PDF-Import, CSV-Import, Kurse aktualisieren, Dark Mode, Backup).

### 2. 🏷️ Bestände-Tagging & Tag-Studio (`Holdings.tsx`)
- **Strategie-Tags**: Klassifiziere Positionen flexibel mit Tags wie `#Core`, `#Satellite`, `#Dividende`, `#Tech`, `#Growth`, `#Value`, `#Krypto` oder eigenen Tags.
- **Filter-Toolbar**: 1-Klick Filterung im Investment-Tab nach Tags zur sofortigen Klumpenrisiko- und Allokationsprüfung.

### 3. 🔄 Versionierte Snapshots & 1-Klick Rollback (`SettingsModal.tsx`)
- **Automatischer Schutz**: Vor jedem PDF- oder CSV-Import und vor destruktiven Aktionen wird automatisch ein Snapshot gesichert.
- **Rollback Studio**: Anzeige der letzten 5 Stände mit Zeitstempel, Transaktionsanzahl und Gesamtwert sowie 1-Klick Wiederherstellung.

### 4. 🛡️ Web Crypto Auto-Lock Inaktivitäts-Timer (`PortfolioContext.tsx`)
- **Automatisches Sperren**: Konfigurierbarer Inaktivitäts-Timer (5, 15, 30, 60 Minuten oder Deaktiviert) sperrt den AES-256 Tresor automatisch bei Untätigkeit.

### 5. ⚖️ Rebalancing-Engine mit Drift-Toleranzbändern (`RebalancingOrderPlanner.tsx`)
- **Toleranzbänder ($\pm 1\%$ bis $\pm 5\%$):** Orders werden nur ausgelöst, wenn Positionen das definierte Band verlassen.
- **Kauf- & Cash-Inflow Modus:** Flexible Auswahl zwischen vollständigem Rebalancing (Kauf + Verkauf) oder reinem Zukauf mit neuem Spar- oder Cash-Zufluss.

### 6. 🎲 Probabilistisches FIRE & Asynchroner Monte-Carlo Runner (`FireFreedomWidget.tsx` & `monteCarloRunner.ts`)
- **Asynchrone Background-Berechnung:** Auslagerung von 500+ Zufallspfaden ohne UI-Blockaden.
- **Perzentil-Fächer:** Exakte Ausweisung von 90. Perzentil, Median (50.) und 10. Perzentil sowie der mathematischen Ruin-Wahrscheinlichkeit.

### 7. 📈 Dividenden-Wachstums-Radar & Aristokraten-Score (`DividendGrowthRadarWidget.tsx`)
- **YoY-Wachstumsraten:** Automatische Auswertung der historischen Ausschüttungssteigerungen pro Jahr.
- **3-, 5- und 10-Jahres Cashflow-Prognose:** Simulation des zukünftigen monatlichen und jährlichen passiven Einkommens.
- **Aristokraten-Scorecards:** Einstufung in Könige (50J+), Aristokraten (25J+) und Contender (10J+).

### 8. 📑 Anlage KAP & Anlage SO (§ 22/23 EStG) Steuererklärungs-Assistent (`TaxReportModal.tsx`)
- **1-Klick ELSTER / WISO / Taxfix Copy:** Formatierter Text-Export für direkte Zwischenablage-Übernahme in Steuerprogramme.
- **Anlage SO & Krypto-Freigrenze:** Vollständige Aufschlüsselung von Gewinnen innerhalb/außerhalb der 1-jährigen Spekulationsfrist und 1.000 € Freigrenze.

### 9. 📄 Institutionelles Fonds-Factsheet mit Markdown & CSV Export (`PdfFactsheetExporter.tsx`)
- **Druckfertiger A4 Monatsbericht:** 1-Klick-Export als druckbares PDF, strukturierter Markdown-Bericht oder CSV.

### 10. 🌐 Dynamischer Online-Lookup & Parqet / IBKR Importer (`universalCsvImporter.ts`)
- **Erweiterte Formate:** Direkte Unterstützung für **Portfolio Performance (PP) CSV**, **Parqet CSV & JSON**, **Interactive Brokers (IBKR Trades CSV)** und **Trade Republic CSV**.

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
| **Mobile & PWA** | Web App Manifest, Service Worker Caching (`sw.js`) |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Line) |
| **Testing** | Vitest (50 Automatisierte Unit Tests), Testing Library React, JSDOM |
| **Code Quality & Linting** | TypeScript `tsc --noEmit` |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM 256-Bit) |
| **Deployment** | Vercel, Netlify, GitHub Actions CI/CD |

---

## 🚦 Entwicklungs- & Testbefehle

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungs-Server starten
npm run dev

# 3. Automatisierte Vitest Unit-Tests ausführen (50 Tests)
npm run test

# 4. Code-Qualitätsprüfung ausführen
npm run lint

# 5. Produktions-Build erstellen
npm run build
```

---
