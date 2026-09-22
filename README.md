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
8. [📝 Changelog & Versionshistorie](#-changelog--versionshistorie)

---

## 💡 Über das Projekt

Der **FinanzPortfolio CoPilot** ist eine moderne, datenschutzorientierte Client-Side Webapplikation (PWA) zur vollumfänglichen Analyse, Verfolgung und Optimierung von Wertpapier-, Immobilien-, Zins-, Krypto- und Derivate-Portfolios. 

### Warum FinanzPortfolio CoPilot?
- 🔒 **100% Datenschutz**: Keine Speicherung deiner Finanzdaten auf fremden Servern. Alle Transaktionen bleiben ausschließlich lokal in deinem Browser.
- ⚡ **Web Crypto Tresor & Auto-Lock**: AES-GCM 256-Bit Verschlüsselung aller Depotdaten via Master-PIN inklusive Inaktivitäts-Auto-Lock, PIN-Änderung und Entschlüsselungsfunktion.
- 🔄 **Versionierte Snapshots**: Bis zu 5 automatische Wiederherstellungspunkte vor Massenimporten mit 1-Klick Rollback.
- 🌐 **Automatisierter Webhook Push & Dispatcher**: Verschlüsselte Tresor-Sicherungen per 1-Klick oder automatisch an private Automation-Server (n8n, Home Assistant) und REST-Endpunkte.
- 💱 **Multi-Währungs Cash-Konten**: Getrennte Salden für EUR, USD, CHF und GBP mit integriertem FX-Swap-Rechner.
- ⌨️ **Spotlight Command Palette**: Schnelle Suche und Tastaturnavigation via `Strg + K`.
- 📱 **Mobile First PWA**: 1-Klick-Installation auf iOS und Android mit touch-optimierten Tabellen und flexiblem Layout.
- 📈 **Profianalysen**: TTWRR, IRR, dynamische Sharpe Ratio, echter Max Drawdown aus Transaktionshistorie, Fama-French 5-Faktor Zerlegung, Monte-Carlo FIRE-Simulation, Quellensteuer-Rückerstattung und Options-Prämienrenditen.

---

## ✨ Feature-Highlights & Hauptfunktionen

### 1. 💱 Multi-Währungs Cash-Konten & FX Swap Engine (`MultiCurrencyCashModal.tsx`)
- **Getrennte Verrechnungskonten**: Führe separate Bargeldbestände in **EUR (€)**, **USD ($)**, **CHF (Fr.)** und **GBP (£)**.
- **Transaktions-Integration**: Dividenden, Zinsen, Käufe und Verkäufe in Originalwährung belasten oder entlasten direkt das passende Währungskonto.
- **FX-Geldwechsel**: Tausche Währungen mit frei anpassbarem Wechselkurs und Gebührenabrechnung, ohne unrealistische automatische Umrechnungsverluste.
- **Gesamtliquiditäts-Übersicht**: Aggregierte Darstellung aller Barbestände in deiner gewählten Basiswährung.

### 2. 🤖 E-Mail & Webhook Automations-Dispatcher (`EmailWebhookDispatcherModal.tsx`)
- **Automatisierte Order-Imports**: Empfange Buchungsdaten direkt aus Automationsplattformen wie **n8n**, **Home Assistant**, **Make** oder **Google Apps Script**.
- **Integrierter E-Mail Parser**: Erkennt Trade Republic-, Scalable Capital- und ING-Abrechnungs-Mails anhand von Betreff und Textkorpus.
- **Sicherer Webhook-Token**: Token-basierte Authentifizierung mit fertigen cURL- und JSON-Codebeispielen sowie Live-Aktivitäts-Log.

### 3. ⚖️ DACH-Steueroptimierung & Kirchensteuer (`TaxReportModal.tsx` & `performanceUtils.ts`)
- **🇩🇪 Deutschland**:
  - Abgeltungsteuer (25%) + Solidaritätszuschlag (5,5% auf Steuerbetrag = 26,375%).
  - **Kirchensteuer-Präzisionsberechnung**: Wählbar zwischen **8%** (Bayern / Baden-Württemberg) und **9%** (übrige Bundesländer) mit der gesetzlichen Formel nach § 32d Abs. 1 Satz 3 EStG ($e = \frac{e_0}{1 + k \cdot 0{,}25}$).
  - Dynamischer Sparer-Pauschbetrag aus den Portfolio-Einstellungen (z. B. 1.000 € / 2.000 €).
  - Vorabpauschale (§ 18 InvStG) basierend auf echten Beständen, getrennte Verlusttöpfe und Günstigerprüfung.
- **🇦🇹 Österreich**: Automatische Berechnung der Kapitalertragsteuer (**27,5% KESt flat**) auf Realisationsgewinne und Dividenden, OeKB-Meldefonds-Hinweise und Regelbesteuerungsoption (E1kv).
- **🇨🇭 Schweiz**: Private Kapitalgewinne auf Wertschriften sind **100% steuerfrei**! Getrennte Ausweisung der ordentlich steuerbaren Dividenden- & Zinserträge, Verrechnungssteuer-Anrechnung (35% VSt) und kantonale Vermögenssteuer-Kalkulation.

### 4. 🎯 8-Klassen Zielallokation & 1-Klick Rebalancing (`Strategy.tsx` & `PortfolioContext.tsx`)
- **Ganzheitliche Portfoliostrategie**: Definiere prozentuale Zielgewichtungen für alle 8 Anlageklassen:
  *Aktien, ETFs, Krypto, Anleihen, Edelmetalle, Cash, Immobilien, P2P Kredite*.
- **Automatische 1-Klick Normalisierung**: Rechnet beliebige Zwischensummen proportional auf exakt 100% um.
- **Portfoliospezifische Speicherung**: Zielallokationen werden dauerhaft pro Portfolio im Zustand und Tresor hinterlegt.
- **Interaktive Backtest-Sandbox**: Historischer Backtest seit 2016 mit synchronisierten Balancierungs-Schiebereglern.

### 5. 🏛️ Vermögensbilanz & Net Worth Dashboard (`NetWorthDashboard.tsx`)
- **Echte Depot-Marktwerte**: Dynamische Verknüpfung mit dem aktuellen Gesamtportfoliowert (`stats.totalValue`).
- **Netto-Immobilien-Eigenkapital**: Automatische Verrechnung des Immobilienmarktwerts abzüglich der Darlehensrestschuld (`marketValue - loanBalance`).
- **Zinstreppe & Einlagen**: Direkte Berücksichtigung aller Fest- und Tagesgelder aus der Zinstreppe.
- **Persistente manuelle Vermögenswerte**: Freie Anlage von Fahrzeugen, Kunst oder Verbindlichkeiten mit dauerhafter Speicherung im lokalen Speicher.

### 6. 📅 Finanzkalender mit iCal / .ics-Export (`CalendarExportModal.tsx` & `DividendCalendar.tsx`)
- **Universeller Kalender-Export**: Synchronisiere alle Zahltage, Ex-Dividenden-Termine und Festgeld-Fälligkeiten direkt mit Apple Kalender (macOS/iOS), Google Calendar oder Microsoft Outlook.
- **Drei Ereignis-Kategorien**:
  - *Erhaltener Cashflow:* Vergangene Dividendenzahlungen inklusive Betrag und Broker.
  - *Zukunfts-Prognose:* Hochrechnung zukünftiger Dividendenausschüttungen (3, 6 oder 12 Monate im Voraus) basierend auf deinen aktuellen Beständen.
  - *Zinstreppe & Festgelder:* Fälligkeitstermine von Sparbriefen und Termingeldern mit Benachrichtigung am Tag der Gutschrift.
- **Komfortable Bereitstellung**: 1-Klick-Download als `.ics`-Datei oder Direktkopieren des iCal-Contents in die Zwischenablage.

### 7. 🔁 DRIP Dividenden-Reinvestitions-Automatik (`DripCompoundModal.tsx`)
- **Zinseszins-Simulator (5 bis 30 Jahre)**: Interaktiver Vergleich des Vermögenszuwachses mit automatischer Wiederanlage der Dividenden (DRIP) vs. ohne Reinvestition.
- **Übernahme der Ist-Rendite**: Direkte 1-Klick-Übernahme der tatsächlichen Portfoliorendite in die Simulationsparameter.
- **1-Klick Ausführung**: Reinvestiere alle im laufenden Jahr erhaltenen Dividenden als reale Zukäufe in dein Depot.

### 8. 📸 Smart Beleg & Foto Importer (`ReceiptScannerModal.tsx`)
- **Client-seitige Abrechnungserkennung**: Lade Screenshots, Fotos (PNG, JPG, WebP) oder PDF-Abrechnungen per Drag & Drop hoch.
- **Adaptive Bildkontrast-Verstärkung**: Canvas-basierte adaptive Binarisierung zur Verbesserung von Kontrast und Schärfe.
- **Automatische Mustererkennung**: Extrahiert Broker, Transaktionstyp, Datum, WKN/ISIN, Symbol, Stückzahl, Kurs, Gebühren und Steuern.
- **1-Klick Demo-Simulation**: Sofortiges Testen via voreingestellter Testabrechnungen mit interaktiver Buchungs-Übernahme.

### 9. 🛡️ Gesetzliche Einlagensicherung in der Zinstreppe (`DepositLadderWidget.tsx`)
- **Klumpenrisiko-Frühwarnung**: Warnt sofort auffällig, sobald das aggregierte Anlagevolumen bei einem einzelnen Bankinstitut die gesetzliche Einlagensicherung von **100.000 €** übersteigt.
- **Vollständige Bearbeitbarkeit**: In-Place Bearbeitung von Festgeldern, Tagesgeldern und Sparbriefen inklusive Fälligkeitskalender.

### 10. ⚡ Werkzeuge & Assistenten Hub (`App.tsx`)
- **Aufgeräumte Navbar**: Bündelt alle Spezialfunktionen strukturiert in drei Kategorien:
  - *📊 Analyse & Berichte:* DRIP Zinseszins, Finanzkalender & iCal, Dual Portfolio-Vergleich, Institutionelles Factsheet (PDF), Monte Carlo Stresstests, PDF-Monatsbericht, Multi-Währungs Cash-Konten.
  - *📑 Steuern & DACH:* Steuer- & Verlusttöpfe Report (DE/AT/CH), Tax Loss Harvesting, Ausländische Quellensteuer-Rückerstattung, Krypto FiFo Radar.
  - *📥 Daten & Cloud:* Smart Beleg-Scanner, E-Mail/Webhook Dispatcher, Universal CSV Importer, Stapel PDF Upload, Neobroker Order-Assistent, Nextcloud / WebDAV Sync.

### 11. 🚀 Offline-fähiger PDF Parser & Marktdaten-Caching
- **Robuster lokaler PDF-Worker**: Integrierter ESM-Worker von `pdfjs-dist` mit CDN-Fallback verhindert Netzwerk- und Versionsabbrüche.
- **Finnhub API & Cache**: Konfigurierbarer Finnhub-Schlüssel mit lokalem TTL-Cache zur Schonung von API-Limits und Minimierung von Ladezeiten.

---

## ⚖️ Steuer- und Finanzlogik (DACH-Region: DE, AT, CH)

| Land | Steuersatz auf Kursgewinne | Dividenden / Zinsen | Freibetrag | Besonderheiten |
|---|---|---|---|---|
| **🇩🇪 Deutschland** | 26,375% (inkl. Soli) + optional 8%/9% KiSt | 26,375% (inkl. Soli) + optional 8%/9% KiSt | 1.000 € (Single) / 2.000 € (Verheiratet) | Getrennte Verlusttöpfe (Aktien vs. Sonstige), Günstigerprüfung, Vorabpauschale (§ 18 InvStG), Teilfreistellung (30% Aktienfonds, 15% Mischfonds), Krypto nach 1 Jahr steuerfrei (§ 23 EStG) |
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
| **Mobile & PWA** | Web App Manifest, Service Worker Caching (`sw.js`) mit Stale-While-Revalidate, Responsive Mobile CSS |
| **Charts & Visualisierung** | Recharts (Area, Bar, Pie, Radar, Line) |
| **Testing** | Vitest (54 Unit- & Integrationstests), Testing Library React, JSDOM |
| **Code Quality & Typecheck** | TypeScript `tsc -b` (Zero Errors) |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM 256-Bit) |
| **Deployment** | Vercel, Netlify, GitHub Pages, Cloudflare Pages |

