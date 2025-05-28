import { z } from 'zod/v4';

export class ValidationError<V> extends Error {
  constructor(protected zodError: z.ZodError<V>) {
    super(z.prettifyError(zodError));
    this.name = 'ValidationError';
  }
}
