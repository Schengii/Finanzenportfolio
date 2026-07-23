# 📈 FinanzPortfolio CoPilot

> **Professioneller, datenschutzfreundlicher & hochleistungsfähiger Portfolio-Tracker & Finanzanalyst** auf Basis von React 19, TypeScript, Vite, Web Crypto API, PWA und Vitest.

---

## ✨ Feature-Highlights

### 1. 📊 Dashboard & Performance-Analysen
- **Echtzeit-Kennzahlen**: Gesamtvermögen, Einstandswert, Absolute & Prozentuale Rendite, Sparraten-Tracker.
- **Rendite-Kennzahlen**:
  - **TTWRR** (Time-Weighted Rate of Return)
  - **IRR / MWRR** (Internal Rate of Return / Money-Weighted Rate of Return)
  - **Max Drawdown** (%) & **Sharpe Ratio** (Risikoadjustierte Rendite)
- **Monatliche Performance-Matrix**: Historische Renditen pro Jahr und Monat im Hitmap-Stil.

### 2. 📈 Benchmark-Vergleich & Alpha/Beta Engine (`BenchmarkComparison.tsx`)
- **Benchmark-Vergleichskurven**: Vergleiche dein Portfolio mit **MSCI World**, **S&P 500**, **DAX 40** und **Bitcoin**.
- **Alpha ($\alpha$)**: Misst deine echte Überrendite gegenüber dem Markt.
- **Beta ($\beta$)**: Misst die Volatilität / Schwankungsintensität deines Portfolios relativ zum Markt.

### 3. 🎯 Rebalancing-Auftragsplaner (`RebalancingOrderPlanner.tsx`)
- Berechnet für Einmalkäufe (z.B. 2.500 €) die exakt benötigten Kauf-Beträge und Stückzahlen je Asset, um deine Soll-Allokation mit minimalen Ordergebühren wiederherzustellen.

### 4. 📅 Ex-Tag Radar & 3-Jahre Dividenden-Prognose (`ExDateDividendRadar.tsx`)
- **Ex-Tag Benachrichtigungs-Radar**: Übersicht anstehender Ex-Dividenden-Tage in den nächsten 30 Tagen.
- **3-Jahre DGR Prognose**: Zukunfts-Dividendenrechner auf Basis historischer Erhöhungsraten (Dividend Growth Rate).

### 5. 🤖 KI-Depot-Check & Risikodiagnose (`PortfolioHealthAudit.tsx`)
- **Klumpenrisiko-Erkennung**: Automatische Warnung bei Positionen > 20% des Gesamtportfolios.
- **ETF-Überschneidungs-Check (Overlap-Analyzer)**: Identifiziert doppelte US-Tech-Gewichtungen (z.B. MSCI World + S&P 500).
- **Gebühren-Check**: Errechnet die durch Orderentgelte aufgelaufenen Kosten.
- **Health Score (0 - 100)**: Ermittelt die Gesamtgesundheit des Depots auf einen Blick.

### 6. 🗺️ Portfolio Treemap / Heatmap (`PortfolioHeatmap.tsx`)
- Proportionale Rechteck-Visualisierung aller Assets. Kachelgröße = Depotgewichtung (%). Kachelfarbe = Kursgewinn/Verlust.

### 7. 🎲 Monte-Carlo-Simulation & Historische Stress-Tests (`StressTestModal.tsx`)
- **Monte-Carlo-Simulator (1.000 Pfade)**: Simulation künftiger Vermögensverläufe (10., 50., 90. Perzentil).
- **Historische Stress-Tests**: Simuliert Finanzkrise 2008 (-45,5%), Dotcom 2000 (-55%), Corona 2020 (-33,9%), Zinswende 2022 (-24,8%).

### 8. 🌊 Performance-Attribution & DRIP Zinseszins (`PerformanceAttribution.tsx`)
- **Wasserfall-Zerlegung**: Ertrag in Einzahlungen, Kursgewinne, Dividenden, FX, Gebühren und Steuern.
- **DRIP Zinseszins-Prognose**: Mehrgewinn durch automatische Dividenden-Reinvestition (Dividend Reinvestment Plan).

### 9. 🎯 Soll- vs. Ist-Allokation Radar-Chart (`AllocationRadarChart.tsx`)
- Netzdiagramm (Spider Chart) zur Gegenüberstellung deiner Wunsch-Branchengewichtung mit dem Ist-Zustand.

### 10. 🌴 FIRE & Dividenden-Freiheitsrechner (`FireFreedomWidget.tsx`)
- Berechnet die erforderliche **FIRE-Zielsumme** (4%-Entnahmeregel) und den Abdeckungsgrad monatlicher Lebenshaltungskosten.

### 11. 🌐 Gesamtvermögens-Übersicht (Net Worth Dashboard) (`NetWorthDashboard.tsx`)
- Kumuliert Aktien/ETF/Krypto-Portfolios mit Tagesgeld, Notgroschen, Immobilien und zieht Verbindlichkeiten ab.

### 12. 📄 PDF & Druckberichts-Generator (`PdfExportModal.tsx`)
- Druckfertiges PDF-Export-Tool für Jahresberichte und Steuerbescheinigungen.

### 13. 📱 PWA Mobile App Support (Progressive Web App)
- Service Worker (`sw.js`) und Web App Manifest (`manifest.json`) für **1-Klick Installation** auf iOS- und Android-Homescreens inklusive Offline-Caching.

### 14. ⚖️ Deutsche Steuerlogik (§ 20 & § 18 InvStG, EStG)
- **FIFO-Prinzip**, **Teilfreistellung (30%)**, **Vorabpauschale**, **Krypto 1-Jahr Haltefrist (§ 23 EStG)** und **Anlage KAP Report (`TaxReportModal.tsx`)**.

### 15. 🔒 Web Crypto API Tresor (`cryptoStorage.ts`)
- Lokale AES-GCM 256-Bit Verschlüsselung aller Depotdaten via Master-PIN.

---

## 🛠️ Technologie-Stack

| Schicht | Technologie |
|---|---|
| **Frontend Framework** | React 19, TypeScript |
| **Build Tool & Bundler** | Vite 8.1 |
| **Mobile & PWA** | Web App Manifest, Service Worker Caching |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Line) |
| **Testing** | Vitest (13 Automated Unit Tests), Testing Library React, JSDOM |
| **Linting & Code Quality** | Oxlint |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM) |

---

## 🚦 Entwicklungs- & Testbefehle

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungs-Server starten
npm run dev

# Automatisierte Vitest Unit-Tests ausführen (13 Tests)
npm run test

# Code-Linter (Oxlint) ausführen
npm run lint

# Produktions-Build erstellen
npm run build
```
