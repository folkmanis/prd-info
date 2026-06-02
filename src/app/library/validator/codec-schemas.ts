import { formatISO } from 'date-fns';
import { z } from 'zod';

export const isoDateToDate = z.codec(z.iso.date(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => formatISO(date, { representation: 'date' }),
});
