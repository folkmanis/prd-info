import { map, pipe } from 'rxjs';
import { z } from 'zod';
import { validatorFn } from '../library';

export const DeletedCountSchema = z.object({ deletedCount: z.number() });
export type DeletedCount = z.infer<typeof DeletedCountSchema>;

export const pluckDeletedCount = () =>
  pipe(
    map(validatorFn(DeletedCountSchema)),
    map(({ deletedCount }) => deletedCount),
  );
