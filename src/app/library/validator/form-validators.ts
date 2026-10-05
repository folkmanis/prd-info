import { pattern, SchemaPath, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

export function positiveNumericString(path: SchemaPath<string>) {
  validateStandardSchema(path, z.coerce.number().nonnegative());
}

export function trimValidator(path: SchemaPath<string>) {
  pattern(path, /^\S(?:.*\S)?$/, { message: `Atstarpes sākumā un beigās nav atļautas` });
}
