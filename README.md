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
- 📄 **Universeller DACH-PDF Beleg-Import**: Vollautomatisches Einlesen von Abrechnungen für Trade Republic, Scalable Capital, ING, comdirect, DKB, Consorsbank, finanzen.net zero, flatex und Bitpanda.
- 🧬 **Portfoliokorrelations- & Diversifikations-Heatmap**: Pearson-Korrelationsmatrix, Klumpenerkennung und Diversifikations-Score nach der Modernen Portfoliotheorie (Markowitz).
- 🔥 **FIRE-Dynamik & Kapitalverzehr-Simulator**: Variable Entnahmestrategien (Guyton-Klinger, Bengen 4%, VPW) mit gesetzlicher/betrieblicher Rente und Krankenversicherung.
- 🚀 **Sparplan-Dynamisierungs- & Zinseszins-Rechner**: Vergleich fester vs. prozentual dynamisierter Sparraten, Step-Up Boosts und Meilenstein-Projektionen bis zu 35 Jahre.
- ⚖️ **Portfolio-Rebalancing & Order-Assistent**: Dual-Modus Soll/Ist-Vergleich (Voll-Rebalance vs. steuerschonender Cashflow-Zukauf) mit Stückzahl-Berechnung und 1-Klick-Zwischenablage für Neobroker.
- 📉 **Fondskosten- & TER-Zinseszins-Analyse**: Portfoliogewichtete TER in % und € p.a. mit 30-Jahre Zinseszins-Verlustsimulation und Aktivfonds-Vergleich.
- 🪙 **Krypto Tax-Loss Harvesting (§ 23 EStG)**: Haltefristen-Radar mit Countdown-Warnung vor Ablauf der 365-Tage-Frist zur Rettung von Einkommensteuer-Verlusttöpfen.
- 📶 **PWA Offline-Status & Auto-Sync**: Nahtloser lokaler Cache-Betrieb mit visueller Online/Offline-Statusanzeige und automatischem Kurs-Refresh bei Reconnect.
- 🏛️ **Multi-Broker Depot-Mapping**: Aufschlüsselung von Depotwerten, realisierten Gewinnen, Dividenden und Gebühren nach Brokern.
- 📊 **Strukturierter Excel Multi-Sheet Export**: 1-Klick Download einer 6-Tabellenblatt-Arbeitsmappe (.xlsx) für Steuern, Auswertungen und Archivierung.
- 🔔 **Kursalarme & Push-Benachrichtigungen**: Automatische Überwachung von Kurszielen, Stop-Loss und extremen Tagesabstürzen via Web Notifications.
- 📸 **Offline-OCR Texterkennung**: Direkte Beleg- und Screenshot-Erkennung im Browser via WebAssembly / Tesseract.js ohne Server-Upload.
- 💱 **Multi-Währungs Cash-Konten**: Getrennte Salden für EUR, USD, CHF und GBP mit integriertem FX-Swap-Rechner.
- ⚡ **Web Crypto Tresor & Auto-Lock**: AES-GCM 256-Bit Verschlüsselung aller Depotdaten via Master-PIN inklusive Inaktivitäts-Auto-Lock.
- ⌨️ **Spotlight Command Palette**: Schnelle Suche und Tastaturnavigation via `Strg + K`.
- 📱 **Mobile First PWA**: 1-Klick-Installation auf iOS und Android mit touch-optimierten Tabellen und flexiblem Layout.
- 📈 **Profianalysen**: TTWRR, IRR, dynamische Sharpe Ratio, echter Max Drawdown aus Transaktionshistorie, Fama-French 5-Faktor Zerlegung, Monte-Carlo FIRE-Simulation, Quellensteuer-Rückerstattung und Options-Prämienrenditen.

---

## ✨ Feature-Highlights & Hauptfunktionen

### 1. 📄 Universeller DACH-PDF Beleg-Import (`BatchPdfUploadModal.tsx` & `pdfImportUtils.ts`)
- **Breite Broker-Abdeckung**:
  - Unterstützt Abrechnungs-PDFs aller führenden DACH-Broker und Neobroker: **Trade Republic**, **Scalable Capital**, **ING DiBa**, **comdirect**, **DKB**, **Consorsbank**, **finanzen.net zero**, **flatex** und **Bitpanda**.
