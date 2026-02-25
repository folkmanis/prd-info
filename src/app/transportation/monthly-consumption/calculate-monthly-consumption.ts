import { TransportationRouteSheet } from '../interfaces/transportation-route-sheet';
import { OdometerReading } from '../interfaces/transportation-vehicle';
import { ConsumptionData } from './consumption-table/consumption-table.component';

function getMonthKeyFromDate(date: Date): string {
  return getMonthKey(date.getUTCFullYear(), date.getUTCMonth() + 1);
}
function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function calculateMonthlyConsumption(
  year: number,
  odometerData: OdometerReading[],
  routeSheets: TransportationRouteSheet[],
) {
  const monthlyIntervals = calculateMonthlyIntervals(odometerData);
  const monthlyConsumption = new Map<string, ConsumptionData>();
  for (let month = 1; month <= 12; month++) {
    let consumed = 0;
    const monthKey = getMonthKey(year, month);
    routeSheets.forEach((rs) => {
      if (rs.year === year && rs.month === month) {
        rs.fuelPurchases.forEach((fp) => (consumed += fp.amount));
      }
    });
    const mileage = monthlyIntervals.has(monthKey) ? monthlyIntervals.get(monthKey)! : 0;
    monthlyConsumption.set(monthKey, {
      month: monthKey,
      mileage,
      consumed,
      consumptionRate: (consumed / mileage) * 100,
    });
  }
  return [...monthlyConsumption].map(([, value]) => value);
}

function calculateMonthlyIntervals(data: OdometerReading[]): Map<string, number> {
  const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());

  const monthlyMap = new Map<string, number>();

  for (let i = 1; i < sorted.length; i++) {
    const start = sorted[i - 1].date;
    const end = sorted[i].date;

    const valueDiff = sorted[i].value - sorted[i - 1].value;
    const totalMs = end.getTime() - start.getTime();

    let cursor = start;

    while (cursor < end) {
      const nextMonthStart = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));

      const segmentStart = cursor;
      const segmentEnd = nextMonthStart < end ? nextMonthStart : end;

      const segmentMs = segmentEnd.getTime() - segmentStart.getTime();
      const proportionalValue = (segmentMs / totalMs) * valueDiff;

      const key = getMonthKeyFromDate(segmentStart);
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + proportionalValue);

      cursor = segmentEnd;
    }
  }

  return monthlyMap;
}
