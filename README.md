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

Der **FinanzPortfolio CoPilot** ist eine moderne, reine Client-Side Webapplikation (PWA) zur vollumfänglichen Analyse, Verfolgung und Optimierung von Wertpapier- und Krypto-Portfolios. 

### Warum FinanzPortfolio CoPilot?
- 🔒 **100% Datenschutz**: Keine Speicherung deiner Finanzdaten auf externen Servern. Alle Transaktionen bleiben ausschließlich lokal in deinem Browser.
- ⚡ **Web Crypto Tresor**: AES-GCM 256-Bit Verschlüsselung aller Depotdaten via Master-PIN.
- 📱 **Mobile First PWA**: 1-Klick-Installation auf iOS und Android inklusive Offline-Verfügbarkeit.
- 📈 **Profianalysen**: TTWRR, IRR, Sharpe Ratio, Max Drawdown, Alpha/Beta Benchmark-Engine, Monte-Carlo-Simulationen und automatischer Rebalancing-Auftragsplaner.

---

## ✨ Feature-Highlights & Hauptfunktionen

### 1. 📊 Dashboard & Performance-Analysen
- **Echtzeit-Kennzahlen**: Gesamtvermögen, Einstandswert, Absolute & Prozentuale Rendite, Cash-Bestand.
- **Interaktiver Zeitraum-Filter**: Dynamische Analyse im Chart (1M, 3M, 6M, 1Y, 3Y, 5Y, ALL).
- **Professionelle Renditemetriken**: TTWRR (zeitgewichtet), IRR (geldgewichtet), Sharpe Ratio & Volatilität.
- **Monatliche Performance-Matrix**: Historische Renditen pro Jahr und Monat im Heatmap-Stil.

### 2. 💱 Multi-Währungsumrechnung (FX-Engine)
- Echtzeit-Umrechnung zwischen **EUR, USD, CHF und GBP** unter Anwendung tagesaktueller Devisenkurse.

### 3. 📈 Benchmark-Vergleich & Alpha/Beta Engine
- Vergleiche dein Portfolio direkt mit **MSCI World**, **S&P 500**, **DAX 40** und **Bitcoin**.
- Errechnet deine Alpha ($\alpha$) Überrendite und dein Beta ($\beta$) Marktrisiko.

### 4. 🎯 Rebalancing-Auftragsplaner
- Berechnet für Einmalkäufe (z.B. 2.500 €) die exakt benötigten Kauf-Beträge und Stückzahlen je Asset, um deine Soll-Allokation kostenminimal wiederherzustellen.

### 5. 📄 Universal CSV & Portfolio Performance (PP) Import/Export
- **Portfolio Performance (PP)**: Vollständige Kompatibilität zum Import und Export im standardisierten PP-CSV/JSON-Format.
- **Auto-Detection**: Erkennt Formate von PP, Parqet, Trade Republic und allgemeinen Broker-CSVs automatisch.

### 6. 📑 Erweiterte PDF-Abrechnungs-Parser
- Automatische Erkennung von Kauf-, Verkauf- und Dividendenbelegen von **Trade Republic**, **Scalable Capital**, **ING-DiBa**, **comdirect**, **DKB**, **Consorsbank**, **finanzen.net zero**, **Flatex**, **Smartbroker+**, **Revolut** und **eToro**.

### 7. ⚖️ Deutsche Steuerlogik (§ 20 & § 18 InvStG, EStG)
- **Vorabpauschale-Rechner**: Exakte Ermittlung des Basisertrags und der steuerpflichtigen Vorabpauschale gem. § 18 InvStG (Basiszins 2,29% + 30% Teilfreistellung).
- **Anlage KAP Report**: PDF-Druckbericht für realisierte Gewinne (FIFO), Verluste, Freibetrag (1.000 €) und Quellensteuern.

### 8. 🔒 Web Crypto Master-PIN Tresor
- Lokale **AES-GCM 256-Bit** Verschlüsselung aller Depotdaten. Ein Master-PIN Unlock Screen sperrt unbefugte Zugriffe beim Start ab.

---

## 🚀 Schnellanleitung (Anleitung zur Nutzung)

### Schritt 1: Depot anlegen oder importieren
- Starte die App und nutze das **Portfolio-Dropdown** oben rechts, um ein neues Portfolio zu erstellen.
- Nutze das **CSV-Import-Icon** oder den **Stapel PDF-Upload**, um bestehende Abrechnungen direkt einzulesen.

### Schritt 2: Transaktionen verwalten
- Im Tab **Aktivitäten** kannst du manuelle Käufe, Verkäufe, Einzahlungen oder Dividenden erfassen.
- Nutze die Such- und Filterleiste nach Ticker, Broker oder Transaktionstyp.

### Schritt 3: Strategie & Rebalancing festlegen
- Richte im Tab **Strategie** deine Ziel-Allokation (z.B. 60% Aktien, 30% ETFs, 10% Krypto) ein.
- Lass dir vom **Rebalancing-Auftragsplaner** exakte Orderempfehlungen für frisches Kapital errechnen.

### Schritt 4: Tresor-Verschlüsselung aktivieren
- Öffne die **Einstellungen** (Zahnrad-Icon).
- Gib eine Master-PIN ein und klicke auf **Aktivieren**. Ab sofort sind deine Daten AES-GCM 256-Bit verschlüsselt.

---

## 🌐 1-Klick Deployment & Hosting

### 1. Vercel Deployment (Empfohlen)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
- Repository mit Vercel verbinden. Vercel erkennt Vite automatisch (`vercel.json` inklusive).

### 2. Netlify Deployment
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)
- Repository auf Netlify verknüpfen. Die mitgelieferte `netlify.toml` steuert Build und SPA-Redirects.

### 3. GitHub Pages Deployment
- In Repository-Einstellungen unter **Pages** die Quelle auf **GitHub Actions** stellen.
- Die Workflow-Datei `.github/workflows/deploy.yml` führt automatisch Tests aus und baut die PWA bei jedem Push auf `main`.

---

## 🛠️ Technologie-Stack & Architektur

| Schicht | Technologie |
|---|---|
| **Frontend Framework** | React 19, TypeScript 6.0 |
| **Build Tool & Bundler** | Vite 8.1 (mit Rollup Manual Chunk-Splitting) |
| **Mobile & PWA** | Web App Manifest, Service Worker Caching (`sw.js`) |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Line) |
| **Testing** | Vitest (13 Automatisierte Unit Tests), Testing Library React, JSDOM |
| **Code Quality & Linting** | TypeScript `tsc --noEmit` |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM 256-Bit) |
| **Deployment** | Vercel, Netlify, GitHub Actions CI/CD |

---

## 🔒 Sicherheit & Daten-Tresor (AES-GCM 256)

Alle eingegebenen Daten werden verschlüsselt im `localStorage` deines Browsers aufbewahrt:
- Key Derivation: **PBKDF2** mit 100.000 Iterationen (SHA-256).
- Verschlüsselungsalgorithmus: **AES-GCM 256-Bit** mit zufälligem Salt (16 Bytes) und IV (12 Bytes).

---

## 🚦 Entwicklungs- & Testbefehle

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungs-Server starten
npm run dev

# 3. Automatisierte Vitest Unit-Tests ausführen (13 Tests)
npm run test

# 4. Code-Qualitätsprüfung ausführen
npm run lint

# 5. Produktions-Build erstellen (mit optimiertem Chunk-Splitting)
npm run build
```
