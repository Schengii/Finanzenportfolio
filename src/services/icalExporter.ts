import type { Transaction } from '../types';

export function generateDividendIcalContent(transactions: Transaction[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FinanzPortfolio CoPilot//Dividenden Kalender//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Portfolio Dividenden Zahltage'
  ];

  // Past and upcoming dividend transactions
  const divTxs = transactions.filter(t => t.type === 'DIVIDEND');

  divTxs.forEach((tx, idx) => {
    const parts = tx.date.split('.');
    if (parts.length === 3) {
      const year = parts[2];
      const month = parts[1].padStart(2, '0');
      const day = parts[0].padStart(2, '0');
      const dtStart = `${year}${month}${day}T090000Z`;
      const dtEnd = `${year}${month}${day}T100000Z`;

      lines.push(
        'BEGIN:VEVENT',
        `UID:div-${tx.id || idx}@finanzenportfolio.copilot`,
        `DTSTAMP:${dtStart}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:💰 Dividende: ${tx.name} (${tx.ticker})`,
        `DESCRIPTION:Gutschrift von ${tx.amount} Stück ${tx.name}. Brutto: ${(tx.amount * tx.price).toFixed(2)} EUR.`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    }
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcalCalendar(transactions: Transaction[]): void {
  const content = generateDividendIcalContent(transactions);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dividenden_kalender_${new Date().toISOString().split('T')[0]}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
