# 📈 FinanzPortfolio CoPilot

> **Professioneller, datenschutzfreundlicher & hochleistungsfähiger Portfolio-Tracker & Finanzanalyst** auf Basis von React 19, TypeScript, Vite, Web Crypto API und Vitest.

---

## ✨ Feature-Highlights

### 1. 📊 Dashboard & Performance-Analysen
- **Echtzeit-Kennzahlen**: Gesamtvermögen, Einstandswert, Absolute & Prozentuale Rendite, Sparraten-Tracker.
- **Rendite-Kennzahlen**:
  - **TTWRR** (Time-Weighted Rate of Return)
  - **IRR / MWRR** (Internal Rate of Return / Money-Weighted Rate of Return)
  - **Max Drawdown** (%) & **Sharpe Ratio** (Risikoadjustierte Rendite)
- **Monatliche Performance-Matrix**: Historische Renditen pro Jahr und Monat im Hitmap-Stil.

### 2. 🤖 KI-Depot-Check & Risikodiagnose (`PortfolioHealthAudit.tsx`)
- **Klumpenrisiko-Erkennung**: Automatische Warnung bei Positionen > 20% des Gesamtportfolios.
- **ETF-Überschneidungs-Check (Overlap-Analyzer)**: Identifiziert doppelte US-Tech-Gewichtungen (z.B. MSCI World + S&P 500).
- **Gebühren-Check**: Errechnet die durch Orderentgelte aufgelaufenen Kosten.
- **Health Score (0 - 100)**: Ermittelt die Gesamtgesundheit des Depots auf einen Blick.

### 3. 🗺️ Portfolio Treemap / Heatmap (`PortfolioHeatmap.tsx`)
- Proportionale Rechteck-Visualisierung aller Assets.
- Kachelgröße = Depotgewichtung (%).
- Farbschema = Kursgewinn/Verlust (Smaragdgrün für Gewinne, Karminrot für Verluste).
- Klick auf eine Kachel öffnet die tranchengenaue **Holding-Detailansicht**.

### 4. 🎲 Monte-Carlo-Simulation & Historische Stress-Tests (`StressTestModal.tsx`)
- **Monte-Carlo-Simulator (1.000 Pfade)**: Simulation künftiger Vermögensverläufe unter Berücksichtigung von Volatilität und Sparrate. Berechnet das 10. Perzentil (pessimistisch), 50. Perzentil (Median) und 90. Perzentil (optimistisch).
- **Historische Stress-Tests**: Simuliert Auswirkungen bekannter Krisen auf den aktuellen Depotwert:
  - *Finanzkrise 2008 (-45,5%)*
  - *Dotcom-Blase 2000 (-55,0%)*
  - *Corona-Crash 2020 (-33,9%)*
  - *Zinswende & Bärenmarkt 2022 (-24,8%)*

### 5. 🌊 Performance-Attribution & DRIP Zinseszins (`PerformanceAttribution.tsx`)
- **Wasserfall-Rendite-Zerlegung**: Zerlegt den Ertrag exakt in **Einzahlungen**, **Kursgewinne**, **Dividenden**, **Währungseinfluss (FX)**, **Ordergebühren** und **Steuern**.
- **DRIP Zinseszins-Prognose**: Vergleicht die Zukunfts-Wertentwicklung mit und ohne automatische Reinvestition von Dividenden (Dividend Reinvestment Plan).

### 6. 🎯 Soll- vs. Ist-Allokation Radar-Chart (`AllocationRadarChart.tsx`)
- Netzdiagramm (Spider Chart) zur Gegenüberstellung deiner Wunsch-Branchengewichtung (Technology, Financials, Healthcare etc.) mit dem Ist-Zustand.

### 7. 🌴 FIRE & Dividenden-Freiheitsrechner (`FireFreedomWidget.tsx`)
- Berechnet die erforderliche **FIRE-Zielsumme** (nach der 4%-Entnahmeregel).
- Erfasst den Abdeckungsgrad deiner monatlichen Lebenshaltungskosten (Wocheneinkauf, Miete, Fixkosten) durch passive Dividenden.

### 8. 🌐 Gesamtvermögens-Übersicht (Net Worth Dashboard) (`NetWorthDashboard.tsx`)
- Kumuliert alle Aktien/ETF/Krypto-Portfolios mit externen Sachwerten (Tagesgeld, Notgroschen, Immobilien) und zieht Verbindlichkeiten (Kredite) ab.

### 9. ⚖️ Deutsche Steuerlogik (§ 20 & § 18 InvStG, EStG)
- **FIFO-Prinzip (First-In, First-Out)** bei Teilverkäufen.
- **Teilfreistellung (§ 20 InvStG)**: 30% Steuerfreistellung auf Gewinne und Dividenden von Aktien-ETFs.
- **Vorabpauschale (§ 18 InvStG)**: Schätzung der jährlichen Vorabpauschale basierend auf dem Basiszins der Bundesbank.
- **Krypto 1-Jahr Haltefrist (§ 23 EStG)**: Automatischer Tracker für steuerfreie Krypto-Bestände nach 365 Tagen.
- **Druckfertige Steuerbescheinigung (`TaxReportModal.tsx`)**: Aufbereitung aller relevanten Daten für Anlage KAP / KAP-INV.