- **Intelligente Textextraktion**:
  - Parst Wertpapierkäufe, Verkäufe, Dividendenabrechnungen und Krypto-Transaktionen automatisch aus unstrukturiertem Text.
  - Extrahiert ISIN, WKN, Asset-Namen, Transaktionstyp, Datum, Stückzahl, Ausführungskurs, Brutto- & Nettobetrag, Gebühren sowie Steuern.
- **Automatische Broker-Verschlagwortung**:
  - Erkanntes Brokerhaus wird sofort in das Transaktions-Notizfeld (`[Broker: ...]`) eingetragen und steht so direkt für das Multi-Broker Depot-Mapping zur Verfügung.
- **Transparente Vorschau & Batch-Import**:
  - Übersichtliche Prüftabelle aller erkannten Transaktionen vor dem finalen Übertrag in das Portfolio inklusive Duplikaterkennung.

### 2. 🧬 Portfoliokorrelations- & Diversifikations-Heatmap (`CorrelationHeatmapModal.tsx` & `correlationUtils.ts`)
- **Moderne Portfoliotheorie (MPT)**:
  - Berechnet paarweise Korrelationen zwischen allen Positionen auf Basis von Rendite- und Risikoprofilen, Asset-Klassen und Geographien.
- **Interaktive Farb-Matrix**:
  - Farbskala von tiefem Dunkelblau/Grün (-1,0: Perfekte Gegenläufigkeit/Hedging) über Gelb bis hin zu leuchtendem Rot (+1,0: Perfekter Gleichlauf).
- **Cluster- & Klumpen-Radar**:
  - Erkennt hochkorrelierte Positionscluster ($r \ge 0,85$), z. B. Überschneidungen von US Big Tech Aktien (Apple, Microsoft, Nvidia) mit Nasdaq- und S&P 500-ETFs.
- **Portfolio-Diversifikations-Score**:
  - Dynamischer Gesamt-Score von 0% (Extremes Klumpenrisiko) bis 100% (Optimale Diversifikation) mit konkreten Handlungsempfehlungen.

### 3. 🔥 FIRE-Dynamik & Kapitalverzehr-Simulator mit variabler Entnahmerate (`FireWithdrawalSimulatorModal.tsx` & `fireSimulatorUtils.ts`)
- **Flexible Entnahme-Strategien**:
  - **Guyton-Klinger Leitplanken (Guardrails)**: Passt die Entnahmerate bei Marktüberschwang nach oben und bei Crash-Jahren nach unten an, um das Kapital langfristig zu sichern.
  - **Bengen 4%-Regel**: Klassische inflationsbereinigte Entnahme.
  - **VPW (Variable Percentage Withdrawal)**: Maximiert den Lebenszeitkonsum durch altersabhängige Entnahmequoten.
  - **Feste prozentuale Entnahme**: Entnahme einer konstanten Quote des aktuellen Depotwerts.
- **Reale Renten- und Kostenverrechnung**:
  - Integriert gesetzliche Rente, betriebliche Altersvorsorge (bAV), private Krankenversicherung und Vererbungswunsch (Mindest-Restkapital).
- **Interaktive Recharts Area-Visualisierung**:
  - Zeigt Depotwert-Entwicklung, Entnahmen und Rentenbezüge über den gesamten Lebenshorizont (z. B. bis Alter 85 oder 95) auf einen Blick.

### 4. 🚀 Sparplan-Dynamisierungs- & Zinseszins-Rechner (`SavingsPlanGrowthModal.tsx` & `savingsGrowthUtils.ts`)
- **Multi-Szenarien-Vergleich**:
  - Vergleicht 3 Sparstrategien über bis zu 35 Jahre:
    1. *Fixe Sparrate* (z. B. konstant 300 € / Monat).
    2. *Jährliche Dynamisierung* (z. B. +2,5% p.a. Inflations-/Gehaltsausgleich).
    3. *Jährlicher Step-Up* (z. B. +50 € / Monat jedes Jahr).
