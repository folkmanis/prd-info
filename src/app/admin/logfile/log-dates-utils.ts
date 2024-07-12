import { addDays, endOfDay, isSameDay, isWithinInterval, max, min, startOfDay } from 'date-fns';

export function isValidDate(date: Date, availableDates: Date[]): boolean {
  return date && availableDates.some((d) => isSameDay(date, d));
}

export function validDate(date: Date, availableDates: Date[]): Date | null {
  if (availableDates.length === 0) {
    return null;
  }
  if (isValidDate(date, availableDates)) {
    return date;
  } else {
    return max(availableDates);
  }
}

export function lastDate(availableDates: Date[]): Date | null {
  if (availableDates.length === 0) {
    return null;
  }
  return max(availableDates);
}

export function isFirstDate(date: Date, availableDates: Date[]): boolean {
  return isSameDay(date, min(availableDates));
}

export function isLastDate(date: Date, availableDates: Date[]): boolean {
  return isSameDay(date, max(availableDates));
}

export function shiftDate(date: Date, days: 1 | -1, availableDates: Date[]): Date {
  const interval = {
    start: startOfDay(min(availableDates)),
    end: endOfDay(max(availableDates)),
  };

  let newDate = addDays(date, days);

  while (isWithinInterval(date, interval) && !isValidDate(newDate, availableDates)) {
    newDate = addDays(newDate, days);
  }
  if (!isValidDate(newDate, availableDates)) {
    return date;
  }
  return newDate;
}
