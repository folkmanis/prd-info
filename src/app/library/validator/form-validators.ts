import { SchemaPath, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

export function positiveNumericString(path: SchemaPath<string>) {
    validateStandardSchema(path, z.coerce.number().positive());
}