- **Zinseszins-Hebel & Rendite-Vorsprung**:
  - Quantifiziert den exakten Vermögensmehrwert der Dynamisierung nach 10, 20 und 30 Jahren.
- **Meilenstein-Projektion**:
  - Ermittelt das genaue Erreichungsjahr für Meilensteine wie 25.000 €, 50.000 €, 100.000 €, 250.000 €, 500.000 € und 1.000.000 € und zeigt den Zeitgewinn in Jahren an.

### 5. ⚖️ Portfolio-Rebalancing Ausführungs-Assistent & Orderliste (`RebalancingOrderModal.tsx` & `rebalanceUtils.ts`)
- **Dual-Modus Rebalancing**:
  - **🔄 Voll-Rebalancing**: Berechnet synchrone Verkäufe übergewichteter und Zukäufe untergewichteter Anlageklassen zur exakten Wiederherstellung der Zielquoten.
  - **💸 Nur Zukäufe (Cashflow-Steuerung)**: Steuerschonender Modus ohne jegliche Wertpapierverkäufe. Weist frisches Einzahlungs- oder Barkapital gezielt untergewichteten Anlageklassen zu, um Fehlallokationen ohne steuerauslösende Transaktionen zu beheben.
- **Passgenaue Order-Berechnung**:
  - Exakte Stückzahl- und Betragskalkulation für Einzeltitel innerhalb der Anlageklassen.
  - Frei definierbare Toleranzbänder (0%, 0.5%, 1%, 2%), um unnötige Kleinst-Orders zu vermeiden.
- **1-Klick-Zwischenablage für Neobroker**:
  - Exportiert eine übersichtliche, strukturierte Orderliste direkt in die Zwischenablage für die schnelle Orderaufgabe bei Trade Republic, Scalable Capital, ING oder Interactive Brokers.

### 6. 📉 Fondskosten- & TER-Zinseszins-Analyse (`TerExpenseAnalysisModal.tsx` & `terUtils.ts`)
- **Gewichtete Gesamtkostenquote (TER)**:
  - Berechnet die portfolio-gewichtete Total Expense Ratio (TER in % p.a.) und die jährlichen Gesamtkosten aller ETF- und Fondspositionen in Euro.
- **30-Jahre Zinseszins-Verlustsimulation**:
  - Dynamische Simulation des Zinseszins-Verlusts über 10, 20 und 30 Jahre ($V_{\text{Brutto}} - V_{\text{Netto}}$) bei wählbaren Marktrenditen (z. B. 7,0% p.a.).
- **Aktivfonds-Benchmark-Vergleich**:
  - Gegenüberstellung mit typischen Filialbank-Aktivfonds (z. B. 1,80% TER) und Visualisierung des enormen Vermögensvorteils im interaktiven Recharts AreaChart.
- **Transparente Positionsübersicht**:
  - Aufschlüsselung jedes einzelnen ETFs mit Fondsvolumen, TER, prozentualem Anteil am Fondsdepot und laufenden Jahreskosten.

### 7. 🪙 Krypto Tax-Loss Harvesting & 1-Jahres-Haltefristen-Radar (§ 23 EStG) (`CryptoTaxLossOptimizerModal.tsx` & `cryptoTaxUtils.ts`)
- **Haltefristen-Countdown (365 Tage)**:
  - Identifiziert alle offenen Krypto-Kauftranchen mit negativer Wertentwicklung, deren Haltedauer unter einem Jahr liegt.
  - Zeigt die verbleibenden Resttage bis zum Eintritt der Steuerfreiheit an – denn ab Tag 366 verfällt der Verlust steuerlich unwiederbringlich!
- **Dringlichkeits-Warnungen**:
  - Hebt Tranchen mit weniger als 30 Tagen Restzeit farblich als akuten Handlungsbedarf hervor.
