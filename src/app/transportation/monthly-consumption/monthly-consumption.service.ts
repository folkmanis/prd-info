import { inject, Service } from '@angular/core';
import { combineLatest, concatMap, filter, from, last, map, mergeMap, Observable, of } from 'rxjs';
import { RouteSheetList, RouteSheetQuery, RouteSheetService } from '../route-sheets';
import { OdometerReading } from '../vehicles/schemas/transportation-vehicle';
import { ConsumptionData, emptyConsumption } from './consumption-data';

const getMonthKeyFromDate = (date: Date): string => getMonthKey(date.getUTCFullYear(), date.getUTCMonth() + 1);

const getMonthKey = (year: number, month: number): string => `${year}-${String(month).padStart(2, '0')}`;

const newMonthlyMap = (year: number) =>
  new Map<string, ConsumptionData>(
    Array.from({ length: 12 }, (_, i) => [getMonthKey(year, i), emptyConsumption(getMonthKey(year, i))]),
  );

function addMileage(
  consumptionMap: Map<string, ConsumptionData>,
  date: Date,
  interval: number,
): Map<string, ConsumptionData> {
  const key = getMonthKeyFromDate(date);
  const data = consumptionMap.get(key);
  if (data) {
    consumptionMap.set(key, {
      ...data,
      mileage: data.mileage + interval,
    });
  }
  return consumptionMap;
}

function addFuelPurchase(
  consumptionMap: Map<string, ConsumptionData>,
  date: Date,
  amount: number,
): Map<string, ConsumptionData> {
  const key = getMonthKeyFromDate(date);
  const data = consumptionMap.get(key);
  if (data) {
    consumptionMap.set(key, {
      ...data,
      consumed: data.consumed + amount,
    });
  }
  return consumptionMap;
}

function calculateMonthlyIntervals(year: number, data: OdometerReading[]): Map<string, ConsumptionData> {
  const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());

  const monthlyMap = newMonthlyMap(year);

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

      addMileage(monthlyMap, segmentStart, proportionalValue);

      cursor = segmentEnd;
    }
  }

  return monthlyMap;
}

function calculateConsumption(consumptionMap: Map<string, ConsumptionData>): ConsumptionData[] {
  return [...consumptionMap.values()].map((c) => ({ ...c, consumptionRate: (c.consumed / c.mileage) * 100 }));
}

@Service()
export class MonthlyConsumptionService {
  #routeService = inject(RouteSheetService);

  getRouteSheetList(params: RouteSheetQuery): Promise<RouteSheetList[]> {
    return this.#routeService.getRouteSheets(params);
  }

  calculateMonthlyConsumption(
    year: number,
    odometerData: OdometerReading[],
    rsIds: { _id: string }[],
  ): Observable<ConsumptionData[]> {
    const monthlyConsumption$ = of(calculateMonthlyIntervals(year, odometerData));

    const rss$ = from(rsIds).pipe(
      concatMap(({ _id: i }) => this.#routeService.getRouteSheet(i)),
      mergeMap(({ fuelPurchases }) => from(fuelPurchases)),
      filter((fp) => fp.date.getUTCFullYear() === year),
    );

    return combineLatest([monthlyConsumption$, rss$]).pipe(
      map(([monthlyConsumption, { date, amount }]) => addFuelPurchase(monthlyConsumption, date, amount)),
      last(),
      map(calculateConsumption),
    );
  }
}