### 10. 🏦 Multi-Broker Tagging & Universal CSV/PDF Import
- Transaktions-Tagging nach Brokern (`Trade Republic`, `Scalable Capital`, `ING`, `Comdirect`, `Consorsbank`, `Finanzen.net ZERO`, `Bitpanda`).
- **Universal CSV Importer (`universalCsvImporter.ts`)**: Auto-Erkennung von Exporte aus Portfolio Performance, Parqet, Scalable, Trade Republic und CoinTracking.
- **Batch PDF Importer (`BatchPdfUploadModal.tsx`)**: Drag & Drop Zone für mehrere PDF-Bankabrechnungen gleichzeitig.

### 11. 🔒 Web Crypto API Tresor & Sicherheit (`cryptoStorage.ts`)
- Lokale AES-GCM 256-Bit Verschlüsselung deiner Portfoliodaten via Master-PIN / Passwort.

---

## 🛠️ Technologie-Stack

| Schicht | Technologie |
|---|---|
| **Frontend Framework** | React 19, TypeScript |
| **Build Tool & Bundler** | Vite 8.1 |
| **Styling & Components** | Vanilla CSS, Lucide Icons, Tailwind-Utilities |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Treemap) |
| **Testing** | Vitest, Testing Library React, JSDOM |
| **Linting & Code Quality** | Oxlint |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM) |

---

## 🚦 Entwicklungs- & Testbefehle

### Repository klonen und Abhängigkeiten installieren
```bash
npm install
```

### Entwicklungs-Server starten
```bash
npm run dev
```

### Automatisierte Vitest Unit-Tests ausführen
```bash
npm run test
```

### Code-Linter (Oxlint) ausführen
```bash
npm run lint
```

### Produktions-Build erstellen
```bash
npm run build
```

---

## 📁 Projekt-Struktur

```
Finanzenportfolio/
├── src/
│   ├── components/
│   │   ├── AchievementBadges.tsx       # Gamification & Badges
│   │   ├── AllocationRadarChart.tsx    # Soll- vs. Ist-Radar-Chart
│   │   ├── BatchPdfUploadModal.tsx     # Stapel-PDF Import
│   │   ├── CsvImportModal.tsx          # Universal CSV Import
│   │   ├── Dashboard.tsx               # Haupt-Dashboard
│   │   ├── DividendCalendar.tsx        # Dividenden-Kalender & Forecast
│   │   ├── FireFreedomWidget.tsx       # FIRE & Dividenden-Freiheitsrechner
│   │   ├── HoldingDetailModal.tsx      # Detail-Drawer & FX-Zerlegung
│   │   ├── Holdings.tsx                # Bestandsübersicht & Filter
│   │   ├── NetWorthDashboard.tsx       # Gesamtvermögens-Übersicht
│   │   ├── PerformanceAttribution.tsx  # Wasserfall-Chart & DRIP Zinseszins
│   │   ├── PdfParser.ts                # PDF Parser Engine
│   │   ├── performanceUtils.ts         # Finanzmathematik & Steuer-Engine
│   │   ├── PortfolioHealthAudit.tsx    # KI-Depot-Check & Risikodiagnose
│   │   ├── PortfolioHeatmap.tsx        # Treemap / Heatmap Visualisierung
│   │   ├── SavingsSimulator.tsx        # Sparplan-Rechner
│   │   ├── SettingsModal.tsx           # Einstellungen & Master-PIN Tresor
│   │   ├── Strategy.tsx                # Rebalancing & Soll-Allokation
│   │   ├── StressTestModal.tsx         # Monte Carlo & Krisen-Simulations-Modal
│   │   ├── TaxReportModal.tsx          # Druckfertige Steuerbescheinigung
│   │   ├── Transactions.tsx            # Transaktions-Tabelle & Buchung
│   │   ├── Watchlist.tsx               # Beobachtungsliste & QuickBuy
│   │   └── __tests__/
│   │       └── performanceUtils.test.ts # Automated Vitest Suite (11 Tests)
│   ├── context/
│   │   └── PortfolioContext.tsx        # Globaler State & Broker-Filter
│   ├── services/
│   │   ├── cryptoStorage.ts            # AES-GCM Web Crypto API Wrapper
│   │   ├── marketDataApi.ts            # CoinGecko, EZB & Yahoo Live API
│   │   └── universalCsvImporter.ts     # Universal CSV Auto-Detector
│   ├── App.tsx                         # Layout & Tab-Steuerung
│   ├── main.tsx                        # Provider Wrapper & Entry Point
│   └── types.ts                        # TypeScript Interfaces & Datenmodelle
├── vitest.config.ts                    # Vitest Konfiguration
├── package.json                        # Abhängigkeiten & Scripts
└── README.md                           # Dokumentation
```

---

## 📜 Lizenz & Datenschutz

Dieses Projekt läuft **100% lokal im Browser**. Es werden keine Daten an externe Server gesendet (außer optionalen, öffentlichen Preis-Abfragen an CoinGecko / EZB). Mit dem Master-PIN Tresor bleiben alle Depotdaten lokal verschlüsselt.