- **Steuerersparnis-Rechner**:
  - Berechnet das reale Steuerentlastungspotenzial anhand des persönlichen Grenzsteuersatzes (z. B. 42%).
  - Gegenüberstellung mit bereits im laufenden Kalenderjahr realisierten steuerpflichtigen Krypto-Gewinnen nach § 23 Abs. 3 EStG.
- **Berater-Export**: 1-Klick-Kopierfunktion der Verlusttranchen für Steuerberater oder private Dokumentation.

### 8. 📶 PWA Offline-Status & Auto-Sync Monitor (`NetworkStatusIndicator.tsx`)
- **Echtzeit-Konnektivitätsüberwachung**:
  - Überwacht den Online-/Offline-Zustand des Browsers über native HTML5 Network-Events.
- **Visueller Header-Indikator**:
  - Diskreter Status-Badge im Kopfbereich (Grün: Online / Rot: Offline-Modus mit Hinweis auf lokalen Cache).
- **Auto-Sync bei Reconnect**:
  - Erkennt das Wiederherstellen der Internetverbindung und stößt automatisch einen Refresh der Echtzeit-Kursdaten und FX-Kurse an.

### 9. 🏛️ Multi-Broker Depot-Mapping & Vergleich (`BrokerBreakdownModal.tsx`)
- **Automatisches Broker-Screening**: Erkennt und aggregiert alle in Transaktionen und Beständen hinterlegten Broker (Trade Republic, Scalable Capital, Interactive Brokers, ING, Consorsbank, Bitpanda, etc.).
- **Detaillierte Kennzahlen je Broker**:
  - Aktueller Depot-Marktwert und investiertes Kapital.
  - Realisierte und unrealisierte Kursgewinne (€ und %).
  - Erhaltene Brutto-Dividenden und angefallene Ordergebühren.
- **Interaktive Allokations-Grafik**: Recharts PieChart mit prozentualer Aufteilung des Gesamtvermögens auf die einzelnen Depots.

### 10. 📊 Strukturierter Excel Multi-Sheet Export (.xlsx) (`ExcelExportModal.tsx` & `exportUtils.ts`)
- **Vollwertige Arbeitsmappen-Generierung**: Erzeugt mit einem Klick eine professionell formatierte Microsoft Excel-Datei (`.xlsx`) direkt im Browser:
  1. *Übersicht & KPIs*: Portfolio-Stammdaten, Gesamtwerte, Renditen (TTWRR, IRR), Sharpe Ratio, Max Drawdown.
  2. *Bestände*: Ticker, Asset-Name, Kategorie, Broker, Stückzahl, Einstandskurs, Marktwert, GuV (€/%), Rendite.
  3. *Transaktionen*: Vollständige Chronologie aller Käufe, Verkäufe, Dividenden, Swaps und Gebühren.
  4. *Dividenden-Historie*: Einzelaufstellung aller Ausschüttungen, Brutto, Quellensteuern und Nettobeträge.
  5. *Zinstreppe & Cash*: Laufzeiten, Zinssätze und Einlagensicherungs-Status.
  6. *DACH Steuer-Report*: Steuerpflichtige Erträge, genutzter Freibetrag und fällige Abgeltungsteuer.

### 11. 🔔 Kursalarme & Web Push-Benachrichtigungen (`PriceAlertsModal.tsx` & `alertUtils.ts`)
- **Intelligente Kursüberwachung**:
  - `ABOVE`: Kurs steigt über oder erreicht das gesetzte Kursziel (z. B. für Gewinnmitnahmen).
  - `BELOW`: Kurs fällt unter die Stop-Loss-Schwelle oder Nachkaufmarke.
  - `DAILY_DROP_PCT`: Sofortige Alarmierung bei extremen Tagesverlusten (z. B. $\ge 5\%$).
- **Native Browser-Push Notifications**: Nutzt die HTML5 `Notification`-API für Desktop- und Smartphone-Benachrichtigungen.
- **Header-Glocke mit Live-Counter**: Zeigt die Anzahl aktiver Alarme direkt in der Menüleiste an.

