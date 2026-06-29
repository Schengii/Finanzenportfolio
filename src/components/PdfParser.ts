import * as pdfjsLib from 'pdfjs-dist';

// Use the CDN worker to avoid bundling issues with Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ParsedTransaction {
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  date: string;
  ticker: string;
  name: string;
  amount: number;
  price: number;
  fee: number;
  tax: number;
  category: 'Stock' | 'ETF' | 'Crypto';
}

export async function parseBrokerPdf(file: File): Promise<ParsedTransaction> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += ' ' + pageText;
  }

  // Basic cleanup
  fullText = fullText.replace(/\s+/g, ' ');

  // Detect broker and extract information
  if (fullText.includes('Trade Republic') || fullText.includes('TRADE REPUBLIC')) {
    return parseTradeRepublic(fullText);
  } else if (fullText.includes('Scalable') || fullText.includes('Baader Bank')) {
    return parseScalableCapital(fullText);
  } else {
    // Generic fallback parsing attempt based on keywords
    return parseGeneric(fullText);
  }
}

function parseTradeRepublic(text: string): ParsedTransaction {
  const isSell = text.includes('Verkauf');
  const isDiv = text.includes('Dividende') || text.includes('Ausschüttung');

  let type: 'BUY' | 'SELL' | 'DIVIDEND' = 'BUY';
  if (isSell) type = 'SELL';
  if (isDiv) type = 'DIVIDEND';

  // Extract date (Format: DD.MM.YYYY)
  const dateMatch = text.match(/(\d{2}\.\d{2}\.\d{4})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  // Extract ISIN (12 char uppercase code usually starting with country code e.g. US, DE)
  const isinMatch = text.match(/\b([A-Z]{2}[A-Z0-9]{9}\d)\b/);
  const ticker = isinMatch ? isinMatch[1] : 'UNKNOWN';

  // Try to find the name of the asset
  // Trade Republic statements typically list the name right before or after the ISIN
  let name = 'Asset';
  const nameMatch = text.match(/(?:Wertpapierabrechnung|Kauf|Verkauf|Dividende)\s+([A-Za-z0-9\s&.\-]+?)\s+(?:ISIN|Stk\.)/i);
  if (nameMatch) {
    name = nameMatch[1].trim();
  } else {
    // Fallback: try to grab text around ISIN
    const parts = text.split(ticker);
    if (parts.length > 0) {
      const segment = parts[0].slice(-50).trim();
      name = segment.replace(/.*?(Kauf|Verkauf|Dividende|Abrechnung)\s+/, '').trim();
    }
  }

  // Extract amount
  // e.g., "5,0000 Stk." or "0,2500 Stk." or "5 Stk."
  let amount = 1;
  const amountMatch = text.match(/(\d+(?:,\d+)?)\s*Stk\./i);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(',', '.'));
  }

  // Extract price per share
  let price = 0;
  const priceMatch = text.match(/(?:Kurs|Preis|Ausschüttung)\s+(\d+(?:,\d+)?)\s*EUR/i);
  if (priceMatch) {
    price = parseFloat(priceMatch[1].replace(',', '.'));
  } else {
    // Try Gesamtbetrag / amount
    const totalMatch = text.match(/(?:Gesamtbetrag|Kurswert)\s+(\d+(?:,\d+)?)\s*EUR/i);
    if (totalMatch) {
      const total = parseFloat(totalMatch[1].replace(',', '.'));
      price = total / (amount || 1);
    }
  }

  // Extract fees
  let fee = 0;
  const feeMatch = text.match(/(?:Fremdkostenzuschlag|Gebühr|Provision)\s+(\d+(?:,\d+)?)\s*EUR/i);
  if (feeMatch) {
    fee = parseFloat(feeMatch[1].replace(',', '.'));
  }

  // Extract taxes
  let tax = 0;
  const taxMatch = text.match(/(?:Kapitalertragsteuer|Quellensteuer|Solidaritätszuschlag)\s+(\d+(?:,\d+)?)\s*EUR/i);
  if (taxMatch) {
    tax = parseFloat(taxMatch[1].replace(',', '.'));
  }

  // Category detection
  let category: 'Stock' | 'ETF' | 'Crypto' = 'Stock';
  if (name.toLowerCase().includes('etf') || name.toLowerCase().includes('msci') || name.toLowerCase().includes('ishares')) {
    category = 'ETF';
  } else if (ticker.startsWith('XC') || name.toLowerCase().includes('bitcoin') || name.toLowerCase().includes('ethereum') || name.toLowerCase().includes('crypto')) {
    category = 'Crypto';
  }

  return { type, date, ticker, name, amount, price, fee, tax, category };
}

