import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RouteSheetList, RouteSheetQuery, RouteSheetService } from '../route-sheets';
import { OdometerReading } from '../vehicles/schemas/transportation-vehicle';
import { ConsumptionData } from './consumption-table/consumption-table.component';

const getMonthKeyFromDate = (date: Date): string => getMonthKey(date.getUTCFullYear(), date.getUTCMonth() + 1);

const getMonthKey = (year: number, month: number): string => `${year}-${String(month).padStart(2, '0')}`;

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

@Service()
export class MonthlyConsumptionService {
  #routeService = inject(RouteSheetService);

  async calculateMonthlyConsumption(year: number, odometerData: OdometerReading[], rsIds: { _id: string }[]) {
    const monthlyIntervals = calculateMonthlyIntervals(odometerData);
    const monthlyConsumption = new Map<string, ConsumptionData>();

    for (let month = 1; month <= 12; month++) {
      let consumed = 0;
      const monthKey = getMonthKey(year, month);
      for await (const rs of this.#getRouteSheets(rsIds))
        if (rs.year === year && rs.month === month) {
          rs.fuelPurchases.forEach((fp) => (consumed += fp.amount));
        }
      const mileage = monthlyIntervals.get(monthKey) ?? 0;
      monthlyConsumption.set(monthKey, {
        month: monthKey,
        mileage,
        consumed,
        consumptionRate: (consumed / mileage) * 100,
      });
    }
    return [...monthlyConsumption.values()];
  }

  getRouteSheetList(params: RouteSheetQuery): Promise<RouteSheetList[]> {
    return this.#routeService.getRouteSheets(params);
  }

  async *#getRouteSheets(ids: { _id: string }[]) {
    for (const { _id } of ids) {
      const rs = firstValueFrom(this.#routeService.getRouteSheet(_id));
      yield rs;
    }
  }
}