### 12. 📸 Client-seitige Offline-OCR Texterkennung (`ReceiptScannerModal.tsx`)
- **100% Datenschutz**: Verarbeitet Abrechnungsfotos und Kamera-Screenshots via WebAssembly (`tesseract.js`) vollständig lokal im Browser des Nutzers.
- **Fortschritts-Indikator**: Prozentuale Live-Anzeige des Erkennungsfortschritts.
- **Mustererkennung**: Liest Stk, Ausführungskurse, Wertpapiernamen, ISINs und Gebühren automatisch in das Buchungsformular ein.

### 13. 💱 Multi-Währungs Cash-Konten & FX Swap Engine (`MultiCurrencyCashModal.tsx`)
- **Getrennte Verrechnungskonten**: Führe separate Bargeldbestände in **EUR (€)**, **USD ($)**, **CHF (Fr.)** und **GBP (£)**.
- **Transaktions-Integration**: Dividenden, Zinsen, Käufe und Verkäufe in Originalwährung belasten oder entlasten direkt das passende Währungskonto.
- **FX-Geldwechsel**: Tausche Währungen mit frei anpassbarem Wechselkurs und Gebührenabrechnung, ohne unrealistische automatische Umrechnungsverluste.
- **Gesamtliquiditäts-Übersicht**: Aggregierte Darstellung aller Barbestände in deiner gewählten Basiswährung.

### 14. 🤖 E-Mail & Webhook Automations-Dispatcher (`EmailWebhookDispatcherModal.tsx`)
- **Automatisierte Order-Imports**: Empfange Buchungsdaten direkt aus Automationsplattformen wie **n8n**, **Home Assistant**, **Make** oder **Google Apps Script**.
- **Integrierter E-Mail Parser**: Erkennt Trade Republic-, Scalable Capital- und ING-Abrechnungs-Mails anhand von Betreff und Textkorpus.
- **Sicherer Webhook-Token**: Token-basierte Authentifizierung mit fertigen cURL- und JSON-Codebeispielen sowie Live-Aktivitäts-Log.

### 15. ⚖️ DACH-Steueroptimierung & Kirchensteuer (`TaxReportModal.tsx` & `performanceUtils.ts`)
- **🇩🇪 Deutschland**:
  - Abgeltungsteuer (25%) + Solidaritätszuschlag (5,5% auf Steuerbetrag = 26,375%).
  - **Kirchensteuer-Präzisionsberechnung**: Wählbar zwischen **8%** (Bayern / Baden-Württemberg) und **9%** (übrige Bundesländer) mit der gesetzlichen Formel nach § 32d Abs. 1 Satz 3 EStG ($e = \frac{e_0}{1 + k \cdot 0{,}25}$).
  - Dynamischer Sparer-Pauschbetrag aus den Portfolio-Einstellungen (z. B. 1.000 € / 2.000 €).
  - Vorabpauschale (§ 18 InvStG) basierend auf echten Beständen, getrennte Verlusttöpfe und Günstigerprüfung.
- **🇦🇹 Österreich**: Automatische Berechnung der Kapitalertragsteuer (**27,5% KESt flat**) auf Realisationsgewinne und Dividenden, OeKB-Meldefonds-Hinweise und Regelbesteuerungsoption (E1kv).
- **🇨🇭 Schweiz**: Private Kapitalgewinne auf Wertschriften sind **100% steuerfrei**! Getrennte Ausweisung der ordentlich steuerbaren Dividenden- & Zinserträge, Verrechnungssteuer-Anrechnung (35% VSt) und kantonale Vermögenssteuer-Kalkulation.

### 8. 🎯 8-Klassen Zielallokation & 1-Klick Rebalancing (`Strategy.tsx` & `PortfolioContext.tsx`)
- **Ganzheitliche Portfoliostrategie**: Definiere prozentuale Zielgewichtungen für alle 8 Anlageklassen:
  *Aktien, ETFs, Krypto, Anleihen, Edelmetalle, Cash, Immobilien, P2P Kredite*.
