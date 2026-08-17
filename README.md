# 📈 FinanzPortfolio CoPilot

> **Professioneller, datenschutzfreundlicher & hochleistungsfähiger Portfolio-Tracker & Finanzanalyst** auf Basis von React 19, TypeScript, Vite, Web Crypto API, PWA und Vitest.

---

## 📚 Inhaltsverzeichnis
1. [Über das Projekt](#-über-das-projekt)
2. [✨ Feature-Highlights & Hauptfunktionen](#-feature-highlights--hauptfunktionen)
3. [🚀 Schnellanleitung (Anleitung zur Nutzung)](#-schnellanleitung-anleitung-zur-nutzung)
4. [🌐 1-Klick Deployment & Hosting](#-1-klick-deployment--hosting)
5. [🛠️ Technologie-Stack & Architektur](#️-technologie-stack--architektur)
6. [⚖️ Steuer- & Finanzlogik (DACH-Region)](#️-steuer--und-finanzlogik-dach-region)
7. [🔒 Sicherheit & Daten-Tresor (AES-GCM 256)](#-sicherheit--daten-tresor-aes-gcm-256)
8. [🚦 Entwicklungs- & Testbefehle](#-entwicklungs--und-testbefehle)

---

## 💡 Über das Projekt

Der **FinanzPortfolio CoPilot** ist eine moderne, reine Client-Side Webapplikation (PWA) zur vollumfänglichen Analyse, Verfolgung und Optimierung von Wertpapier-, Immobilien-, Zins-, Krypto- und Derivate-Portfolios. 

### Warum FinanzPortfolio CoPilot?
- 🔒 **100% Datenschutz**: Keine Speicherung deiner Finanzdaten auf externen Servern. Alle Transaktionen bleiben ausschließlich lokal in deinem Browser.
- ⚡ **Web Crypto Tresor**: AES-GCM 256-Bit Verschlüsselung aller Depotdaten via Master-PIN.
- 📱 **Mobile First PWA**: 1-Klick-Installation auf iOS und Android inklusive Offline-Verfügbarkeit.
- 📈 **Profianalysen**: TTWRR, IRR, Sharpe Ratio, Max Drawdown, Alpha/Beta Benchmark-Engine, Monte-Carlo-Simulationen, ESG Audit, FIRE Entnahme-Studio und DRIP Reinvestitionsanalyse.

---

## ✨ Feature-Highlights & Hauptfunktionen

### 1. 📊 Dashboard & Performance-Analysen
- **Echtzeit-Kennzahlen**: Gesamtvermögen, Einstandswert, Absolute & Prozentuale Rendite, Cash-Bestand.
- **Interaktiver Zeitraum-Filter**: Dynamische Analyse im Chart (1M, 3M, 6M, 1Y, 3Y, 5Y, ALL).
- **Professionelle Renditemetriken**: TTWRR (zeitgewichtet), IRR (geldgewichtet), Sharpe Ratio & Volatilität.
- **Monatliche Performance-Matrix**: Historische Renditen pro Jahr und Monat im Heatmap-Stil.

### 2. 🏢 Immobilien & Cashflow-Tracker (`RealEstateTracker.tsx`)
- **Immobilien-Verwaltung**: Erfassung von Anschaffungskosten, aktuellem Marktwert, Darlehensrestschuld und Tilgungsraten.
- **Cashflow & Renditekennzahlen**: Berechnung von monatlichem Netto-Cashflow (nach Bankrate & Instandhaltung), Netto-Eigenkapital (Equity), Beleihungsauslauf (LTV) sowie Brutto- und Netto-Mietrenditen.

### 3. 🪜 Festgeld- & Tagesgeld-Zinstreppe (`DepositLadderWidget.tsx`)
- **Zinstreppen-Management**: Gestaffelte Festgelder, Tagesgelder und Sparbriefe mit Laufzeiten und Zinssätzen.
- **Fälligkeitskalender & Zinseszins**: Automatische Warnung bei bald ablaufenden Festgeldern und Berechnung des durchschnittlich gewichteten Zinssatzes.

### 4. 🔥 FIRE & Safe Withdrawal Rate Studio (`FireFreedomWidget.tsx`)
- **Entnahmestrategien**: Simulation von 4%-Regel (Trinity Study), Guyton-Klinger Guardrails (dynamische Kürzungen/Erhöhungen) und VPW (Variable Percentage Withdrawal).
- **Steuern & Krankenversicherung**: Realistische Kaufkraftprognose unter Berücksichtigung von Inflation, Abgeltungsteuer und monatlichen Krankenkassenbeiträgen.

### 5. ✨ DRIP Dividenden-Zinseszins-Simulation (`DripAnalysisWidget.tsx`)
- **Reinvestitions-Vergleich**: Interaktive Gegenüberstellung des Vermögenswachstums mit automatischer Dividenden-Reinvestition (DRIP) gegenüber Barauszahlung.

### 6. 🌐 Währungsrisiko- & FX-Exposure Matrix (`FxExposureWidget.tsx`)
- **Währungs-Aufteilung**: Aufschlüsselung des Portfolios nach EUR, USD, CHF, GBP etc. inklusive 10% FX-Stresstest.

### 7. ⚖️ Erweiterte DACH-Steuer-Engine & Verlusttöpfe (`TaxReportModal.tsx`)
- **Getrennte Verlusttöpfe**: Exakte Trennung nach § 20 Abs. 6 EStG in Aktien-Verlusttopf (nur mit Aktiengewinnen verrechenbar) und Sonstiger Verlusttopf.
- **Günstigerprüfung & Kirchensteuer**: Simulation der Steuerersparnis bei persönlichem Grenzsteuersatz < 25%.

### 8. 📄 Portfolio Performance (PP) Import & Export (`portfolioPerformanceImporter.ts`)
- **Volle PP-Kompatibilität**: Nahtloser CSV- und Datentransfer zwischen FinanzPortfolio und Portfolio Performance.

### 9. ⚡ Transaktions-Massenaktionen & Multi-Select (`Transactions.tsx`)
- Mehrere Transaktionen markieren und gleichzeitig per Batch-Action löschen oder verwalten.

### 10. 📑 Universeller PDF- & CSV-Abrechnungs-Parser & OCR Fallback (`ocrParser.ts`)
- Automatische Erkennung von Kauf-, Verkauf- und Dividendenbelegen von **Trade Republic**, **Scalable Capital**, **ING-DiBa**, **comdirect**, **DKB**, **Consorsbank**, **finanzen.net zero**, **Flatex**, **Smartbroker+**, **Revolut** und **eToro**.
- **OCR Scan-Erkennung**: Extraktion aus Bilddateien und gescannten Dokumenten via Canvas-Pipeline.

### 11. ☁️ Nextcloud & WebDAV Private Cloud Sync (`CloudSyncModal.tsx`)
- **Ende-zu-Ende verschlüsselte Synchronisation**: Sicheres automatisches Backup und Multi-Device-Sync auf deine private Nextcloud oder WebDAV-Server via AES-GCM 256-Bit Master-PIN.

### 12. 🎯 Automatische ISIN-Stammdaten & Sektor-Anreicherung (`isinMetadataService.ts`)
- **1-Klick ISIN Auto-Mapping**: Automatische Erkennung von Sektoren, Regionen, Asset-Klassen und ETF-Gesamtkostenquoten (TER) für Top globale ETFs und Bluechip-Aktien.

### 13. 🛒 Neobroker Sparplan- & Order-Assistent (`OrderAssistantModal.tsx`)
- **1-Klick Order-Vorlagen**: Erstellung von aggregierten Sparplan- und Kauflisten mit Copy-Paste-Schnellbuttons für Trade Republic, Scalable Capital, ING und Comdirect.

### 14. 📊 Multi-Asset Korrelations-Matrix & Diversifikations-Heatmap (`CorrelationMatrixWidget.tsx`)
- **Pearson-Korrelation ($r \in [-1, 1]$)**: Ermittlung paarweiser Korrelationen zwischen allen Beständen zur Erkennung von Klumpenrisiken und echter Portfolio-Diversifikation.

### 15. 👑 Dividenden-Sicherheits- & Aristokraten-Score (`DividendSafetyScoreWidget.tsx`)
- **Qualitäts-Rating**: Einstufung nach Payout Ratio, Dividendenwachstum und Jahren ohne Kürzung (Aristokraten &gt; 25J, Könige &gt; 50J, Contender).

### 16. 🪙 Krypto-Staking & DeFi Steuer-Tracker (`CryptoStakingTaxWidget.tsx`)
- **§ 22 Nr. 3 EStG Freigrenzen-Überwachung**: Automatische Erfassung von Staking-Rewards und Überprüfung der 256 € Freigrenze mit persönlicher Einkommensteuerprognose.

### 17. 📱 Air-Gapped Offline QR-Code Vault Transfer (`QrSyncModal.tsx`)
- **100% kontaktlose Datenübertragung**: Vollständig internetfreier Transfer des AES-GCM 256-Bit verschlüsselten Portfolios zwischen Geräten per animiertem QR-Code.

### 18. 🎯 Option Greeks (Delta & Theta) Tracker (`OptionIncomeTracker.tsx`)
- **Black-Scholes Bewertung**: Berechnung von Delta ($\Delta$) und täglichem Theta-Time-Decay ($\Theta$/Tag) für verkaufte Puts und Calls.

### 19. 📈 Dynamischer Sparplan-Simulator & Gehaltssprung-Rechner (`SavingsSimulator.tsx`)
- **Karriere- & Inflationsanpassung**: Simulation mit jährlicher Sparratenerhöhung (z.B. +2.5% bis +5% p.a.) im direkten Vergleich zum statischen Sparplan.

### 20. 📑 Offizieller Anlage KAP Steuererklärungs-Report (`TaxReportModal.tsx`)
- **WISO & Taxfix Export**: Exakte Aufschlüsselung aller Erträge und Verluste nach den offiziellen Zeilen der Anlage KAP (Zeile 7, 8, 14, 15, 16/17).

---

## 🛠️ Technologie-Stack & Architektur

| Schicht | Technologie |
|---|---|
| **Frontend Framework** | React 19, TypeScript 6.0 |
| **Build Tool & Bundler** | Vite 8.1 (mit Rollup Manual Chunk-Splitting) |
| **Mobile & PWA** | Web App Manifest, Service Worker Caching (`sw.js`) |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Line) |
| **Testing** | Vitest (27 Automatisierte Unit Tests), Testing Library React, JSDOM |
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

# 3. Automatisierte Vitest Unit-Tests ausführen (27 Tests)
npm run test

# 4. Code-Qualitätsprüfung ausführen
npm run lint

# 5. Produktions-Build erstellen
npm run build
```
