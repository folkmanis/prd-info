import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { formatDistanceToNow, formatDistanceToNowStrict, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const DATE_FNS_LOCALE = new InjectionToken<Locale>('date-fns locale', {
  providedIn: 'root',
  factory: () => enUS,
});


@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  private locale: Locale;

  constructor(
    @Inject(DATE_FNS_LOCALE) locale: Locale,
  ) {
    this.locale = locale || enUS;
  }

  relative(date: Date | string | number, { strict, ...options }: { addSuffix?: boolean; strict?: boolean; } = {}): string {

    const defaultOptions = {
      addSuffix: true,
    };

    const params = { ...defaultOptions, ...options, locale: this.locale };
    const distanceFn = strict ? formatDistanceToNowStrict : formatDistanceToNow;

    return distanceFn(toDate(date), params);
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
