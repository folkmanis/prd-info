import { map, pipe } from 'rxjs';
import { z } from 'zod';
import { validatorFn } from '../library';

export const ModifiedCountSchema = z.object({ modifiedCount: z.number() });
export type ModifiedCount = z.infer<typeof ModifiedCountSchema>;

export const pluckModifiedCount = () =>
  pipe(
    map(validatorFn(ModifiedCountSchema)),
    map(({ modifiedCount }) => modifiedCount),
  );
