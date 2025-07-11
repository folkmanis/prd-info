import { Injectable, InjectionToken, inject } from '@angular/core';
import { endOfMonth, endOfWeek, endOfYear, format, formatDistanceToNow, formatDistanceToNowStrict, Locale, startOfMonth, startOfWeek, startOfYear, subYears } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const DATE_FNS_LOCALE = new InjectionToken<Locale>('date-fns locale', {
  providedIn: 'root',
  factory: () => enUS,
});

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  private locale = inject<Locale>(DATE_FNS_LOCALE);

  relative(date: Date | string | number, { strict, ...options }: { addSuffix?: boolean; strict?: boolean } = {}): string {
    const defaultOptions = {
      addSuffix: true,
    };

    const params = { ...defaultOptions, ...options, locale: this.locale };
    const distanceFn = strict ? formatDistanceToNowStrict : formatDistanceToNow;

    return distanceFn(toDate(date), params);
  }

  localDate(date: Date): string {
    return format(date, 'P', { locale: this.locale });
  }

  thisWeek() {
    return {
      start: startOfWeek(new Date(), { locale: this.locale }),
      end: endOfWeek(new Date(), { locale: this.locale }),
    };
  }

  thisMonth() {
    return {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    };
  }

  thisYear() {
    return {
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    };
  }

  pastYear() {
    const { start, end } = this.thisYear();
    return {
      start: subYears(start, 1),
      end: subYears(end, 1),
    };
  }
}

function toDate(value: string | number | Date): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value);
  }

  const date = new Date(value);
  if (!(date instanceof Date)) {
    throw new Error(`Unable to convert ${value} into a Date`);
  }

  return date;
}