- **Automatische 1-Klick Normalisierung**: Rechnet beliebige Zwischensummen proportional auf exakt 100% um.
- **Portfoliospezifische Speicherung**: Zielallokationen werden dauerhaft pro Portfolio im Zustand und Tresor hinterlegt.
- **Interaktive Backtest-Sandbox**: Historischer Backtest seit 2016 mit synchronisierten Balancierungs-Schiebereglern.

### 9. 🏛️ Vermögensbilanz & Net Worth Dashboard (`NetWorthDashboard.tsx`)
- **Echte Depot-Marktwerte**: Dynamische Verknüpfung mit dem aktuellen Gesamtportfoliowert (`stats.totalValue`).
- **Netto-Immobilien-Eigenkapital**: Automatische Verrechnung des Immobilienmarktwerts abzüglich der Darlehensrestschuld (`marketValue - loanBalance`).
- **Zinstreppe & Einlagen**: Direkte Berücksichtigung aller Fest- und Tagesgelder aus der Zinstreppe.
- **Persistente manuelle Vermögenswerte**: Freie Anlage von Fahrzeugen, Kunst oder Verbindlichkeiten mit dauerhafter Speicherung im lokalen Speicher.

### 10. 📅 Finanzkalender mit iCal / .ics-Export (`CalendarExportModal.tsx` & `DividendCalendar.tsx`)
- **Universeller Kalender-Export**: Synchronisiere alle Zahltage, Ex-Dividenden-Termine und Festgeld-Fälligkeiten direkt mit Apple Kalender (macOS/iOS), Google Calendar oder Microsoft Outlook.
- **Drei Ereignis-Kategorien**: Erhaltener Cashflow, Zukunfts-Prognosen (3, 6, 12 Monate) und Festgeld-Fälligkeiten.
- **Komfortable Bereitstellung**: 1-Klick-Download als `.ics`-Datei oder Direktkopieren des iCal-Contents in die Zwischenablage.

### 11. 🔁 DRIP Dividenden-Reinvestitions-Automatik (`DripCompoundModal.tsx`)
- **Zinseszins-Simulator (5 bis 30 Jahre)**: Interaktiver Vergleich des Vermögenszuwachses mit automatischer Wiederanlage der Dividenden (DRIP) vs. ohne Reinvestition.
- **Übernahme der Ist-Rendite**: Direkte 1-Klick-Übernahme der tatsächlichen Portfoliorendite in die Simulationsparameter.
- **1-Klick Ausführung**: Reinvestiere alle im laufenden Jahr erhaltenen Dividenden als reale Zukäufe in dein Depot.

### 12. 🛡️ Gesetzliche Einlagensicherung in der Zinstreppe (`DepositLadderWidget.tsx`)
- **Klumpenrisiko-Frühwarnung**: Warnt sofort auffällig, sobald das aggregierte Anlagevolumen bei einem einzelnen Bankinstitut die gesetzliche Einlagensicherung von **100.000 €** übersteigt.
- **Vollständige Bearbeitbarkeit**: In-Place Bearbeitung von Festgeldern, Tagesgeldern und Sparbriefen inklusive Fälligkeitskalender.

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
| **Testing** | Vitest (62 Unit- & Integrationstests), Testing Library React, JSDOM |
| **Code Quality & Typecheck** | TypeScript `tsc -b` (Zero Errors) |
| **Tabellenkalkulation** | SheetJS (`xlsx`) für strukturierte Multi-Sheet Workbooks |
| **OCR & Bildverarbeitung** | Tesseract.js (WASM / WebWorker) & HTML5 Canvas |
| **Verschlüsselung** | Web Crypto API (PBKDF2 + AES-GCM 256-Bit) |
| **Deployment** | Vercel, Netlify, GitHub Pages, Cloudflare Pages |

---

## 🔒 Sicherheit, Auto-Lock & Daten-Tresor (AES-GCM 256)

1. **Zero-Knowledge-Prinzip**: Alle Berechnungen, OCR-Erkennungen und Datenverarbeitungen finden ausschließlich im Browser des Nutzers statt.
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