function parseScalableCapital(text: string): ParsedTransaction {
  const isSell = text.includes('Verkauf');
  const isDiv = text.includes('Dividende') || text.includes('Ausschüttung');

  let type: 'BUY' | 'SELL' | 'DIVIDEND' = 'BUY';
  if (isSell) type = 'SELL';
  if (isDiv) type = 'DIVIDEND';

  const dateMatch = text.match(/(\d{2}\.\d{2}\.\d{4})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  const isinMatch = text.match(/\b([A-Z]{2}[A-Z0-9]{9}\d)\b/);
  const ticker = isinMatch ? isinMatch[1] : 'UNKNOWN';

  let name = 'Asset';
  const nameMatch = text.match(/(?:Kauf|Verkauf|Dividende)\s+([A-Za-z0-9\s&.\-]+?)\s+(?:ISIN|Stk\.)/i);
  if (nameMatch) {
    name = nameMatch[1].trim();
  }

  let amount = 1;
  const amountMatch = text.match(/(\d+(?:,\d+)?)\s*(?:Stück|Stk\.)/i);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(',', '.'));
  }

  let price = 0;
  const priceMatch = text.match(/(?:Ausführungskurs|Kurs|Dividende)\s+(\d+(?:,\d+)?)\s*EUR/i);
  if (priceMatch) {
    price = parseFloat(priceMatch[1].replace(',', '.'));
  }

  let fee = 0;
  const feeMatch = text.match(/(?:Transaktionsentgelt|Provision)\s+(\d+(?:,\d+)?)\s*EUR/i);
  if (feeMatch) {
    fee = parseFloat(feeMatch[1].replace(',', '.'));
  }

  let tax = 0;
  const taxMatch = text.match(/(?:Quellensteuer|Kapitalertragsteuer)\s+(\d+(?:,\d+)?)\s*EUR/i);
  if (taxMatch) {
    tax = parseFloat(taxMatch[1].replace(',', '.'));
  }

  let category: 'Stock' | 'ETF' | 'Crypto' = 'Stock';
  if (name.toLowerCase().includes('etf') || name.toLowerCase().includes('msci') || name.toLowerCase().includes('ishares')) {
    category = 'ETF';
  } else if (ticker.startsWith('XC') || name.toLowerCase().includes('crypto') || name.toLowerCase().includes('bitcoin')) {
    category = 'Crypto';
  }

  return { type, date, ticker, name, amount, price, fee, tax, category };
}

function parseGeneric(text: string): ParsedTransaction {
  // Simple heuristic parser
  const type = text.includes('Verkauf') || text.includes('SELL') ? 'SELL' : 
               text.includes('Dividende') || text.includes('DIVIDEND') ? 'DIVIDEND' : 'BUY';

  const dateMatch = text.match(/(\d{2}\.\d{2}\.\d{4})/) || text.match(/(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  const isinMatch = text.match(/\b([A-Z]{2}[A-Z0-9]{9}\d)\b/);
  const ticker = isinMatch ? isinMatch[1] : 'GENERIC';

  let name = 'Imported Asset';
  const nameMatch = text.match(/(?:Kauf|Verkauf|Abrechnung|Statement)\s+([A-Za-z0-9\s&.\-]+?)\s+(?:ISIN|Stk|Stück)/i);
  if (nameMatch) name = nameMatch[1].trim();

  let amount = 1;
  const amountMatch = text.match(/(\d+(?:,\d+)?)\s*(?:Stk|Stück|Shares|Units)/i);
  if (amountMatch) amount = parseFloat(amountMatch[1].replace(',', '.'));

  let price = 100;
  const priceMatch = text.match(/(?:Kurs|Price|Betrag)\s+(\d+(?:,\d+)?)/i);
  if (priceMatch) price = parseFloat(priceMatch[1].replace(',', '.'));

  return {
    type,
    date,
    ticker,
    name,
    amount,
    price,
    fee: 1.0,
    tax: 0,
    category: ticker.startsWith('XC') ? 'Crypto' : ticker.includes('ETF') ? 'ETF' : 'Stock'
  };
}
