# 📈 FinanzPortfolio CoPilot

> **Professioneller, datenschutzfreundlicher & hochleistungsfähiger Portfolio-Tracker & Finanzanalyst** auf Basis von React 19, TypeScript, Vite, Web Crypto API, PWA und Vitest.

---

## 🌐 1-Klick Deployment & Hosting (Kostenlos)

Das **FinanzPortfolio CoPilot** ist als reine Client-Side PWA ohne Backend konzipiert und kann absolut kostenlos in wenigen Sekunden auf deiner bevorzugten Hosting-Plattform bereitgestellt werden:

### 1. Vercel Deployment (Empfohlen)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
- Repository mit Vercel verbinden.
- Vercel erkennt Vite automatisch.
- Die vorkonfigurierte `vercel.json` kümmert sich um das SPA-Routing.

### 2. Netlify Deployment
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)
- Repository auf Netlify verknüpfen.
- Die mitgelieferte `netlify.toml` steuert Build (`npm run build`) und Redirects.

### 3. GitHub Pages Deployment (Automatisierter Workflow)
- In deinen Repository-Einstellungen unter **Pages** die Quelle auf **GitHub Actions** stellen.
- Die mitgelieferte Workflow-Datei `.github/workflows/deploy.yml` führt automatisch Vitest-Tests aus, baut das Projekt und veröffentlicht es auf GitHub Pages bei jedem Push auf `main`.

---

## ✨ Feature-Highlights

### 1. 📊 Dashboard & Performance-Analysen
- **Echtzeit-Kennzahlen**: Gesamtvermögen, Einstandswert, Absolute & Prozentuale Rendite, Sparraten-Tracker.
- **Interaktiver Zeitraum-Filter**: Dynamische Betrachtung der historischen Entwicklung (1M, 3M, 6M, 1Y, 3Y, 5Y, ALL).
- **Rendite-Kennzahlen**:
  - **TTWRR** (Time-Weighted Rate of Return)
  - **IRR / MWRR** (Internal Rate of Return / Money-Weighted Rate of Return)
  - **Max Drawdown** (%) & **Sharpe Ratio** (Risikoadjustierte Rendite)
- **Monatliche Performance-Matrix**: Historische Renditen pro Jahr und Monat im Heatmap-Stil.

### 2. 💱 Multi-Währungsumrechnung (FX-Engine)
- Echtzeit-Währungsumrechnung zwischen **EUR, USD, CHF und GBP** unter Berücksichtigung tagesaktueller Devisenkurse (`fetchLiveExchangeRates`).

### 3. 📈 Benchmark-Vergleich & Alpha/Beta Engine (`BenchmarkComparison.tsx`)
- **Benchmark-Vergleichskurven**: Vergleiche dein Portfolio mit **MSCI World**, **S&P 500**, **DAX 40** und **Bitcoin**.
- **Alpha ($\alpha$)**: Misst deine echte Überrendite gegenüber dem Markt.
- **Beta ($\beta$)**: Misst die Volatilität / Schwankungsintensität deines Portfolios relativ zum Markt.

### 4. 🎯 Rebalancing-Auftragsplaner (`RebalancingOrderPlanner.tsx`)
- Berechnet für Einmalkäufe (z.B. 2.500 €) die exakt benötigten Kauf-Beträge und Stückzahlen je Asset, um deine Soll-Allokation mit minimalen Ordergebühren wiederherzustellen.

### 5. 📄 Universal CSV & Portfolio Performance (PP) Import/Export (`universalCsvImporter.ts`)
- **Portfolio Performance (PP) Kompatibilität**: Direkter Import & Export im standardisierten PP-CSV/JSON-Format.
- **Auto-Detection & Vorschau**: Automatische Formaterkennung für PP, Parqet, Trade Republic und generische Broker-CSVs.

### 6. 📑 Erweiterte PDF-Abrechnungs-Parser (`PdfParser.ts`)
- Dokumenten-Parsing für Trade Republic, Scalable Capital, ING-DiBa, comdirect, DKB, Consorsbank, finanzen.net zero sowie **Flatex**, **Smartbroker+**, **Revolut** und **eToro**.

### 7. ⚖️ Deutsche Steuerlogik (§ 20 & § 18 InvStG, EStG)
- **Vorabpauschale-Rechner**: Exakte Ermittlung des Basisertrags und der steuerpflichtigen Vorabpauschale gem. § 18 InvStG (Basiszins 2,29% + 30% Teilfreistellung).
- **FIFO-Prinzip**, **Krypto 1-Jahr Haltefrist (§ 23 EStG)** und **Anlage KAP Report (`TaxReportModal.tsx`)**.

### 8. 🔒 Web Crypto Master-PIN Tresor (`VaultUnlockModal.tsx` & `cryptoStorage.ts`)
- Lokale **AES-GCM 256-Bit** Verschlüsselung aller Depotdaten. Beim Anwendungsstart sperrt ein Master-PIN Unlock Screen unbefugte Zugriffe zuverlässig ab.

### 9. 🤖 KI-Depot-Check & Risikodiagnose (`PortfolioHealthAudit.tsx`)
- **Klumpenrisiko-Erkennung**: Automatische Warnung bei Positionen > 20% des Gesamtportfolios.
- **ETF-Überschneidungs-Check (Overlap-Analyzer)**: Identifiziert doppelte US-Tech-Gewichtungen.
- **Health Score (0 - 100)**: Ermittelt die Gesamtgesundheit des Depots auf einen Blick.

### 10. 🎲 Monte-Carlo-Simulation & Historische Stress-Tests (`StressTestModal.tsx`)
- **Monte-Carlo-Simulator (1.000 Pfade)**: Simulation künftiger Vermögensverläufe.
- **Historische Stress-Tests**: Simuliert Finanzkrise 2008, Dotcom 2000, Corona 2020 und Zinswende 2022.

---

## 🛠️ Technologie-Stack

| Schicht | Technologie |
|---|---|
| **Frontend Framework** | React 19, TypeScript 6.0 |
| **Build Tool & Bundler** | Vite 8.1 (mit Rollup Manual Chunk-Splitting) |
| **Mobile & PWA** | Web App Manifest, Service Worker Caching |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Line) |
| **Testing** | Vitest (13 Automatisierte Unit Tests), Testing Library React, JSDOM |
| **Code Quality** | TypeScript `tsc --noEmit` |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM 256-Bit) |
| **Deployment** | Vercel, Netlify, GitHub Actions CI/CD |

---

## 🚦 Entwicklungs- & Testbefehle

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungs-Server starten
npm run dev

# Automatisierte Vitest Unit-Tests ausführen (13 Tests)
npm run test

# Code-Qualitätsprüfung ausführen
npm run lint

# Produktions-Build erstellen (mit optimiertem Chunk-Splitting)
npm run build
```