# 3. Automatisierte Vitest Unit-Tests ausführen (81 Tests in 12 Test-Suites)
npm run test

# 4. TypeScript-Typen prüfen
npm run lint

# 5. Produktions-Build erstellen
npm run build
```

---

## 📝 Changelog & Versionshistorie

### Version 2.5.0 (Aktuell)
- **📄 Universeller DACH-PDF Beleg-Import**:
  - Hinzufügen von `BatchPdfUploadModal.tsx` und `pdfImportUtils.ts`.
  - Vollautomatisches Einlesen von Wertpapier- und Kryptoabrechnungen für Trade Republic, Scalable Capital, ING DiBa, comdirect, DKB, Consorsbank, finanzen.net zero, flatex und Bitpanda.
  - Automatisches Tagging des Brokerhauses (`[Broker: ...]`) für das Multi-Broker-Depot-Mapping.
- **🧬 Portfoliokorrelations- & Diversifikations-Heatmap**:
  - Hinzufügen von `CorrelationHeatmapModal.tsx` und `correlationUtils.ts`.
  - Berechnung der paarweisen Pearson-Korrelationsmatrix, Klumpenerkennung ($r \ge 0,85$) und Diversifikations-Score (0 - 100%) nach der Modernen Portfoliotheorie.
  - Filterung nach Anlageklassen (z. B. nur Aktien/ETFs) und farbcodierte Matrix.
- **🔥 FIRE-Dynamik & Kapitalverzehr-Simulator mit variabler Entnahmerate**:
  - Hinzufügen von `FireWithdrawalSimulatorModal.tsx` und `fireSimulatorUtils.ts`.
  - Flexible Strategien: Guyton-Klinger Leitplanken, Bengen 4%, VPW (Variable Percentage Withdrawal) und fixe Depotquote.
  - Berücksichtigung von gesetzlicher Rente, betrieblicher Altersvorsorge (bAV), Krankenversicherung und Erbe-Zielen mit Recharts Area-Chart.
- **🚀 Sparplan-Dynamisierungs- & Zinseszins-Rechner**:
  - Hinzufügen von `SavingsPlanGrowthModal.tsx` und `savingsGrowthUtils.ts`.
  - Szenarien-Vergleich zwischen fixer Sparrate, jährlicher prozentualer Dynamisierung und festem Step-Up (+50 €/Jahr).
  - Meilenstein-Erreichung (25k bis 1.000k €) und Quantifizierung des Vermögensvorsprungs über bis zu 35 Jahre.
- **🧪 Umfassende Testsuite & Verifikation**:
  - Anstieg auf **81 automatisierte Unit-Tests in 12 Test-Suites** (100% bestanden).
  - Vollständige Typprüfung (`tsc -b` fehlerfrei) und Vite Production-Build.

### Version 2.4.0
- **⚖️ Portfolio-Rebalancing Ausführungs-Assistent & Orderliste**:
  - Hinzufügen von `RebalancingOrderModal.tsx` und `rebalanceUtils.ts`.
  - Dual-Modus: Voll-Rebalance (Kauf/Verkauf) vs. steuerschonender Cashflow-Zukauf (nur Zukäufe ohne Wertpapierverkäufe).
  - Berücksichtigung von frischem Investitionskapital und konfigurierbaren Toleranzbändern (0% - 2%).
  - 1-Klick-Export formatierter Orderlisten für Neobroker in die Zwischenablage.
- **📉 Fondskosten- & TER-Zinseszins-Analyse**:
  - Hinzufügen von `TerExpenseAnalysisModal.tsx` und `terUtils.ts`.
  - Berechnung der gewichteten Gesamtkostenquote (TER) in % und laufender Jahreskosten in Euro.
  - 30-Jahre Zinseszins-Verlustsimulation mit interaktivem Recharts AreaChart und Benchmark-Vergleich gegen 1,80% aktive Bank-Fonds.
- **🪙 Krypto Tax-Loss Harvesting & 1-Jahres-Haltefristen (§ 23 EStG)**:
  - Hinzufügen von `CryptoTaxLossOptimizerModal.tsx` und `cryptoTaxUtils.ts`.
  - Erkennung offener Krypto-Verlusttranchen vor Ablauf der 365-Tage-Spekulationsfrist mit Live-Countdown.
  - Berechnung der realen Einkommensteuerersparnis beim persönlichen Grenzsteuersatz und Verrechnung mit steuerpflichtigen Jahresgewinnen nach § 23 Abs. 3 EStG.
- **📶 PWA Offline-Status & Auto-Sync Monitor**:
  - Hinzufügen von `NetworkStatusIndicator.tsx` mit nahtloser Online/Offline-Erkennung im Header.
  - Automatischer Kurs-Refresh bei Wiederherstellung der Netzwerkverbindung.
- **🧪 Erweiterte Testsuite**:
  - Anstieg auf **71 automatisierte Unit-Tests** (100% bestanden).
  - Fehlerfreier TypeScript Compile (`tsc -b`) und stabiler Production-Build.

### Version 2.3.0
- **🏛️ Multi-Broker Depot-Mapping & Vergleich**:
  - Hinzufügen von `BrokerBreakdownModal.tsx` und `brokerUtils.ts`.
  - Aggregation von Depotwerten, realisierten Gewinnen, Ausschüttungen und Gebühren nach Brokern.
  - Recharts PieChart für die graphische Depotvolumen-Verteilung.
- **📊 Strukturierter Excel Multi-Sheet Export (.xlsx)**:
  - Hinzufügen von `ExcelExportModal.tsx` und `exportUtils.ts` auf Basis von `xlsx`.
  - 6 separate Tabellenblätter: Übersicht, Bestände, Transaktionen, Dividenden, Zinstreppe & DACH Steuer-Report.
- **🔔 Kursalarme & Web Push-Benachrichtigungen**:
  - Hinzufügen von `PriceAlertsModal.tsx` und `alertUtils.ts`.
  - Überwachung von Kurszielen (`ABOVE`), Stop-Loss (`BELOW`) und Tagesverlusten (`DAILY_DROP_PCT`).
  - Integration mit der HTML5 `Notification`-API und Live-Counter an der Header-Glocke.
- **📸 Client-seitige Offline-OCR Texterkennung**:
  - Integration von `tesseract.js` in `ReceiptScannerModal.tsx` für Offline-Texterkennung direkt im WebWorker.
  - Prozentuale Fortschrittsanzeige während des Scan-Vorgangs.
- **🧪 Erweiterte Testsuite**:
  - Anstieg auf **62 automatisierte Unit-Tests** (100% bestanden).
  - Vollständige Typprüfung (`tsc -b` fehlerfrei) und Vite Production-Build.

### Version 2.2.0
- Multi-Währungs Cash-Konten (EUR, USD, CHF, GBP) & FX-Swap Engine.
- E-Mail & Webhook Automations-Dispatcher (n8n, Home Assistant, Make).
- Kirchensteuer-Präzisionsberechnung gem. § 32d EStG (8% BY/BW vs. 9% andere).
- 8-Asset Allokation & 1-Klick 100%-Normalisierung in der Strategie.
- Net Worth Dashboard Verknüpfung mit Immobilien-Eigenkapital und Zinstreppe.
- Marktdaten-Caching mit TTL und Finnhub-Anbindung.
- Mobile Responsive Optimierung.

### Version 2.1.0
- Integration der DRIP-Zinseszins-Simulation (`DripCompoundModal.tsx`).
- Universeller Finanzkalender mit iCal / .ics-Export (`CalendarExportModal.tsx`).
- Smart Beleg- & Foto-Importer (`ReceiptScannerModal.tsx`) mit Canvas-Kontrastverstärkung.
- Erweiterte Krypto-Transaktionen (§ 22 Nr. 3 EStG Staking, Mining, Airdrop).
- Klumpenrisiko-Erkennung in der Zinstreppe (> 100.000 € Einlagensicherung).

---

*Erstellt mit ❤️ für maximale finanzielle Unabhängigkeit, Transparenz und kompromisslosen Datenschutz.*