---

## 🔒 Sicherheit, Auto-Lock & Daten-Tresor (AES-GCM 256)

1. **Zero-Knowledge-Prinzip**: Alle Berechnungen und Datenverarbeitungen finden ausschließlich im Browser des Nutzers statt.
2. **AES-GCM 256-Bit**: Der lokale Tresor wird mit einem kryptographisch sicheren Schlüssel (abgeleitet via PBKDF2 mit Salt) verschlüsselt.
3. **Inaktivitäts-Timer**: Nach definierter Zeitspanne ohne Benutzerinteraktion wird das System automatisch gesperrt.
4. **Wiederherstellung**: Export und Import vollverschlüsselter Backup-Dateien sowie versionierte Snapshots vor Massenimporten.

---

## 🚦 Entwicklungs- & Testbefehle

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungs-Server starten
npm run dev

# 3. Automatisierte Vitest Unit-Tests ausführen (54 Tests)
npm run test

# 4. TypeScript-Typen prüfen
npm run lint

# 5. Produktions-Build erstellen
npm run build
```

---

## 📝 Changelog & Versionshistorie

### Version 2.2.0 (Aktuell)
- **💱 Multi-Währungs Cash-Konten**:
  - Hinzufügen von `MultiCurrencyCashModal.tsx` mit getrennter Saldenführung für EUR, USD, CHF und GBP.
  - Vollständiger FX-Swap-Rechner mit anpassbaren Wechselkursen, Gebührenabzug und nativer Transaktionsintegration (`FX_SWAP`).
  - Cash-Saldo- und Risikoberechnungen in `performanceUtils.ts` berücksichtigen Optionsprämien, Mieteinnahmen, Instandhaltungen und FX-Buchungen.
- **🤖 E-Mail & Webhook Automations-Dispatcher**:
  - Hinzufügen von `EmailWebhookDispatcherModal.tsx` zur Anbindung an n8n, Home Assistant, Make und Gmail Apps Script.
  - Automatische Textextraktion für Broker-Mails und Token-geschützter Webhook-Endpunkt.
- **⚖️ Kirchensteuer & Steueroptimierung**:
  - Exakte Kirchensteuer-Formel nach § 32d EStG (8% BY/BW vs. 9% übrige Bundesländer) in `TaxReportModal.tsx`.
  - Dynamische Übernahme von Freibetrag (`taxAllowanceEur`) und Beständen (`holdings`) für kantonale Vermögenssteuer und Teilfreistellung.
- **🎯 8-Asset Allokation & Rebalancing**:
  - Erweiterung der Zielgewichtungen in `Strategy.tsx` auf alle 8 Anlageklassen mit 1-Klick 100%-Normalisierung.
  - Portfoliospezifische Speicherung der Zielallokationen im `PortfolioContext`.
  - Korrektur der Backtest-Slider mit `adjustBacktestSliders`.
- **🏛️ Net Worth Real Estate & Liquiditäts-Integration**:
  - Dynamische Einbindung des Gesamtmarktwerts, des Immobilien-Netto-Eigenkapitals und der Zinstreppe in `NetWorthDashboard.tsx`.
  - Lokale Persistenz benutzerdefinierter Vermögenswerte (`localStorage`).
- **📈 Kurs-Caching & Finnhub-Support**:
  - Lokaler Cache mit TTL (`finanz_market_prices_cache`) zur Reduktion von Ladezeiten und Schonung von API-Quotas.
  - Finnhub API-Key Unterstützung und Cache-Bereinigung in `SettingsModal.tsx`.
- **📱 Mobile Responsive Optimierung**:
  - Responsive Menüleiste, berührungsfreundliche Tabs und horizontal scrollbare Tabellen für mobile Endgeräte.
- **🛡️ Fehlerbehebungen & Build-Stabilität**:
  - Beseitigung aller TypeScript-Fehler und ungenutzter Variablen (`tsc -b` fehlerfrei).
  - 54 von 54 Vitest-Tests erfolgreich durchgeführt.
  - Vite Production-Build fehlerfrei generiert.

### Version 2.1.0
- Integration der DRIP-Zinseszins-Simulation (`DripCompoundModal.tsx`).
- Universeller Finanzkalender mit iCal / .ics-Export (`CalendarExportModal.tsx`).
- Smart Beleg- & Foto-Importer (`ReceiptScannerModal.tsx`) mit Canvas-Kontrastverstärkung.
- Erweiterte Krypto-Transaktionen (§ 22 Nr. 3 EStG Staking, Mining, Airdrop).
- Klumpenrisiko-Erkennung in der Zinstreppe (> 100.000 € Einlagensicherung).

---

*Erstellt mit ❤️ für maximale finanzielle Unabhängigkeit, Transparenz und kompromisslosen Datenschutz.*
