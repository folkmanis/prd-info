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

export const stringToArray = <T>(schema: ZodType<T>, separator = ',') =>
  z.codec(z.string(), z.array(schema), {
    decode: (str) => str.split(separator),
    encode: (arr) => arr.join(separator),
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

type OptionalToNullableShape<S extends z.ZodRawShape> = {
  [K in keyof S]: S[K] extends z.ZodOptional<infer U> ? z.ZodNullable<U> : S[K];
};
export const optionalToNullable = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  z.object(
    Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => [
        key,
        value instanceof z.ZodOptional ? value.nullable() : value,
      ]),
    ) as OptionalToNullableShape<T>,
  );
