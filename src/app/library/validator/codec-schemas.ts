import { formatISO } from 'date-fns';
import { z, ZodType } from 'zod';

export const isoDateToDate = z.codec(z.iso.date(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => formatISO(date, { representation: 'date' }),
});

export const isoDatetimeToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
});

export const stringToInt = z.codec(z.string().regex(z.regexes.integer), z.int(), {
  decode: (str) => Number.parseInt(str, 10),
  encode: (num) => num.toString(),
});

export const stringToArray = <T>(schema: ZodType<T>) =>
  z.codec(z.string(), z.array(schema), {
    decode: (str) => str.split(','),
    encode: (arr) => arr.join(','),
  });

export const nullableString = z.codec(z.string().nullable().optional(), z.string(), {
  decode: (str) => str ?? '',
  encode: (str) => (str.length > 0 ? str : null),
});

export const optionalString = z.codec(z.string().optional(), z.string(), {
  decode: (str) => str ?? '',
  encode: (str) => str || undefined,
});

export const optionalNumberToString = z.codec(z.number().optional(), z.string(), {
  decode: (value) => (typeof value === 'number' ? value.toString() : ''),
  encode: (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  },
});

export const numberToString = z.codec(z.number(), z.string(), {
  decode: (value) => (typeof value === 'number' ? value.toString() : ''),
  encode: (value, ctx) => {
    const num = Number(value);
    if (Number.isFinite(num)) {
      return num;
    } else {
      ctx.issues.push({
        code: 'invalid_value',
        input: value,
        message: 'Nepareizs skaitļa formāts',
        values: [num],
      });
      return z.NEVER;
    }
  },
});
