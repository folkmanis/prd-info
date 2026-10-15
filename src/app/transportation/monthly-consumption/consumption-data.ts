export interface ConsumptionData {
  month: string;
  mileage: number;
  consumed: number;
  consumptionRate: number;
}

export const emptyConsumption: (monthKey: string) => ConsumptionData = (monthKey) => ({
  month: monthKey,
  mileage: 0,
  consumed: 0,
  consumptionRate: 0,
});
