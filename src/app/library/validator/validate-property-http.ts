import { SchemaPath, validateHttp } from '@angular/forms/signals';
import { z } from 'zod';
import { cacheable } from '../http';
import { httpResponseRequest } from '../http/http-resource-request';
import { ValidationResult, ValidationResultSchema } from '../http/validation-result.schema';

export function validatePropertyHttp<T, Z extends z.ZodType<T, string>>(
  reqPath: string,
  schema: SchemaPath<T>,
  key: string,
  validatorSchema: Z,
  subpath = 'validate',
): void {
  validateHttp(schema, {
    debounce: 300,
    request: ({ value }) => {
      const request = z.encode(validatorSchema, value() as z.infer<Z>);
      return httpResponseRequest(`${reqPath}${subpath}/${key}`, cacheable({ value: request }));
    },
    options: {
      parse: ValidationResultSchema.parse,
    },
    onSuccess: (response: ValidationResult) => {
      if (response.valid === true) {
        return null;
      } else {
        return {
          kind: 'used',
          message: `"${response.value}" jau tiek izmantots!`,
        };
      }
    },
    onError: () => ({ kind: 'network_error', message: 'Tīkla kļūda' }),
  });
}
